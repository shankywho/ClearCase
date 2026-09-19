import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import crypto from 'crypto';
import { CaseRepository } from './db/CaseRepository';
import { PartyRepository } from './db/PartyRepository';
import { AuditRepository } from './db/AuditRepository';
import { getTableName } from './db/client';
import { orchestrateDisputeAnalysis } from './services/aiService';
import { evaluateDualPartyConsent, generateOtp } from './services/otpService';
import { anchorSettlement, generateSettlementHash } from './services/blockchainService';
import {
  generatePresignedUploadUrl,
  generateSettlementAudio,
  getAudioExtension,
  uploadGrievanceAudio,
} from './services/mediaService';
import { extractPrincipal, isAuthorized } from './authz/cedarService';
import { CaseStatus, CedarPrincipal, PartyItem } from './types';

const caseRepo = new CaseRepository();
const partyRepo = new PartyRepository();
const auditRepo = new AuditRepository();

/**
 * Strip sensitive or internal fields from party items before exposing them
 * via API responses. OTP codes must never leave the server outside of the
 * simulated SMS/IVR dispatch.
 */
const sanitizeParty = (party: PartyItem): Omit<PartyItem, 'otp'> => {
  const { otp, ...publicParty } = party;
  return publicParty;
};

const jsonResponse = (
  statusCode: number,
  body: Record<string, any>,
  principal?: CedarPrincipal
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,PATCH,DELETE',
      'Access-Control-Allow-Headers':
        'Content-Type,Authorization,X-Amz-Date,X-Api-Key,x-user-id,x-user-role,x-user-jurisdiction',
    },
    body: JSON.stringify({
      ...body,
      ...(principal ? { _caller: { id: principal.id, role: principal.role, jurisdiction: principal.jurisdiction } } : {}),
    }),
  };
};

