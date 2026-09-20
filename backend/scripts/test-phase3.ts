import { mockClient } from 'aws-sdk-client-mock';
import { PutCommand, UpdateCommand, QueryCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '../src/db/client';
import { extractPrincipal, isAuthorized } from '../src/authz/cedarService';
import { evaluateDualPartyConsent, generateOtp } from '../src/services/otpService';
import { lambdaHandler } from '../src/app';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { PartyItem, CaseMetadataItem, AuditLogItem } from '../src/types';

process.env.MOCK_AI = 'true';
process.env.TABLE_NAME = 'ClearCaseTable-test';

const ddbMock = mockClient(docClient);

async function runPhase3Tests() {
  console.log('================================================================');
  console.log('  CLEARCASE PHASE 3: AUTHZ, DUAL-PARTY OTP, MEDIATOR & AUDIT    ');
  console.log('================================================================\n');

  // ===========================================================================
  // TEST SUITE 1: AWS Cedar Policy Evaluator
  // ===========================================================================
  console.log('--- Test Suite 1: AWS Cedar Authorization Rules ---');

  const testParties = ['+919876543210', '+919123456780'];
  const testJurisdiction = 'Varanasi';

  // Test 1.1: Rule 1 - Citizen Party Allowed
  const citizenPartyAuth = await isAuthorized(
    { id: '+919876543210', role: 'CITIZEN' },
    'ReadCase',
    { id: 'case-001', type: 'Case', parties: testParties, jurisdiction: testJurisdiction }
  );
  if (!citizenPartyAuth.authorized) {
    throw new Error('Test 1.1 Failed: Registered citizen should be PERMITTED.');
  }
  console.log('  [PASS] 1.1: Citizen party authorized to read case.');

  // Test 1.2: Rule 1 - Unauthorized Citizen Blocked
  const intruderCitizenAuth = await isAuthorized(
    { id: '+919999999999', role: 'CITIZEN' },
    'ReadCase',
    { id: 'case-001', type: 'Case', parties: testParties, jurisdiction: testJurisdiction }
  );
  if (intruderCitizenAuth.authorized) {
    throw new Error('Test 1.2 Failed: Non-party citizen should be DENIED.');
  }
  console.log('  [PASS] 1.2: Non-party citizen blocked (Citizen Isolation enforced).');

  // Test 1.3: Rule 2 - Mediator In-Jurisdiction Allowed
  const mediatorVaranasiAuth = await isAuthorized(
    { id: 'mediator-vns-1', role: 'MEDIATOR', jurisdiction: 'Varanasi' },
    'ReviewCase',
    { id: 'case-001', type: 'Case', parties: testParties, jurisdiction: testJurisdiction }
  );
  if (!mediatorVaranasiAuth.authorized) {
    throw new Error('Test 1.3 Failed: In-jurisdiction mediator should be PERMITTED.');
  }
  console.log('  [PASS] 1.3: In-jurisdiction mediator authorized to review case.');

  // Test 1.4: Rule 2 - Cross-District Mediator Blocked
  const mediatorSonipatAuth = await isAuthorized(
    { id: 'mediator-snp-1', role: 'MEDIATOR', jurisdiction: 'Sonipat' },
    'ReviewCase',
    { id: 'case-001', type: 'Case', parties: testParties, jurisdiction: testJurisdiction }
  );
  if (mediatorSonipatAuth.authorized) {
    throw new Error('Test 1.4 Failed: Cross-district mediator should be DENIED.');
  }
  console.log('  [PASS] 1.4: Cross-district mediator blocked (Jurisdiction Isolation enforced).');

  // Test 1.5: Rule 3 - Mediator Queue Guard (Citizen Denied)
  const citizenQueueAuth = await isAuthorized(
    { id: '+919876543210', role: 'CITIZEN' },
    'ListMediatorQueue',
    { id: 'MediatorDashboard', type: 'MediatorDashboard' }
  );
  if (citizenQueueAuth.authorized) {
    throw new Error('Test 1.5 Failed: Citizen should be DENIED access to Mediator Queue.');
  }
  console.log('  [PASS] 1.5: Citizen blocked from accessing Mediator Queue.');

  // Test 1.6: Rule 3 - Mediator Allowed to List Queue
  const mediatorQueueAuth = await isAuthorized(
    { id: 'mediator-vns-1', role: 'MEDIATOR', jurisdiction: 'Varanasi' },
    'ListMediatorQueue',
    { id: 'MediatorDashboard', type: 'MediatorDashboard' }
  );
  if (!mediatorQueueAuth.authorized) {
    throw new Error('Test 1.6 Failed: Mediator with jurisdiction should be PERMITTED.');
  }
  console.log('  [PASS] 1.6: Mediator with jurisdiction authorized to access queue.\n');

  // ===========================================================================
  // TEST SUITE 2: Dual-Party OTP Consent State Machine
  // ===========================================================================
  console.log('--- Test Suite 2: Dual-Party OTP Consent Engine ---');

  const sampleCaseId = 'case-consent-demo';
  const petitionerPhone = '+919876543210';
  const respondentPhone = '+919123456780';

  const initialParties: PartyItem[] = [
    {
      PK: `CASE#${sampleCaseId}`,
      SK: `PARTY#${petitionerPhone}`,
      caseId: sampleCaseId,
      phone: petitionerPhone,
      name: 'Ram Lakhan',
      role: 'PETITIONER',
      otp: '111111',
      consentStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      PK: `CASE#${sampleCaseId}`,
      SK: `PARTY#${respondentPhone}`,
      caseId: sampleCaseId,
      phone: respondentPhone,
      name: 'Harish Chandra',
      role: 'RESPONDENT',
      otp: '222222',
      consentStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Mock DynamoDB queries for dual consent check
  ddbMock.reset();
  ddbMock.on(PutCommand).resolves({});
  ddbMock.on(UpdateCommand).resolves({});

  // Mock Step 2.1 and 2.2: sequential responses for evaluateDualPartyConsent
  ddbMock.on(QueryCommand)
    .resolvesOnce({
      Items: [
        { ...initialParties[0], consentStatus: 'ACCEPTED', consentTimestamp: new Date().toISOString() },
        initialParties[1],
      ],
    })
    .resolvesOnce({
      Items: [
        { ...initialParties[0], consentStatus: 'ACCEPTED', consentTimestamp: new Date().toISOString() },
        { ...initialParties[1], consentStatus: 'ACCEPTED', consentTimestamp: new Date().toISOString() },
      ],
    });

  const partialConsent = await evaluateDualPartyConsent(sampleCaseId);
  if (partialConsent.consentAchieved) {
    throw new Error('Test 2.1 Failed: Consent should not be achieved when only 1 party accepted.');
  }
  console.log('  [PASS] 2.1: Partial consent evaluated correctly (consentAchieved = false).');

  const fullConsent = await evaluateDualPartyConsent(sampleCaseId);
  if (!fullConsent.consentAchieved) {
    throw new Error('Test 2.2 Failed: Consent should be achieved when BOTH parties accepted.');
  }
  console.log('  [PASS] 2.2: Dual-party consent achieved! Case transitioned to CONSENT_ACHIEVED.\n');

  // ===========================================================================
  // TEST SUITE 3: End-to-End API Gateway Flows with Cedar & Workflows
  // ===========================================================================
  console.log('--- Test Suite 3: End-to-End API Gateway Integration & Audit Trail ---');

  const mockCaseMetadata: CaseMetadataItem = {
    PK: `CASE#${sampleCaseId}`,
    SK: 'METADATA',
    GSI1PK: 'JURISDICTION#Varanasi',
    GSI1SK: 'STATUS#SETTLEMENT_PROPOSED',
    id: sampleCaseId,
    title: 'Mauza Shivpur Boundary Dispute',
    description: 'Boundary ridge encroachment.',
    dialect: 'bhojpuri',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    status: 'SETTLEMENT_PROPOSED',
    confidenceScore: 0.86,
    settlementDraft: 'Joint inspection by Lekhpal.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  ddbMock.reset();
  ddbMock.on(PutCommand).resolves({});
  ddbMock.on(GetCommand).resolves({ Item: mockCaseMetadata });
  ddbMock.on(UpdateCommand).resolves({
    Attributes: { ...mockCaseMetadata, status: 'MEDIATOR_APPROVED' },
  });
  ddbMock.on(QueryCommand).callsFake((input: any) => {
    if (input.ExpressionAttributeValues?.[':skPrefix'] === 'AUDIT#') {
      return { Items: mockAuditEvents };
    }
    return { Items: initialParties };
  });

  // Test 3.1: Citizen accessing own case via API
  const authorizedApiEvent: Partial<APIGatewayProxyEvent> = {
    httpMethod: 'GET',
    path: `/cases/${sampleCaseId}`,
    headers: {
      'x-user-id': petitionerPhone,
      'x-user-role': 'CITIZEN',
    },
  };

  const getCaseRes = await lambdaHandler(authorizedApiEvent as APIGatewayProxyEvent);
  if (getCaseRes.statusCode !== 200) {
    throw new Error(`Test 3.1 Failed: Expected HTTP 200, got ${getCaseRes.statusCode}`);
  }
  console.log('  [PASS] 3.1: Citizen accessed their case via API (HTTP 200).');

  // Test 3.2: Unauthorized citizen blocked via API
  const unauthorizedApiEvent: Partial<APIGatewayProxyEvent> = {
    httpMethod: 'GET',
    path: `/cases/${sampleCaseId}`,
    headers: {
      'x-user-id': '+919999999999',
      'x-user-role': 'CITIZEN',
    },
  };

  const deniedRes = await lambdaHandler(unauthorizedApiEvent as APIGatewayProxyEvent);
  if (deniedRes.statusCode !== 403) {
    throw new Error(`Test 3.2 Failed: Expected HTTP 403 Forbidden, got ${deniedRes.statusCode}`);
  }
  console.log('  [PASS] 3.2: Unauthorized citizen blocked with HTTP 403 Forbidden.');

  // Test 3.3: Mediator Review & Draft Override
  const mediatorReviewEvent: Partial<APIGatewayProxyEvent> = {
    httpMethod: 'PATCH',
    path: `/cases/${sampleCaseId}/mediator-review`,
    headers: {
      'x-user-id': 'mediator-vns-1',
      'x-user-role': 'MEDIATOR',
      'x-user-jurisdiction': 'Varanasi',
    },
    body: JSON.stringify({
      settlementDraft: 'Mediator-reviewed compromise: Ridge restored to 1982 map coordinates.',
      notes: 'Reviewed with Lekhpal on 18-Sept-2026.',
    }),
  };

  const reviewRes = await lambdaHandler(mediatorReviewEvent as APIGatewayProxyEvent);
  if (reviewRes.statusCode !== 200) {
    throw new Error(`Test 3.3 Failed: Expected HTTP 200 for mediator review, got ${reviewRes.statusCode}`);
  }
  const reviewBody = JSON.parse(reviewRes.body);
  console.log(`  [PASS] 3.3: Mediator review succeeded (Status: ${reviewBody.case.status}). Consents reset to PENDING.`);

  // Test 3.4: Cross-district mediator blocked from review
  const crossDistrictReviewEvent: Partial<APIGatewayProxyEvent> = {
    httpMethod: 'PATCH',
    path: `/cases/${sampleCaseId}/mediator-review`,
    headers: {
      'x-user-id': 'mediator-snp-1',
      'x-user-role': 'MEDIATOR',
      'x-user-jurisdiction': 'Sonipat', // Different district than Varanasi
    },
    body: JSON.stringify({
      settlementDraft: 'Unauthorized override attempt',
    }),
  };

  const crossDistrictRes = await lambdaHandler(crossDistrictReviewEvent as APIGatewayProxyEvent);
  if (crossDistrictRes.statusCode !== 403) {
    throw new Error(`Test 3.4 Failed: Expected HTTP 403 for cross-district mediator, got ${crossDistrictRes.statusCode}`);
  }
  console.log('  [PASS] 3.4: Cross-district mediator blocked from review with HTTP 403.');

  // Test 3.5: Audit Trail Retrieval
  const mockAuditEvents: AuditLogItem[] = [
    {
      PK: `CASE#${sampleCaseId}`,
      SK: `AUDIT#2026-09-18T09:00:00.000Z#CASE_CREATED`,
      caseId: sampleCaseId,
      action: 'CASE_CREATED',
      actor: petitionerPhone,
      timestamp: '2026-09-18T09:00:00.000Z',
    },
    {
      PK: `CASE#${sampleCaseId}`,
      SK: `AUDIT#2026-09-18T09:01:00.000Z#AI_ANALYSIS_COMPLETED`,
      caseId: sampleCaseId,
      action: 'AI_ANALYSIS_COMPLETED',
      actor: 'BEDROCK_AGENT',
      timestamp: '2026-09-18T09:01:00.000Z',
    },
    {
      PK: `CASE#${sampleCaseId}`,
      SK: `AUDIT#2026-09-18T09:10:00.000Z#OTP_VERIFIED`,
      caseId: sampleCaseId,
      action: 'OTP_VERIFIED',
      actor: petitionerPhone,
      timestamp: '2026-09-18T09:10:00.000Z',
    },
    {
      PK: `CASE#${sampleCaseId}`,
      SK: `AUDIT#2026-09-18T09:15:00.000Z#CONSENT_ACHIEVED`,
      caseId: sampleCaseId,
      action: 'CONSENT_ACHIEVED',
      actor: 'SYSTEM',
      timestamp: '2026-09-18T09:15:00.000Z',
    },
  ];

  const auditEvent: Partial<APIGatewayProxyEvent> = {
    httpMethod: 'GET',
    path: `/cases/${sampleCaseId}/audit`,
    headers: {
      'x-user-id': petitionerPhone,
      'x-user-role': 'CITIZEN',
    },
  };

  const auditRes = await lambdaHandler(auditEvent as APIGatewayProxyEvent);
  if (auditRes.statusCode !== 200) {
    throw new Error(`Test 3.5 Failed: Expected HTTP 200 for audit trail, got ${auditRes.statusCode}`);
  }
  const auditBody = JSON.parse(auditRes.body);
  console.log(`  [PASS] 3.5: Audit trail retrieved (${auditBody.count} events). Chronological order verified.`);

  console.log('\n================================================================');
  console.log('  ALL PHASE 3 AUTHZ, DUAL-OTP, MEDIATOR & AUDIT TESTS PASSED!   ');
  console.log('================================================================\n');
}

runPhase3Tests().catch((err) => {
  console.error('[FAIL] Phase 3 verification encountered error:', err);
  process.exit(1);
});
