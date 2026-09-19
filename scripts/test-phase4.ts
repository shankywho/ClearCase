import { mockClient } from 'aws-sdk-client-mock';
import { PutCommand, UpdateCommand, QueryCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '../src/db/client';
import { generateSettlementHash, anchorSettlement } from '../src/services/blockchainService';
import { lambdaHandler } from '../src/app';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { CaseMetadataItem, PartyItem } from '../src/types';

process.env.MOCK_AI = 'true';
process.env.MOCK_BLOCKCHAIN = 'true';
process.env.TABLE_NAME = 'ClearCaseTable-test';

const ddbMock = mockClient(docClient);

async function runPhase4Tests() {
  console.log('================================================================');
  console.log('  CLEARCASE PHASE 4: BLOCKCHAIN ANCHORING & IMMUTABILITY TESTS  ');
  console.log('================================================================\n');

  const testCaseId = 'case-anchor-777';
  const petitionerPhone = '+919876543210';
  const respondentPhone = '+919123456780';
  const settlementText =
    '1. Boundary ridge restored along 1982 cadastre coordinates.\n2. Both landholders maintain joint demarcation.';

  // ---------------------------------------------------------------------------
  // Test 1: Deterministic Canonical Hashing
  // ---------------------------------------------------------------------------
  console.log('--- Test 1: Canonical SHA-256 Settlement Hashing ---');
  const hash1 = generateSettlementHash(testCaseId, settlementText, [petitionerPhone, respondentPhone]);
  const hash2 = generateSettlementHash(testCaseId, settlementText, [respondentPhone, petitionerPhone]); // Reversed order

  console.log(`[PASS] Hash 1: ${hash1}`);
  console.log(`[PASS] Hash 2: ${hash2} (Order invariant)`);

  if (hash1 !== hash2) {
    throw new Error('Test 1 Failed: Hashes must match regardless of party input order.');
  }
  if (!hash1.startsWith('0x') || hash1.length !== 66) {
    throw new Error(`Test 1 Failed: Expected 66-character 0x-prefixed hex string, got ${hash1.length}`);
  }
  console.log('  -> PASS: SHA-256 canonical hashing is deterministic and party-order invariant.\n');

  // ---------------------------------------------------------------------------
  // Test 2: Resilient Mock Blockchain Anchoring (Polygon Amoy Testnet)
  // ---------------------------------------------------------------------------
  console.log('--- Test 2: Resilient Mock Blockchain Anchoring (Polygon Amoy) ---');
  const startTime = Date.now();
  const receipt = await anchorSettlement(hash1, testCaseId);
  const elapsedMs = Date.now() - startTime;

  console.log(`[PASS] Anchored TxHash: ${receipt.txHash}`);
  console.log(`[PASS] Block Number: #${receipt.blockNumber}`);
  console.log(`[PASS] Network: ${receipt.network}`);
  console.log(`[PASS] Explorer URL: ${receipt.explorerUrl}`);
  console.log(`[PASS] Simulated Confirmation Latency: ${elapsedMs}ms (Expected ~2500ms)`);

  if (!receipt.txHash.startsWith('0x')) {
    throw new Error('Test 2 Failed: Expected 0x-prefixed txHash.');
  }
  if (!receipt.explorerUrl.includes('amoy.polygonscan.com')) {
    throw new Error('Test 2 Failed: Explorer URL must point to Polygon Amoy Polygonscan.');
  }
  if (elapsedMs < 2000) {
    throw new Error('Test 2 Failed: Simulated block confirmation delay did not execute.');
  }
  console.log('  -> PASS: Resilient mock anchoring successfully generated valid Amoy receipt.\n');

  // ---------------------------------------------------------------------------
  // Test 3: API Precondition Guard (Rejection if status !== CONSENT_ACHIEVED)
  // ---------------------------------------------------------------------------
  console.log('--- Test 3: API Anchoring Guard (Rejection on Un-Consented Dispute) ---');
  const unconsentedCase: CaseMetadataItem = {
    PK: `CASE#${testCaseId}`,
    SK: 'METADATA',
    GSI1PK: 'JURISDICTION#Varanasi',
    GSI1SK: 'STATUS#SETTLEMENT_PROPOSED',
    id: testCaseId,
    title: 'Unconsented Boundary Dispute',
    description: 'Parties have not yet submitted dual OTPs.',
    dialect: 'bhojpuri',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    status: 'SETTLEMENT_PROPOSED', // NOT CONSENT_ACHIEVED
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const sampleParties: PartyItem[] = [
    {
      PK: `CASE#${testCaseId}`,
      SK: `PARTY#${petitionerPhone}`,
      caseId: testCaseId,
      phone: petitionerPhone,
      name: 'Ram Lakhan',
      role: 'PETITIONER',
      consentStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      PK: `CASE#${testCaseId}`,
      SK: `PARTY#${respondentPhone}`,
      caseId: testCaseId,
      phone: respondentPhone,
      name: 'Harish Chandra',
      role: 'RESPONDENT',
      consentStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  ddbMock.reset();
  ddbMock.on(GetCommand).resolves({ Item: unconsentedCase });
  ddbMock.on(QueryCommand).resolves({ Items: sampleParties });

  const rejectedAnchorEvent: Partial<APIGatewayProxyEvent> = {
    httpMethod: 'POST',
    path: `/cases/${testCaseId}/anchor`,
    headers: {
      'x-user-id': petitionerPhone,
      'x-user-role': 'CITIZEN',
    },
  };

  const rejectRes = await lambdaHandler(rejectedAnchorEvent as APIGatewayProxyEvent);
  const rejectBody = JSON.parse(rejectRes.body);

  console.log(`[PASS] HTTP Status: ${rejectRes.statusCode} (Expected 400)`);
  console.log(`[PASS] Error Reason: ${rejectBody.message}`);

  if (rejectRes.statusCode !== 400) {
    throw new Error(`Test 3 Failed: Expected HTTP 400, got ${rejectRes.statusCode}`);
  }
  if (rejectBody.error !== 'PRECONDITION_FAILED') {
    throw new Error('Test 3 Failed: Expected PRECONDITION_FAILED error code.');
  }
  console.log('  -> PASS: Precondition guard correctly prevented anchoring un-consented dispute.\n');

  // ---------------------------------------------------------------------------
  // Test 4: Successful On-Chain Anchoring & Immutability Transition
  // ---------------------------------------------------------------------------
  console.log('--- Test 4: Successful On-Chain Anchoring for Consented Case ---');
  const consentedCase: CaseMetadataItem = {
    ...unconsentedCase,
    status: 'CONSENT_ACHIEVED',
    settlementDraft: settlementText,
  };

  ddbMock.reset();
  ddbMock.on(GetCommand).resolves({ Item: consentedCase });
  ddbMock.on(QueryCommand).resolves({ Items: sampleParties });
  ddbMock.on(PutCommand).resolves({}); // For Audit Log
  ddbMock.on(UpdateCommand).resolves({
    Attributes: {
      ...consentedCase,
      status: 'ANCHORED',
      onChainTxHash: receipt.txHash,
    },
  });

  const anchorEvent: Partial<APIGatewayProxyEvent> = {
    httpMethod: 'POST',
    path: `/cases/${testCaseId}/anchor`,
    headers: {
      'x-user-id': petitionerPhone,
      'x-user-role': 'CITIZEN',
    },
  };

  const anchorRes = await lambdaHandler(anchorEvent as APIGatewayProxyEvent);
  const anchorBody = JSON.parse(anchorRes.body);

  console.log(`[PASS] HTTP Status: ${anchorRes.statusCode} (Expected 200)`);
  console.log(`[PASS] Message: ${anchorBody.message}`);
  console.log(`[PASS] Case Status: ${anchorBody.case.status}`);
  console.log(`[PASS] Anchored TxHash: ${anchorBody.case.onChainTxHash}`);
  console.log(`[PASS] Block Number: #${anchorBody.receipt.blockNumber}`);
  console.log(`[PASS] Explorer Link: ${anchorBody.receipt.explorerUrl}`);

  if (anchorRes.statusCode !== 200) {
    throw new Error(`Test 4 Failed: Expected HTTP 200, got ${anchorRes.statusCode}`);
  }
  if (anchorBody.case.status !== 'ANCHORED') {
    throw new Error('Test 4 Failed: Expected case status to be ANCHORED.');
  }
  if (!anchorBody.case.onChainTxHash?.startsWith('0x')) {
    throw new Error('Test 4 Failed: Missing or invalid onChainTxHash in response.');
  }
  console.log('  -> PASS: Case transitioned to ANCHORED with immutable Polygon Amoy proof.\n');

  console.log('================================================================');
  console.log('  ALL PHASE 4 BLOCKCHAIN ANCHORING TESTS PASSED CLEANLY!        ');
  console.log('================================================================\n');
}

runPhase4Tests().catch((err) => {
  console.error('[FAIL] Phase 4 test failed:', err);
  process.exit(1);
});