/**
 * ClearCase Catch-All API Gateway Lambda Handler
 */
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const method = event.httpMethod;
  const path = event.path;
  const principal = extractPrincipal(event.headers);

  console.log(`[API Gateway Lambda] Incoming Request: ${method} ${path} by [${principal.id} (${principal.role})]`);

  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    return jsonResponse(200, { message: 'CORS OK' });
  }

  try {
    // -------------------------------------------------------------------------
    // 1. Health Check (Public)
    // -------------------------------------------------------------------------
    if (path === '/' || path === '/health') {
      return jsonResponse(200, {
        status: 'UP',
        service: 'ClearCase Backend API',
        table: getTableName(),
        environment: process.env.AWS_SAM_LOCAL === 'true' ? 'SAM_LOCAL' : 'AWS_CLOUD',
        timestamp: new Date().toISOString(),
      });
    }

    // -------------------------------------------------------------------------
    // 1b. My Cases Listing: GET /cases?phone=<e164> (Cedar Guarded)
    // -------------------------------------------------------------------------
    if (method === 'GET' && path === '/cases') {
      const phoneParam = event.queryStringParameters?.phone || principal.id;

      // A citizen may only list their OWN cases (privacy isolation)
      const callerClean = (principal.id || '').replace(/[^0-9+]/g, '');
      const phoneClean = (phoneParam || '').replace(/[^0-9+]/g, '');

      if (!phoneClean) {
        return jsonResponse(400, {
          error: 'Field "phone" query parameter (or valid x-user-id) is required.',
        }, principal);
      }

      if (callerClean && phoneClean !== callerClean) {
        const privacyReason = `Access Denied: Citizens may only list their own cases. Requested "${phoneClean}", caller "${callerClean}".`;
        console.warn(`[Cedar AuthZ] DENY -> ${privacyReason}`);
        return jsonResponse(403, { error: 'Forbidden', message: privacyReason }, principal);
      }

      console.log(`[API Gateway Lambda] Listing cases for party phone: ${phoneClean}`);
      const partyRows = await partyRepo.getPartiesForPhone(phoneClean);
      const caseIds = [...new Set(partyRows.map((p) => p.caseId))];
      const cases = (
        await Promise.all(caseIds.map((id) => caseRepo.getCaseById(id)))
      ).filter((c) => c !== null);

      // Most recently updated first
      cases.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      return jsonResponse(
        200,
        {
          phone: phoneClean,
          count: cases.length,
          cases,
        },
        principal
      );
    }

    // -------------------------------------------------------------------------
    // 2. Mediator Queue: GET /mediator-queue or /mediator/queue (Cedar Guarded)
    // -------------------------------------------------------------------------
    if (method === 'GET' && (path === '/mediator-queue' || path === '/mediator/queue')) {
      const requestedDistrict =
        event.queryStringParameters?.district || principal.jurisdiction;
      const status = event.queryStringParameters?.status as CaseStatus | undefined;

      // Evaluate Cedar Rule 3: Mediator Queue Guard
      const authz = await isAuthorized(
        principal,
        'ListMediatorQueue',
        {
          id: 'MediatorDashboard',
          type: 'MediatorDashboard',
        }
      );

      if (!authz.authorized) {
        return jsonResponse(403, { error: 'Forbidden', message: authz.reason }, principal);
      }

      // Check jurisdiction match: Mediator cannot inspect another district's queue
      if (
        requestedDistrict &&
        principal.jurisdiction &&
        requestedDistrict.trim().toLowerCase() !== principal.jurisdiction.trim().toLowerCase()
      ) {
        const crossReason = `Access Denied: Mediator for jurisdiction "${principal.jurisdiction}" cannot access "${requestedDistrict}" queue.`;
        console.warn(`[Cedar AuthZ] DENY -> ${crossReason}`);
        return jsonResponse(403, { error: 'Forbidden', message: crossReason }, principal);
      }

      const queryDistrict = requestedDistrict || principal.jurisdiction!;
      console.log(`[API Gateway Lambda] Querying mediator queue for district: ${queryDistrict}, status: ${status || 'ESCALATED'}`);

      // Query GSI1 for mediator queue
      const cases = await caseRepo.queryMediatorQueue(queryDistrict, status || 'ESCALATED');

      return jsonResponse(
        200,
        {
          district: queryDistrict,
          count: cases.length,
          cases,
        },
        principal
      );
    }

    // -------------------------------------------------------------------------
    // 3. Dispute Intake: POST /cases (Public or Authenticated)
    // -------------------------------------------------------------------------
    if (method === 'POST' && path === '/cases') {
      const body = JSON.parse(event.body || '{}');

      if (!body.title || !body.description || !body.district || !body.state) {
        return jsonResponse(400, {
          error: 'Missing required fields: title, description, district, state.',
        });
      }

      const caseId = body.id || crypto.randomUUID();
      console.log(`[API Gateway Lambda] Intake new case: "${body.title}" in ${body.district}`);

      // Voice-first intake: accept an inline base64 audio blob and persist to S3
      let originalAudioUrl = body.originalAudioUrl;
      if (body.audioBase64 && typeof body.audioBase64 === 'string') {
        console.log(
          `[API Gateway Lambda] Inline base64 grievance audio detected (${body.audioBase64.length} chars).`
        );
        originalAudioUrl = await uploadGrievanceAudio(
          caseId,
          body.audioBase64,
          body.audioContentType
        );
      }

      const newCase = await caseRepo.createCase({
        ...body,
        id: caseId,
        originalAudioUrl,
      });

      await auditRepo.recordEvent(newCase.id, 'CASE_CREATED', principal.id, {
        title: newCase.title,
        district: newCase.district,
        state: newCase.state,
      });

      // If petitioner details are provided at intake, register petitioner & issue OTP
      if (body.petitioner && body.petitioner.name && body.petitioner.phone) {
        console.log(`[API Gateway Lambda] Registering petitioner for case: ${newCase.id}`);
        const otpInfo = generateOtp(body.petitioner.phone);
        await partyRepo.addParty(newCase.id, {
          name: body.petitioner.name,
          phone: body.petitioner.phone,
          role: 'PETITIONER',
          otp: otpInfo.otp,
        });

        await auditRepo.recordEvent(newCase.id, 'PARTY_JOINED', body.petitioner.phone, {
          role: 'PETITIONER',
          name: body.petitioner.name,
        });

        await auditRepo.recordEvent(newCase.id, 'OTP_SENT', 'SYSTEM', {
          recipient: body.petitioner.phone,
          role: 'PETITIONER',
        });
      }

      // Trigger AI Multi-Agent Pipeline
      console.log(`[API Gateway Lambda] Triggering AI orchestration for case: ${newCase.id}`);
      const aiAnalysis = await orchestrateDisputeAnalysis({
        audioRef: body.originalAudioUrl,
        transcript: body.transcribedText || body.description,
        dialect: body.dialect,
        state: body.state,
        district: body.district,
      });

      const targetStatus: CaseStatus = aiAnalysis.suggestedStatus;

      const updatedCase = await caseRepo.updateCaseStatus(newCase.id, {
        status: targetStatus,
        confidenceScore: aiAnalysis.draft.confidenceScore,
        escalationReason: aiAnalysis.draft.escalationReason,
        statutoryReferences: aiAnalysis.statutes,
        settlementDraft: aiAnalysis.draft.suggestedDraft,
        transcribedText: aiAnalysis.transcription.originalText,
        englishTranslation: aiAnalysis.transcription.englishText,
      });

      await auditRepo.recordEvent(newCase.id, 'AI_ANALYSIS_COMPLETED', 'BEDROCK_AGENT', {
        status: targetStatus,
        confidenceScore: aiAnalysis.draft.confidenceScore,
        applicableSection: aiAnalysis.draft.applicableSection,
      });

      if (targetStatus === 'ESCALATED') {
        await auditRepo.recordEvent(newCase.id, 'ESCALATED_TO_MEDIATOR', 'SYSTEM', {
          reason: aiAnalysis.draft.escalationReason,
          confidenceScore: aiAnalysis.draft.confidenceScore,
        });
      }

      return jsonResponse(
        201,
        {
          message:
            targetStatus === 'ESCALATED'
              ? 'Case registered and escalated to Panchayat Mediator Queue (< 0.70 confidence)'
              : 'Case registered and settlement proposal formulated successfully',
          case: updatedCase,
          aiAnalysis: {
            confidenceScore: aiAnalysis.draft.confidenceScore,
            status: targetStatus,
            applicableSection: aiAnalysis.draft.applicableSection,
            settlementDraft: aiAnalysis.draft.suggestedDraft,
            escalationReason: aiAnalysis.draft.escalationReason,
          },
        },
        principal
      );
    }

    // -------------------------------------------------------------------------
    // 4. Case AI Re-Analysis: POST /cases/{id}/analyze
    // -------------------------------------------------------------------------
    const caseAnalyzeMatch = path.match(/^\/cases\/([^/]+)\/analyze$/);
    if (method === 'POST' && caseAnalyzeMatch) {
      const caseId = caseAnalyzeMatch[1];
      const existingCase = await caseRepo.getCaseById(caseId);

      if (!existingCase) {
        return jsonResponse(404, { error: `Case ${caseId} not found.` });
      }

      const parties = await partyRepo.getPartiesForCase(caseId);
      const authz = await isAuthorized(
        principal,
        'UpdateCase',
        {
          id: caseId,
          type: 'Case',
          parties: parties.map((p) => p.phone),
          jurisdiction: existingCase.district,
        }
      );

      if (!authz.authorized) {
        return jsonResponse(403, { error: 'Forbidden', message: authz.reason }, principal);
      }

      const aiAnalysis = await orchestrateDisputeAnalysis({
        audioRef: existingCase.originalAudioUrl,
        transcript: existingCase.transcribedText || existingCase.description,
        dialect: existingCase.dialect,
        state: existingCase.state,
        district: existingCase.district,
      });

      const updatedCase = await caseRepo.updateCaseStatus(caseId, {
        status: aiAnalysis.suggestedStatus,
        confidenceScore: aiAnalysis.draft.confidenceScore,
        escalationReason: aiAnalysis.draft.escalationReason,
        statutoryReferences: aiAnalysis.statutes,
        settlementDraft: aiAnalysis.draft.suggestedDraft,
        transcribedText: aiAnalysis.transcription.originalText,
        englishTranslation: aiAnalysis.transcription.englishText,
      });

      await auditRepo.recordEvent(caseId, 'AI_ANALYSIS_COMPLETED', principal.id, {
        status: aiAnalysis.suggestedStatus,
        confidenceScore: aiAnalysis.draft.confidenceScore,
      });

      return jsonResponse(200, {
        message: `Analysis completed: Status set to ${aiAnalysis.suggestedStatus}`,
        case: updatedCase,
        aiAnalysis,
      }, principal);
    }

    // -------------------------------------------------------------------------
    // 5. Party Join: POST /cases/{id}/join (or /cases/{id}/parties)
    // -------------------------------------------------------------------------
    const caseJoinMatch = path.match(/^\/cases\/([^/]+)\/(?:join|parties)$/);
    if (method === 'POST' && caseJoinMatch) {
      const caseId = caseJoinMatch[1];
      const body = JSON.parse(event.body || '{}');

      if (!body.name || !body.phone) {
        return jsonResponse(400, { error: 'Fields "name" and "phone" are required.' });
      }

      const existingCase = await caseRepo.getCaseById(caseId);
      if (!existingCase) {
        return jsonResponse(404, { error: `Case ${caseId} not found.` });
      }

      const role = body.role || 'RESPONDENT';
      const otpInfo = generateOtp(body.phone);

      console.log(`[API Gateway Lambda] Registering party ${body.name} (${role}) for case ${caseId}`);
      const party = await partyRepo.addParty(caseId, {
        name: body.name,
        phone: body.phone,
        role,
        otp: otpInfo.otp,
      });

      await auditRepo.recordEvent(caseId, 'PARTY_JOINED', body.phone, {
        name: body.name,
        role,
      });

      await auditRepo.recordEvent(caseId, 'OTP_SENT', 'SYSTEM', {
        recipient: body.phone,
        role,
      });

      return jsonResponse(201, {
        message: `Party registered as ${role}. OTP dispatched via SMS/IVR.`,
        party: sanitizeParty(party),
      }, principal);
    }

    // -------------------------------------------------------------------------
    // 6. Dual-Party Consent Confirmation: POST /cases/{id}/confirm (or /consent)
    // -------------------------------------------------------------------------
    const caseConfirmMatch = path.match(/^\/cases\/([^/]+)\/(?:confirm|consent)$/);
    if (method === 'POST' && caseConfirmMatch) {
      const caseId = caseConfirmMatch[1];
      const body = JSON.parse(event.body || '{}');
      const phone = body.phone || principal.id;
      const otp = body.otp;

      if (!phone || !otp) {
        return jsonResponse(400, { error: 'Fields "phone" and "otp" are required.' });
      }

      const existingCase = await caseRepo.getCaseById(caseId);
      if (!existingCase) {
        return jsonResponse(404, { error: `Case ${caseId} not found.` });
      }

      const parties = await partyRepo.getPartiesForCase(caseId);

      // Cedar Rule 1 check: Caller must be a party to the case
      const authz = await isAuthorized(
        principal.id === 'anonymous' ? { id: phone, role: 'CITIZEN' } : principal,
        'ConfirmConsent',
        {
          id: caseId,
          type: 'Case',
          parties: parties.map((p) => p.phone),
          jurisdiction: existingCase.district,
        }
      );

      if (!authz.authorized) {
        return jsonResponse(403, { error: 'Forbidden', message: authz.reason }, principal);
      }

      console.log(`[API Gateway Lambda] Verifying OTP consent for ${phone} in case ${caseId}`);
      let updatedParty;
      try {
        updatedParty = await partyRepo.verifyPartyOtpAndConsent(caseId, {
          phone,
          otp,
        });
      } catch (err: any) {
        return jsonResponse(400, { error: err.message || 'OTP verification failed.' });
      }

      await auditRepo.recordEvent(caseId, 'OTP_VERIFIED', phone, {
        consentStatus: 'ACCEPTED',
      });

      // Trigger atomic dual-party consent check
      const consentEvaluation = await evaluateDualPartyConsent(caseId);

      return jsonResponse(200, {
        message: consentEvaluation.consentAchieved
          ? 'Dual-party digital consent achieved! Case ready for on-chain anchoring.'
          : 'OTP verified. Waiting for other party consent.',
        party: sanitizeParty(updatedParty),
        consentEvaluation: {
          ...consentEvaluation,
          parties: consentEvaluation.parties.map(sanitizeParty),
        },
      }, principal);
    }

    // -------------------------------------------------------------------------
    // 7. Manual Escalation: POST /cases/{id}/escalate
    // -------------------------------------------------------------------------
    const caseEscalateMatch = path.match(/^\/cases\/([^/]+)\/escalate$/);
    if (method === 'POST' && caseEscalateMatch) {
      const caseId = caseEscalateMatch[1];
      const body = JSON.parse(event.body || '{}');

      const existingCase = await caseRepo.getCaseById(caseId);
      if (!existingCase) {
        return jsonResponse(404, { error: `Case ${caseId} not found.` });
      }

      const parties = await partyRepo.getPartiesForCase(caseId);
      const authz = await isAuthorized(
        principal,
        'EscalateCase',
        {
          id: caseId,
          type: 'Case',
          parties: parties.map((p) => p.phone),
          jurisdiction: existingCase.district,
        }
      );

      if (!authz.authorized) {
        return jsonResponse(403, { error: 'Forbidden', message: authz.reason }, principal);
      }

      const escalationReason = body.reason || 'Manual escalation requested for Panchayat mediator review';

      const updatedCase = await caseRepo.updateCaseStatus(caseId, {
        status: 'ESCALATED',
        escalationReason,
      });

      await auditRepo.recordEvent(caseId, 'ESCALATED_TO_MEDIATOR', principal.id, {
        reason: escalationReason,
      });

      return jsonResponse(200, {
        message: 'Case escalated to Panchayat Mediator Queue successfully',
        case: updatedCase,
      }, principal);
    }

    // -------------------------------------------------------------------------
    // 8. Mediator Review & Draft Override: PATCH /cases/{id}/mediator-review
    // -------------------------------------------------------------------------
    const caseReviewMatch = path.match(/^\/cases\/([^/]+)\/mediator-review$/);
    if (method === 'PATCH' && caseReviewMatch) {
      const caseId = caseReviewMatch[1];
      const body = JSON.parse(event.body || '{}');

      const existingCase = await caseRepo.getCaseById(caseId);
      if (!existingCase) {
        return jsonResponse(404, { error: `Case ${caseId} not found.` });
      }

      const parties = await partyRepo.getPartiesForCase(caseId);

      // Cedar Rule 2 check: Caller must be a Mediator in the same jurisdiction
      const authz = await isAuthorized(
        principal,
        'ReviewCase',
        {
          id: caseId,
          type: 'Case',
          parties: parties.map((p) => p.phone),
          jurisdiction: existingCase.district,
        }
      );

      if (!authz.authorized) {
        return jsonResponse(403, { error: 'Forbidden', message: authz.reason }, principal);
      }

      if (!body.settlementDraft) {
        return jsonResponse(400, { error: 'Field "settlementDraft" is required.' });
      }

      console.log(`[API Gateway Lambda] Mediator ${principal.id} submitting revised draft for case ${caseId}`);

      // Update case to MEDIATOR_APPROVED with revised draft
      const updatedCase = await caseRepo.updateCaseStatus(caseId, {
        status: 'MEDIATOR_APPROVED',
        settlementDraft: body.settlementDraft,
        statutoryReferences: body.statutoryReferences || existingCase.statutoryReferences,
        escalationReason: body.notes || 'Draft revised and approved by Human Panchayat Mediator',
      });

      // Reset party consent and issue fresh OTPs for both parties
      const resetParties = await partyRepo.resetPartiesConsent(caseId);

      await auditRepo.recordEvent(caseId, 'MEDIATOR_OVERRIDE', principal.id, {
        mediatorJurisdiction: principal.jurisdiction,
        notes: body.notes,
        partiesResetCount: resetParties.length,
      });

      return jsonResponse(200, {
        message: 'Mediator draft review recorded. Disputant consents reset to PENDING with fresh OTPs.',
        case: updatedCase,
        parties: resetParties.map(sanitizeParty),
      }, principal);
    }

    // -------------------------------------------------------------------------
    // 8b. Presigned Audio Upload: POST /cases/{id}/upload-url (Cedar Guarded)
    // -------------------------------------------------------------------------
    const caseUploadUrlMatch = path.match(/^\/cases\/([^/]+)\/upload-url$/);
    if (method === 'POST' && caseUploadUrlMatch) {
      const caseId = caseUploadUrlMatch[1];
      const existingCase = await caseRepo.getCaseById(caseId);

      if (!existingCase) {
        return jsonResponse(404, { error: `Case ${caseId} not found.` });
      }

      const parties = await partyRepo.getPartiesForCase(caseId);
      const authz = await isAuthorized(
        principal,
        'UpdateCase',
        {
          id: caseId,
          type: 'Case',
          parties: parties.map((p) => p.phone),
          jurisdiction: existingCase.district,
        }
      );

      if (!authz.authorized) {
        return jsonResponse(403, { error: 'Forbidden', message: authz.reason }, principal);
      }

      const body = JSON.parse(event.body || '{}');
      const contentType = body.contentType || 'audio/webm';
      const extension = body.extension || getAudioExtension(contentType);

      const upload = await generatePresignedUploadUrl(caseId, contentType, extension);

      // Register the target S3 URI on the case so AI/analyze can locate the audio
      await caseRepo.updateCaseAudio(caseId, { originalAudioUrl: upload.s3Uri });

      console.log(`[API Gateway Lambda] Presigned upload issued for Case: ${caseId} -> ${upload.objectKey}`);

      return jsonResponse(200, {
        message: 'Presigned upload URL issued. PUT the audio recording to this URL.',
        caseId,
        uploadUrl: upload.uploadUrl,
        originalAudioUrl: upload.s3Uri,
        expiresIn: upload.expiresIn,
      }, principal);
    }

    // -------------------------------------------------------------------------
    // 8c. Settlement TTS Synthesis: POST /cases/{id}/tts (Cedar Guarded)
    // -------------------------------------------------------------------------
    const caseTtsMatch = path.match(/^\/cases\/([^/]+)\/tts$/);
    if (method === 'POST' && caseTtsMatch) {
      const caseId = caseTtsMatch[1];
      const existingCase = await caseRepo.getCaseById(caseId);

      if (!existingCase) {
        return jsonResponse(404, { error: `Case ${caseId} not found.` });
      }

      const parties = await partyRepo.getPartiesForCase(caseId);
      const authz = await isAuthorized(
        principal,
        'ReadCase',
        {
          id: caseId,
          type: 'Case',
          parties: parties.map((p) => p.phone),
          jurisdiction: existingCase.district,
        }
      );

      if (!authz.authorized) {
        return jsonResponse(403, { error: 'Forbidden', message: authz.reason }, principal);
      }

      const body = JSON.parse(event.body || '{}');
      const text = body.text || existingCase.settlementDraft || existingCase.description;

      if (!text) {
        return jsonResponse(400, {
          error: 'No settlement text available for TTS synthesis.',
          message: 'Provide "text" in the request body or ensure the case has a settlementDraft.',
        });
      }

      const dialect = body.dialect || existingCase.dialect || 'hindi';

      console.log(`[API Gateway Lambda] Generating settlement TTS audio for Case: ${caseId} in "${dialect}"`);
      const settlementAudioUrl = await generateSettlementAudio(caseId, text, dialect);

      const updatedCase = await caseRepo.updateCaseAudio(caseId, { settlementAudioUrl });

      await auditRepo.recordEvent(caseId, 'SETTLEMENT_AUDIO_GENERATED', principal.id, {
        dialect,
        settlementAudioUrl,
      });

      return jsonResponse(200, {
        message: `Settlement audio synthesized for vernacular playback ("${dialect}").`,
        case: updatedCase,
        settlementAudioUrl,
        dialect,
      }, principal);
    }

    // -------------------------------------------------------------------------
    // 9. Case Audit Trail: GET /cases/{id}/audit (Cedar Guarded)
    // -------------------------------------------------------------------------
    const caseAuditMatch = path.match(/^\/cases\/([^/]+)\/audit$/);
    if (method === 'GET' && caseAuditMatch) {
      const caseId = caseAuditMatch[1];
      const existingCase = await caseRepo.getCaseById(caseId);

      if (!existingCase) {
        return jsonResponse(404, { error: `Case ${caseId} not found.` });
      }

      const parties = await partyRepo.getPartiesForCase(caseId);

      const authz = await isAuthorized(
        principal,
        'ReadAuditTrail',
        {
          id: caseId,
          type: 'Case',
          parties: parties.map((p) => p.phone),
          jurisdiction: existingCase.district,
        }
      );

      if (!authz.authorized) {
        return jsonResponse(403, { error: 'Forbidden', message: authz.reason }, principal);
      }

      const auditTrail = await auditRepo.getAuditTrail(caseId);
      return jsonResponse(200, {
        caseId,
        count: auditTrail.length,
        auditTrail,
      }, principal);
    }

    // -------------------------------------------------------------------------
    // 10. Blockchain Settlement Anchoring: POST /cases/{id}/anchor
    // -------------------------------------------------------------------------
    const caseAnchorMatch = path.match(/^\/cases\/([^/]+)\/anchor$/);
    if (method === 'POST' && caseAnchorMatch) {
      const caseId = caseAnchorMatch[1];
      console.log(`[API Gateway Lambda] Blockchain anchoring requested for Case: ${caseId}`);

      const existingCase = await caseRepo.getCaseById(caseId);
      if (!existingCase) {
        return jsonResponse(404, { error: `Case ${caseId} not found.` }, principal);
      }

      const parties = await partyRepo.getPartiesForCase(caseId);

      // Cedar check: Caller must be an authorized party or in-jurisdiction mediator
      const authz = await isAuthorized(
        principal,
        'UpdateCase',
        {
          id: caseId,
          type: 'Case',
          parties: parties.map((p) => p.phone),
          jurisdiction: existingCase.district,
        }
      );

      if (!authz.authorized) {
        return jsonResponse(403, { error: 'Forbidden', message: authz.reason }, principal);
      }

      // Verification Guard: Case MUST be in status CONSENT_ACHIEVED
      if (existingCase.status !== 'CONSENT_ACHIEVED') {
        const errorMsg = `Cannot anchor settlement on-chain: Case must be in status "CONSENT_ACHIEVED" with mutual OTP verification from both parties. Current status is "${existingCase.status}".`;
        console.warn(`[Blockchain: Polygon Amoy] ❌ Anchoring Rejected: ${errorMsg}`);
        return jsonResponse(
          400,
          {
            error: 'PRECONDITION_FAILED',
            message: errorMsg,
            currentStatus: existingCase.status,
          },
          principal
        );
      }

      // Compute canonical SHA-256 settlement hash
      const settlementText = existingCase.settlementDraft || existingCase.description;
      const partyPhones = parties.map((p) => p.phone);
      const settlementHash = generateSettlementHash(caseId, settlementText, partyPhones);

      // Broadcast / Simulate transaction on Polygon Amoy
      const receipt = await anchorSettlement(settlementHash, caseId);

      // Transition case to ANCHORED in DynamoDB
      const updatedCase = await caseRepo.updateCaseStatus(caseId, {
        status: 'ANCHORED',
        onChainTxHash: receipt.txHash,
      });

      // Record immutable audit event
      await auditRepo.recordEvent(caseId, 'ANCHORED_ON_CHAIN', principal.id, {
        txHash: receipt.txHash,
        settlementHash: receipt.settlementHash,
        blockNumber: receipt.blockNumber,
        explorerUrl: receipt.explorerUrl,
        network: receipt.network,
      });

      return jsonResponse(
        200,
        {
          message:
            'Settlement successfully anchored on Polygon Amoy blockchain. Case is now tamper-proof and immutable.',
          case: updatedCase,
          receipt,
        },
        principal
      );
    }

    // -------------------------------------------------------------------------
    // 11. Case Full Aggregate: GET /cases/{id}/full (Cedar Guarded)
    // -------------------------------------------------------------------------
    const caseFullMatch = path.match(/^\/cases\/([^/]+)\/full$/);
    if (method === 'GET' && caseFullMatch) {
      const caseId = caseFullMatch[1];
      const caseAggregate = await caseRepo.getCaseWithParties(caseId);

      if (!caseAggregate) {
        return jsonResponse(404, { error: `Case ${caseId} not found.` });
      }

      // Cedar Rule 1 & Rule 2 check
      const authz = await isAuthorized(
        principal,
        'ReadCase',
        {
          id: caseId,
          type: 'Case',
          parties: caseAggregate.parties.map((p) => p.phone),
          jurisdiction: caseAggregate.metadata.district,
        }
      );

      if (!authz.authorized) {
        return jsonResponse(403, { error: 'Forbidden', message: authz.reason }, principal);
      }

      return jsonResponse(200, {
        ...caseAggregate,
        parties: caseAggregate.parties.map(sanitizeParty),
      }, principal);
    }

    // -------------------------------------------------------------------------
    // 11. Generic Status Update: PATCH /cases/{id}/status
    // -------------------------------------------------------------------------
    const caseStatusMatch = path.match(/^\/cases\/([^/]+)\/status$/);
    if (method === 'PATCH' && caseStatusMatch) {
      const caseId = caseStatusMatch[1];
      const body = JSON.parse(event.body || '{}');

      if (!body.status) {
        return jsonResponse(400, { error: 'Field "status" is required in request body.' });
      }

      const existingCase = await caseRepo.getCaseById(caseId);
      if (!existingCase) {
        return jsonResponse(404, { error: `Case ${caseId} not found.` });
      }

      const parties = await partyRepo.getPartiesForCase(caseId);
      const authz = await isAuthorized(
        principal,
        'UpdateCase',
        {
          id: caseId,
          type: 'Case',
          parties: parties.map((p) => p.phone),
          jurisdiction: existingCase.district,
        }
      );

      if (!authz.authorized) {
        return jsonResponse(403, { error: 'Forbidden', message: authz.reason }, principal);
      }

      console.log(`[API Gateway Lambda] Updating status for case: ${caseId} to ${body.status}`);
      const updatedCase = await caseRepo.updateCaseStatus(caseId, body);

      return jsonResponse(200, {
        message: 'Case status updated successfully',
        case: updatedCase,
      }, principal);
    }

    // -------------------------------------------------------------------------
    // 12. List Parties: GET /cases/{id}/parties
    // -------------------------------------------------------------------------
    const casePartiesGetMatch = path.match(/^\/cases\/([^/]+)\/parties$/);
    if (method === 'GET' && casePartiesGetMatch) {
      const caseId = casePartiesGetMatch[1];
      const parties = await partyRepo.getPartiesForCase(caseId);
      return jsonResponse(200, { caseId, parties: parties.map(sanitizeParty) }, principal);
    }

    // -------------------------------------------------------------------------
    // 13. Case Metadata: GET /cases/{id} (Cedar Guarded)
    // -------------------------------------------------------------------------
    const singleCaseMatch = path.match(/^\/cases\/([^/]+)$/);
    if (method === 'GET' && singleCaseMatch) {
      const caseId = singleCaseMatch[1];
      const caseItem = await caseRepo.getCaseById(caseId);

      if (!caseItem) {
        return jsonResponse(404, { error: `Case ${caseId} not found.` });
      }

      const parties = await partyRepo.getPartiesForCase(caseId);

      const authz = await isAuthorized(
        principal,
        'ReadCase',
        {
          id: caseId,
          type: 'Case',
          parties: parties.map((p) => p.phone),
          jurisdiction: caseItem.district,
        }
      );

      if (!authz.authorized) {
        return jsonResponse(403, { error: 'Forbidden', message: authz.reason }, principal);
      }

      return jsonResponse(200, caseItem, principal);
    }

    // -------------------------------------------------------------------------
    // 404 Route Not Found
    // -------------------------------------------------------------------------
    console.warn(`[API Gateway Lambda] Route not found: ${method} ${path}`);
    return jsonResponse(404, {
      error: 'Not Found',
      path,
      method,
    });
  } catch (error: any) {
    console.error(`[API Gateway Lambda] Unhandled Error:`, error);
    return jsonResponse(500, {
      error: 'Internal Server Error',
      message: error.message || 'An unexpected error occurred',
    });
  }
};
