import { mockClient } from 'aws-sdk-client-mock';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { CaseRepository } from '../src/db/CaseRepository';
import { PartyRepository } from '../src/db/PartyRepository';
import { docClient } from '../src/db/client';

const ddbMock = mockClient(docClient);

async function runUnitTests() {
  console.log('================================================================');
  console.log('       CLEARCASE REPOSITORY UNIT TEST (AWS SDK V3 MOCK)         ');
  console.log('================================================================\n');

  ddbMock.reset();

  const caseRepo = new CaseRepository('ClearCaseTable-test');
  const partyRepo = new PartyRepository('ClearCaseTable-test');

  // Test 1: CaseRepository.createCase
  console.log('[TEST 1] CaseRepository.createCase...');
  ddbMock.on(PutCommand).resolves({});

  const createdCase = await caseRepo.createCase({
    title: 'Boundary dispute at Mauza Shivpur',
    description: 'Encroachment along irrigation ridge.',
    dialect: 'bhojpuri',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    village: 'Shivpur',
  });

  if (
    createdCase.PK.startsWith('CASE#') &&
    createdCase.SK === 'METADATA' &&
    createdCase.GSI1PK === 'JURISDICTION#Varanasi' &&
    createdCase.GSI1SK === 'STATUS#INTAKE_PENDING'
  ) {
    console.log('  -> PASS: Case creation correctly formats PK, SK, GSI1PK, GSI1SK.');
  } else {
    throw new Error('TEST 1 FAILED: Invalid case key formatting.');
  }

  // Test 2: CaseRepository.getCaseById
  console.log('\n[TEST 2] CaseRepository.getCaseById...');
  ddbMock.on(GetCommand, {
    TableName: 'ClearCaseTable-test',
    Key: {
      PK: `CASE#${createdCase.id}`,
      SK: 'METADATA',
    },
  }).resolves({
    Item: createdCase,
  });

  const retrieved = await caseRepo.getCaseById(createdCase.id);
  if (retrieved && retrieved.id === createdCase.id) {
    console.log('  -> PASS: Retrieved case metadata matches.');
  } else {
    throw new Error('TEST 2 FAILED: Could not retrieve case metadata.');
  }

  // Test 3: PartyRepository.addParty
  console.log('\n[TEST 3] PartyRepository.addParty...');
  ddbMock.on(PutCommand).resolves({});

  const party = await partyRepo.addParty(createdCase.id, {
    name: 'Ram Lakhan',
    phone: '+919876543210',
    role: 'PETITIONER',
    otp: '123456',
    otpExpirySeconds: 900,
  });

  if (
    party.PK === `CASE#${createdCase.id}` &&
    party.SK === 'PARTY#+919876543210' &&
    party.otpExpiry &&
    party.otpExpiry > Math.floor(Date.now() / 1000)
  ) {
    console.log('  -> PASS: Party item created with PK, SK, and TTL otpExpiry.');
  } else {
    throw new Error('TEST 3 FAILED: Invalid party formatting.');
  }

  // Test 4: CaseRepository.getCaseWithParties (Single-Table Join)
  console.log('\n[TEST 4] CaseRepository.getCaseWithParties (Single Table Query)...');
  ddbMock.on(QueryCommand, {
    TableName: 'ClearCaseTable-test',
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: {
      ':pk': `CASE#${createdCase.id}`,
    },
  }).resolves({
    Items: [createdCase, party],
  });

  const aggregate = await caseRepo.getCaseWithParties(createdCase.id);
  if (aggregate && aggregate.metadata && aggregate.parties.length === 1) {
    console.log('  -> PASS: Case aggregate retrieved metadata + 1 party in single query.');
  } else {
    throw new Error('TEST 4 FAILED: Case aggregate failure.');
  }

  // Test 5: PartyRepository.verifyPartyOtpAndConsent
  console.log('\n[TEST 5] PartyRepository.verifyPartyOtpAndConsent...');
  ddbMock.on(UpdateCommand).resolves({
    Attributes: {
      ...party,
      consentStatus: 'ACCEPTED',
      consentTimestamp: new Date().toISOString(),
    },
  });

  const verified = await partyRepo.verifyPartyOtpAndConsent(createdCase.id, {
    phone: '+919876543210',
    otp: '123456',
  });

  if (verified.consentStatus === 'ACCEPTED' && verified.consentTimestamp) {
    console.log('  -> PASS: OTP consent verified and recorded.');
  } else {
    throw new Error('TEST 5 FAILED: OTP consent verification failed.');
  }

  // Test 6: CaseRepository.updateCaseStatus (Re-index GSI)
  console.log('\n[TEST 6] CaseRepository.updateCaseStatus...');
  ddbMock.on(UpdateCommand).resolves({
    Attributes: {
      ...createdCase,
      status: 'MEDIATOR_REVIEW_REQUIRED',
      GSI1SK: 'STATUS#MEDIATOR_REVIEW_REQUIRED',
      confidenceScore: 0.65,
      escalationReason: 'Boundary dispute needs physical demarcation',
    },
  });

  const updated = await caseRepo.updateCaseStatus(createdCase.id, {
    status: 'MEDIATOR_REVIEW_REQUIRED',
    confidenceScore: 0.65,
    escalationReason: 'Boundary dispute needs physical demarcation',
  });

  if (
    updated.status === 'MEDIATOR_REVIEW_REQUIRED' &&
    updated.GSI1SK === 'STATUS#MEDIATOR_REVIEW_REQUIRED'
  ) {
    console.log('  -> PASS: Case status updated and GSI1SK re-indexed.');
  } else {
    throw new Error('TEST 6 FAILED: Status update failed.');
  }

  // Test 7: CaseRepository.queryMediatorQueue (GSI Query)
  console.log('\n[TEST 7] CaseRepository.queryMediatorQueue...');
  ddbMock.on(QueryCommand, {
    TableName: 'ClearCaseTable-test',
    IndexName: 'MediatorQueueIndex',
  }).resolves({
    Items: [updated],
  });

  const queue = await caseRepo.queryMediatorQueue('Varanasi', 'MEDIATOR_REVIEW_REQUIRED');
  if (queue.length === 1 && queue[0].id === createdCase.id) {
    console.log('  -> PASS: Mediator queue GSI query returned pending cases for Varanasi.');
  } else {
    throw new Error('TEST 7 FAILED: Mediator queue query failed.');
  }

  console.log('\n================================================================');
  console.log('      ALL 7 UNIT & SDK BEHAVIOR TESTS PASSED CLEANLY!           ');
  console.log('================================================================\n');
}

runUnitTests().catch((err) => {
  console.error('[FAIL] Unit test failed:', err);
  process.exit(1);
});
