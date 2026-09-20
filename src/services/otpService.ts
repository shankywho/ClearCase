import crypto from 'crypto';
import { CaseRepository } from '../db/CaseRepository';
import { PartyRepository } from '../db/PartyRepository';
import { AuditRepository } from '../db/AuditRepository';
import { PartyItem } from '../types';

const caseRepo = new CaseRepository();
const partyRepo = new PartyRepository();
const auditRepo = new AuditRepository();

export interface OtpGenerationResult {
  otp: string;
  expiryEpoch: number;
}

/**
 * Dual-Party OTP Consent Engine
 * Manages OTP dispatch simulation (Twilio/Exotel IVR/SMS) and atomic dual-consent state transitions.
 */

/**
 * Generate a secure 6-digit OTP and compute epoch TTL expiry.
 * Dispatches simulated SMS/IVR alert to terminal.
 */
export function generateOtp(phone: string, durationSeconds: number = 900): OtpGenerationResult {
  const otp = crypto.randomInt(100000, 1000000).toString();
  const expiryEpoch = Math.floor(Date.now() / 1000) + durationSeconds;

  console.log('----------------------------------------------------------------');
  console.log(`[SMS/IVR Stub: Twilio/Exotel] Outbound SMS Dispatch -> Destination: ${phone}`);
  console.log(`[SMS/IVR Stub: Twilio/Exotel] Simulated Payload: "ClearCase e-Consent OTP: ${otp}. Valid for 15 mins."`);
  console.log(`[SMS/IVR Stub: Twilio/Exotel] Vernacular IVR Voice-Note: "Aapka samjhauta sweekriti code ${otp.split('').join(' ')} hai."`);
  console.log('----------------------------------------------------------------');

  return { otp, expiryEpoch };
}

/**
 * Dispatches an SMS confirmation notice when a settlement proposal is formulated or updated.
 */
export function sendSettlementNotificationSms(
  phone: string,
  caseId: string,
  title: string
): void {
  console.log(
    `[SMS/IVR Stub: Twilio/Exotel] SMS to ${phone}: "ClearCase: Naya samjhauta prastaav taiyaar hai case #${caseId.slice(0, 8)} ('${title}') ke liye. Review karne aur sweekriti dene ke liye app kholein."`
  );
}

/**
 * Atomically evaluates whether all disputing parties (Petitioner and Respondent)
 * have granted consent. If all parties accepted, transitions the case to `CONSENT_ACHIEVED`.
 */
export async function evaluateDualPartyConsent(caseId: string): Promise<{
  consentAchieved: boolean;
  petitionerAccepted: boolean;
  respondentAccepted: boolean;
  parties: PartyItem[];
}> {
  const cleanCaseId = caseId.replace(/^CASE#/, '');
  console.log(`[OTP Service] Checking dual-party consent threshold for Case: ${cleanCaseId}...`);

  const parties = await partyRepo.getPartiesForCase(cleanCaseId);

  const petitioner = parties.find((p) => p.role === 'PETITIONER');
  const respondent = parties.find((p) => p.role === 'RESPONDENT');

  const petitionerAccepted = petitioner?.consentStatus === 'ACCEPTED';
  const respondentAccepted = respondent?.consentStatus === 'ACCEPTED';

  console.log(
    `[OTP Service] Consent Status -> Petitioner (${petitioner?.phone || 'N/A'}): ${petitioner?.consentStatus || 'NONE'} | Respondent (${respondent?.phone || 'N/A'}): ${respondent?.consentStatus || 'NONE'}`
  );

  const consentAchieved = Boolean(petitioner && respondent && petitionerAccepted && respondentAccepted);

  if (consentAchieved) {
    console.log('================================================================');
    console.log(`[OTP Service] DUAL-PARTY CONSENT ACHIEVED for Case: ${cleanCaseId}!`);
    console.log(`[OTP Service] Both parties have verified OTPs and granted digital e-consent.`);
    console.log(`[OTP Service] Transitioning case status to: CONSENT_ACHIEVED.`);
    console.log('================================================================');

    await caseRepo.updateCaseStatus(cleanCaseId, {
      status: 'CONSENT_ACHIEVED',
    });

    await auditRepo.recordEvent(cleanCaseId, 'CONSENT_ACHIEVED', 'SYSTEM', {
      petitionerPhone: petitioner?.phone,
      respondentPhone: respondent?.phone,
      petitionerConsentTimestamp: petitioner?.consentTimestamp,
      respondentConsentTimestamp: respondent?.consentTimestamp,
    });
  }

  return {
    consentAchieved,
    petitionerAccepted,
    respondentAccepted,
    parties,
  };
}
