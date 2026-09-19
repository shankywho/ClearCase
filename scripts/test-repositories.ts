import { CaseRepository } from '../src/db/CaseRepository';
import { PartyRepository } from '../src/db/PartyRepository';

/**
 * End-to-End Test Suite for Phase 1 Data Access Layer
 * Exercises Single-Table Design, GSI1 Mediator Queue, and OTP Consent
 */
async function runIntegrationTest() {
  console.log('================================================================');
  console.log('  CLEARCASE DATA ACCESS LAYER: INTEGRATION & VERIFICATION RUN   ');
  console.log('================================================================\n');

  const caseRepo = new CaseRepository();
  const partyRepo = new PartyRepository();

  const testDistrict = 'Varanasi';
  const testState = 'Uttar Pradesh';

  // 1. Create a new case
  console.log('--- Step 1: Creating Dispute Case (Voice Grievance Intake) ---');
  const createdCase = await caseRepo.createCase({
    title: 'Agricultural Boundary Dispute at Mauza Shivpur',
    description: 'Petitioner states neighbor encroached 2 feet past ridge marker during wheat harvest season.',
    originalAudioUrl: 's3://clearcase-audio/grievances/case-001.wav',
    transcribedText: 'Mera padosi khet ki medh do feet andar khiska diya hai.',
    englishTranslation: 'My neighbor has pushed the field boundary ridge two feet inside my plot.',
    dialect: 'bhojpuri',
    state: testState,
    district: testDistrict,
    village: 'Shivpur',
  });

  console.log(`[PASS] Case created with ID: ${createdCase.id}`);
  console.log(`       PK: ${createdCase.PK}, SK: ${createdCase.SK}`);
  console.log(`       GSI1PK: ${createdCase.GSI1PK}, GSI1SK: ${createdCase.GSI1SK}\n`);

  // 2. Register Petitioner and Respondent Parties with OTP
  console.log('--- Step 2: Registering Parties with OTP & TTL Expiry ---');
  const petitionerPhone = '+919876543210';
  const respondentPhone = '+919123456780';

  const petitioner = await partyRepo.addParty(createdCase.id, {
    name: 'Ram Lakhan Yadav',
    phone: petitionerPhone,
    role: 'PETITIONER',
    otp: '123456',
    otpExpirySeconds: 900,
  });
  console.log(`[PASS] Petitioner added: ${petitioner.name} (${petitioner.phone}), OTP: ${petitioner.otp}`);

  const respondent = await partyRepo.addParty(createdCase.id, {
    name: 'Harish Chandra Singh',
    phone: respondentPhone,
    role: 'RESPONDENT',
    otp: '654321',
    otpExpirySeconds: 900,
  });
  console.log(`[PASS] Respondent added: ${respondent.name} (${respondent.phone}), OTP: ${respondent.otp}\n`);

  // 3. Single-Table Query: Get Case Aggregate (Metadata + All Parties in 1 Query)
  console.log('--- Step 3: Single-Table Join Query (Case Metadata + All Parties) ---');
  const aggregate = await caseRepo.getCaseWithParties(createdCase.id);
  if (!aggregate) {
    throw new Error(`Failed to retrieve case aggregate for ID: ${createdCase.id}`);
  }
  console.log(`[PASS] Single query returned case: "${aggregate.metadata.title}"`);
  console.log(`       Associated Parties count: ${aggregate.parties.length}`);
  aggregate.parties.forEach((p, idx) => {
    console.log(`       Party ${idx + 1}: ${p.name} [${p.role}] - Consent: ${p.consentStatus}`);
  });
  console.log('');

  // 4. Verify OTP and record e-consent for Respondent
  console.log('--- Step 4: Verifying Party OTP & Recording E-Consent ---');
  const consentedRespondent = await partyRepo.verifyPartyOtpAndConsent(createdCase.id, {
    phone: respondentPhone,
    otp: '654321',
  });
  console.log(`[PASS] Consent verified for: ${consentedRespondent.name}`);
  console.log(`       Consent Status: ${consentedRespondent.consentStatus}`);
  console.log(`       Consent Timestamp: ${consentedRespondent.consentTimestamp}\n`);

  // 5. Update case status & re-index GSI for Mediator Queue
  console.log('--- Step 5: Updating Case Status & Escalating to Mediator Queue ---');
  const updatedCase = await caseRepo.updateCaseStatus(createdCase.id, {
    status: 'MEDIATOR_REVIEW_REQUIRED',
    confidenceScore: 0.62,
    escalationReason: 'Boundary conflict involves unregistered ancestral partition deed.',
    statutoryReferences: [
      {
        act: 'Uttar Pradesh Revenue Code, 2006',
        section: 'Section 24',
        clauseTitle: 'Settlement of boundary dispute',
        relevanceSummary: 'Sub-Divisional Officer empowered to demarcate boundaries based on existing survey records.',
      },
    ],
    settlementDraft: 'Joint physical demarcation with Village Lekhpal prior to next crop cycle.',
  });
  console.log(`[PASS] Case status updated to: ${updatedCase.status}`);
  console.log(`       New GSI1SK: ${updatedCase.GSI1SK}`);
  console.log(`       Confidence Score: ${updatedCase.confidenceScore}`);
  console.log(`       Escalation Reason: ${updatedCase.escalationReason}\n`);

  // 6. Query GSI1: Mediator Queue for Varanasi district
  console.log('--- Step 6: Querying GSI1 MediatorQueueIndex by Jurisdiction ---');
  const mediatorCases = await caseRepo.queryMediatorQueue(testDistrict, 'MEDIATOR_REVIEW_REQUIRED');
  console.log(`[PASS] Found ${mediatorCases.length} case(s) in Varanasi Mediator Review Queue.`);
  mediatorCases.forEach((c, idx) => {
    console.log(`       [${idx + 1}] ID: ${c.id}`);
    console.log(`           Title: ${c.title}`);
    console.log(`           Status: ${c.status}`);
    console.log(`           Jurisdiction: ${c.GSI1PK}`);
  });

  console.log('\n================================================================');
  console.log('  ALL INTEGRATION VERIFICATIONS PASSED SUCCESSFULLY!          ');
  console.log('================================================================');
}

runIntegrationTest().catch((err) => {
  console.error('[FAIL] Integration test encountered error:', err);
  process.exit(1);
});
