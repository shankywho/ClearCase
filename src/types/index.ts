/**
 * ClearCase Type Definitions
 * Single-Table Schema Entities for DynamoDB & Business Logic
 */

export type CaseStatus =
  | 'INTAKE_PENDING'
  | 'EVALUATION_IN_PROGRESS'
  | 'SETTLEMENT_PROPOSED'
  | 'MEDIATOR_REVIEW_REQUIRED'
  | 'ESCALATED'
  | 'CONSENT_PENDING'
  | 'CONSENT_ACHIEVED'
  | 'MEDIATOR_APPROVED'
  | 'ANCHORED'
  | 'RESOLVED'
  | 'REJECTED';

export type PartyRole = 'PETITIONER' | 'RESPONDENT' | 'MEDIATOR';

export type ConsentStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface StatutoryReference {
  act: string;
  section: string;
  clauseTitle: string;
  relevanceSummary: string;
}

/**
 * Case Metadata Item in DynamoDB
 * PK: CASE#<id>
 * SK: METADATA
 * GSI1PK: JURISDICTION#<district>
 * GSI1SK: STATUS#<status>
 */
export interface CaseMetadataItem {
  PK: `CASE#${string}`;
  SK: 'METADATA';
  GSI1PK: `JURISDICTION#${string}`;
  GSI1SK: `STATUS#${CaseStatus}`;
  id: string;
  title: string;
  description: string;
  originalAudioUrl?: string;
  transcribedText?: string;
  englishTranslation?: string;
  dialect: string;
  state: string;
  district: string;
  village?: string;
  status: CaseStatus;
  confidenceScore?: number;
  escalationReason?: string;
  statutoryReferences?: StatutoryReference[];
  settlementDraft?: string;
  settlementAudioUrl?: string;
  onChainTxHash?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Party Item in DynamoDB
 * PK: CASE#<id>
 * SK: PARTY#<phone>
 * GSI2PK: PHONE#<phone> (PartyPhoneIndex: "my cases" lookup)
 * TTL: otpExpiry (epoch in seconds)
 */
export interface PartyItem {
  PK: `CASE#${string}`;
  SK: `PARTY#${string}`;
  GSI2PK?: `PHONE#${string}`;
  caseId: string;
  phone: string;
  name: string;
  role: PartyRole;
  otp?: string;
  otpExpiry?: number; // Epoch timestamp in seconds for DynamoDB TTL
  consentStatus: ConsentStatus;
  consentTimestamp?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Audit Log Item in DynamoDB
 * PK: CASE#<id>
 * SK: AUDIT#<isoTimestamp>#<action>
 */
export interface AuditLogItem {
  PK: `CASE#${string}`;
  SK: `AUDIT#${string}#${string}`;
  caseId: string;
  action: string;
  actor: string;
  details?: Record<string, any>;
  timestamp: string;
}

/**
 * Combined Case Aggregate (Single Table Query Output)
 */
export interface CaseAggregate {
  metadata: CaseMetadataItem;
  parties: PartyItem[];
}

/**
 * Data Transfer Objects (DTOs)
 */
export interface CreateCaseDTO {
  id?: string;
  title: string;
  description: string;
  originalAudioUrl?: string;
  transcribedText?: string;
  englishTranslation?: string;
  dialect?: string;
  state: string;
  district: string;
  village?: string;
  petitioner?: {
    name: string;
    phone: string;
  };
}

export interface UpdateCaseStatusDTO {
  status: CaseStatus;
  confidenceScore?: number;
  escalationReason?: string;
  statutoryReferences?: StatutoryReference[];
  settlementDraft?: string;
  settlementAudioUrl?: string;
  onChainTxHash?: string;
  transcribedText?: string;
  englishTranslation?: string;
}

export interface AddPartyDTO {
  name: string;
  phone: string;
  role: PartyRole;
  otp?: string;
  otpExpirySeconds?: number; // Duration in seconds from now, defaults to 900 (15m)
}

export interface VerifyConsentDTO {
  phone: string;
  otp: string;
}

/**
 * AI Multi-Agent Pipeline Types
 */

export interface TranscriptionResult {
  originalText: string;
  englishText: string;
  detectedDialect: string;
  confidence: number;
}

export interface StatutoryMatchResult {
  act: string;
  section: string;
  clauseTitle: string;
  relevanceSummary: string;
  similarityScore: number;
}

export interface MediationDraftResult {
  grievanceSummary: string;
  applicableSection: string;
  confidenceScore: number; // 0.0 to 1.0
  suggestedDraft: string;
  escalationRecommended: boolean;
  escalationReason?: string;
}

export interface DisputeAnalysisResult {
  transcription: TranscriptionResult;
  statutes: StatutoryMatchResult[];
  draft: MediationDraftResult;
  suggestedStatus: CaseStatus;
}

/**
 * Phase 3: Cedar Authorization & Audit Types
 */

export interface CedarPrincipal {
  id: string; // e.g., phone "+919876543210" or "mediator-01"
  role: 'CITIZEN' | 'MEDIATOR';
  jurisdiction?: string; // e.g., "Varanasi"
}

export type CedarAction =
  | 'ReadCase'
  | 'UpdateCase'
  | 'ConfirmConsent'
  | 'ReviewCase'
  | 'EscalateCase'
  | 'ListMediatorQueue'
  | 'ReadAuditTrail';

export interface CedarResource {
  id: string;
  type: 'Case' | 'MediatorDashboard';
  parties?: string[]; // Phone numbers of parties in the case
  jurisdiction?: string; // District jurisdiction of the case
}

export type AuditEventType =
  | 'CASE_CREATED'
  | 'AI_ANALYSIS_COMPLETED'
  | 'ESCALATED_TO_MEDIATOR'
  | 'PARTY_JOINED'
  | 'OTP_SENT'
  | 'OTP_VERIFIED'
  | 'CONSENT_ACHIEVED'
  | 'MEDIATOR_OVERRIDE'
  | 'ANCHORED_ON_CHAIN'
  | 'SETTLEMENT_AUDIO_GENERATED';

export interface PresignedUploadUrlResult {
  uploadUrl: string;
  objectKey: string;
  s3Uri: string;
  expiresIn: number;
}

export interface MediatorReviewDTO {
  settlementDraft: string;
  statutoryReferences?: StatutoryReference[];
  notes?: string;
}

export interface BlockchainAnchorReceipt {
  txHash: string;
  blockNumber: number;
  settlementHash: string;
  timestamp: string;
  explorerUrl: string;
  network: string;
  contractAddress: string;
}

