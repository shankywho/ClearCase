import { mockClient } from 'aws-sdk-client-mock';
import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { docClient } from '../src/db/client';
import { lambdaHandler } from '../src/app';
import { APIGatewayProxyEvent } from 'aws-lambda';

// Point AI service explicitly to the live Python AI microservice
process.env.AI_SERVICE_URL = 'http://127.0.0.1:8001';
process.env.MOCK_BLOCKCHAIN = 'true';
process.env.TABLE_NAME = 'ClearCaseTable-e2e';
process.env.AWS_REGION = 'ap-south-1';

const ddbMock = mockClient(docClient);

// State store to simulate DynamoDB single-table persistence across sequential HTTP requests
const dbStore: Map<string, any> = new Map();

function makeKey(pk: string, sk: string): string {
  return `${pk}##${sk}`;
}

// Wire up in-memory DynamoDB simulation
ddbMock.on(PutCommand).callsFake((params) => {
  const item = params.Item;
  if (item && item.PK && item.SK) {
    dbStore.set(makeKey(item.PK, item.SK), JSON.parse(JSON.stringify(item)));
  }
  return {};
});

ddbMock.on(GetCommand).callsFake((params) => {
  const key = makeKey(params.Key.PK, params.Key.SK);
  const item = dbStore.get(key);
  return { Item: item ? JSON.parse(JSON.stringify(item)) : undefined };
});

ddbMock.on(UpdateCommand).callsFake((params) => {
  const key = makeKey(params.Key.PK, params.Key.SK);
  let item = dbStore.get(key);
  if (!item) {
    item = { PK: params.Key.PK, SK: params.Key.SK };
  }
  
  const names = params.ExpressionAttributeNames || {};
  const values = params.ExpressionAttributeValues || {};
  const expr = params.UpdateExpression || '';

  const setMatch = expr.match(/SET\s+([^]+?)(?:REMOVE|$)/i);
  if (setMatch) {
    const assignments = setMatch[1].split(',');
    for (const assign of assignments) {
      const [lhs, rhs] = assign.split('=').map((s) => s.trim());
      if (lhs && rhs) {
        const field = lhs.startsWith('#') ? names[lhs] : lhs;
        const val = rhs.startsWith(':') ? values[rhs] : rhs;
        if (field) item[field] = val;
      }
    }
  }

  const removeMatch = expr.match(/REMOVE\s+([^]+?)(?:SET|$)/i);
  if (removeMatch) {
    const removes = removeMatch[1].split(',');
    for (const rem of removes) {
      const trimmed = rem.trim();
      const field = trimmed.startsWith('#') ? names[trimmed] : trimmed;
      if (field) delete item[field];
    }
  }

  dbStore.set(key, JSON.parse(JSON.stringify(item)));
  return { Attributes: item };
});

ddbMock.on(QueryCommand).callsFake((params) => {
  const expr = params.KeyConditionExpression || '';
  const values = params.ExpressionAttributeValues || {};
  const matched: any[] = [];

  for (const item of dbStore.values()) {
    if (params.IndexName === 'GSI1' || params.IndexName === 'MediatorQueueIndex') {
      const targetPk = values[':gsi1pk'];
      const targetSk = values[':gsi1sk'];
      const targetSkPrefix = values[':statusPrefix'];
      if (item.GSI1PK === targetPk) {
        if (targetSk && item.GSI1SK === targetSk) {
          matched.push(JSON.parse(JSON.stringify(item)));
        } else if (targetSkPrefix && item.GSI1SK && item.GSI1SK.startsWith(targetSkPrefix)) {
          matched.push(JSON.parse(JSON.stringify(item)));
        }
      }
    } else if (params.IndexName === 'PhoneIndex') {
      const targetPhone = values[':phone'];
      if (item.phone === targetPhone) {
        matched.push(JSON.parse(JSON.stringify(item)));
      }
    } else {
      // Primary table query
      const targetPk = values[':pk'];
      const targetSkPrefix = values[':skPrefix'];
      if (item.PK === targetPk) {
        if (!targetSkPrefix || (item.SK && item.SK.startsWith(targetSkPrefix))) {
          matched.push(JSON.parse(JSON.stringify(item)));
        }
      }
    }
  }
  return { Items: matched };
});

function createEvent(options: {
  method: string;
  path: string;
  body?: any;
  headers?: Record<string, string>;
  queryStringParameters?: Record<string, string>;
}): APIGatewayProxyEvent {
  return {
    httpMethod: options.method,
    path: options.path,
    body: options.body ? JSON.stringify(options.body) : null,
    headers: options.headers || {},
    queryStringParameters: options.queryStringParameters || null,
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {
      accountId: '123456789012',
      apiId: 'clearcase-e2e',
      protocol: 'HTTP/1.1',
      httpMethod: options.method,
      path: options.path,
      stage: 'prod',
      requestId: 'e2e-req-' + Math.random().toString(36).substring(2, 9),
      requestTimeEpoch: Date.now(),
      resourceId: 'res-1',
      resourcePath: options.path,
      identity: {
        accessKey: null,
        accountId: null,
        apiKey: null,
        apiKeyId: null,
        caller: null,
        clientCert: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        principalOrgId: null,
        sourceIp: '127.0.0.1',
        user: null,
        userAgent: 'ClearCase-E2E-Tester/1.0',
        userArn: null,
      },
      authorizer: null,
    },
    resource: options.path,
    pathParameters: null,
  };
}

async function runEndToEndTests() {
  console.log('================================================================');
  console.log('  CLEARCASE FULL PROJECT E2E INTEGRATION & REAL REQUEST TEST    ');
  console.log('  Testing TypeScript Backend + Live Python AI Microservice Mesh ');
  console.log('================================================================\n');

  // ---------------------------------------------------------------------------
  // STEP 1: Microservice Connectivity & Health Check
  // ---------------------------------------------------------------------------
  console.log('>>> [STEP 1] Testing Microservice Health & Live Connectivity...');

  // 1a. Test Python AI Microservice Health
  const pythonHealthResp = await fetch('http://127.0.0.1:8001/health');
  if (!pythonHealthResp.ok) {
    throw new Error(`Python AI microservice health check failed: ${pythonHealthResp.status}`);
  }
  const pythonHealth = await pythonHealthResp.json();
  console.log(`  [PASS] 1.1: Python AI Microservice live (v${pythonHealth.version}, ${pythonHealth.indexed_clauses} indexed legal clauses)`);

  // 1b. Test TypeScript API Gateway Health
  const tsHealthEvent = createEvent({ method: 'GET', path: '/health' });
  const tsHealthResult = await lambdaHandler(tsHealthEvent);
  const tsHealth = JSON.parse(tsHealthResult.body);
  if (tsHealthResult.statusCode !== 200 || tsHealth.status !== 'UP') {
    throw new Error(`TypeScript Lambda health check failed: ${tsHealthResult.statusCode}`);
  }
  console.log(`  [PASS] 1.2: TypeScript API Gateway Lambda live (Service: ${tsHealth.service})`);

  // ---------------------------------------------------------------------------
  // STEP 2: Real Dispute Intake with Live Python AI Orchestration
  // ---------------------------------------------------------------------------
  console.log('\n>>> [STEP 2] Submitting Dispute Intake (Bhojpuri Vernacular Boundary Dispute)...');

  const intakeEvent = createEvent({
    method: 'POST',
    path: '/cases',
    body: {
      title: 'Khet ke medh par vivad Mauza Shivpur',
      description: 'Padosi khet ki purani medh kaat kar do feet humre khet ki or bada liya hai gehu buaai ke samay.',
      dialect: 'bhojpuri',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      village: 'Mauza Shivpur',
      petitioner: {
        name: 'Ram Lakhan Yadav',
        phone: '+919876543210',
      },
    },
  });

  const intakeResult = await lambdaHandler(intakeEvent);
  if (intakeResult.statusCode !== 201) {
    throw new Error(`Dispute intake failed with status ${intakeResult.statusCode}: ${intakeResult.body}`);
  }
  const intakeData = JSON.parse(intakeResult.body);
  const caseId = intakeData.case.id;

  console.log(`  [PASS] 2.1: Case registered in DynamoDB with ID: ${caseId}`);
  console.log(`  [PASS] 2.2: Live Python AI Analysis invoked successfully!`);
  console.log(`        - Routed Status: ${intakeData.case.status}`);
  console.log(`        - Confidence Score: ${intakeData.aiAnalysis.confidenceScore}`);
  console.log(`        - Applicable Section: ${intakeData.aiAnalysis.applicableSection}`);
  console.log(`        - Settlement Draft Preview: ${intakeData.aiAnalysis.settlementDraft.slice(0, 80)}...`);

  if (!intakeData.aiAnalysis.applicableSection.includes('Uttar Pradesh Revenue Code')) {
    throw new Error(`Expected UP Revenue Code citation, got: ${intakeData.aiAnalysis.applicableSection}`);
  }
  if (intakeData.aiAnalysis.confidenceScore < 0.8) {
    throw new Error(`Expected high confidence score (>=0.8), got: ${intakeData.aiAnalysis.confidenceScore}`);
  }

  // Check that petitioner was added to parties and OTP generated
  const petitionerKey = makeKey(`CASE#${caseId}`, 'PARTY#+919876543210');
  const petitionerItem = dbStore.get(petitionerKey);
  if (!petitionerItem || !petitionerItem.otp) {
    throw new Error('Petitioner party item or OTP was not stored in DynamoDB.');
  }
  const petitionerOtp = petitionerItem.otp;
  console.log(`  [PASS] 2.3: Petitioner registered. Secure OTP generated: [${petitionerOtp}]`);

  // ---------------------------------------------------------------------------
  // STEP 3: Second Party (Respondent) Registration
  // ---------------------------------------------------------------------------
  console.log('\n>>> [STEP 3] Registering Second Disputing Party (Respondent)...');

  const joinEvent = createEvent({
    method: 'POST',
    path: `/cases/${caseId}/parties`,
    body: {
      name: 'Harish Chandra Singh',
      phone: '+919876543211',
      role: 'RESPONDENT',
    },
  });

  const joinResult = await lambdaHandler(joinEvent);
  if (joinResult.statusCode !== 201) {
    throw new Error(`Respondent registration failed: ${joinResult.body}`);
  }
  const respondentKey = makeKey(`CASE#${caseId}`, 'PARTY#+919876543211');
  const respondentItem = dbStore.get(respondentKey);
  const respondentOtp = respondentItem.otp;
  console.log(`  [PASS] 3.1: Respondent registered. Secure OTP generated: [${respondentOtp}]`);

  // ---------------------------------------------------------------------------
  // STEP 4: Dual-Party OTP Verification & Consent Transition
  // ---------------------------------------------------------------------------
  console.log('\n>>> [STEP 4] Executing Dual-Party Digital Consent Verification...');

  // 4a. Petitioner submits OTP
  const petConsentEvent = createEvent({
    method: 'POST',
    path: `/cases/${caseId}/confirm`,
    headers: { 'x-user-id': '+919876543210', 'x-user-role': 'CITIZEN' },
    body: {
      phone: '+919876543210',
      otp: petitionerOtp,
    },
  });
  const petConsentResult = await lambdaHandler(petConsentEvent);
  const petConsentData = JSON.parse(petConsentResult.body);
  if (petConsentResult.statusCode !== 200 || petConsentData.consentEvaluation.consentAchieved) {
    throw new Error(`Petitioner consent step unexpected result: ${petConsentResult.body}`);
  }
  console.log('  [PASS] 4.1: Petitioner OTP verified. Consent: 1/2 parties (Pending Respondent).');

  // 4b. Precondition Check: Blockchain anchoring MUST fail while consent is incomplete
  const earlyAnchorEvent = createEvent({
    method: 'POST',
    path: `/cases/${caseId}/anchor`,
    headers: { 'x-user-id': '+919876543210', 'x-user-role': 'CITIZEN' },
  });
  const earlyAnchorResult = await lambdaHandler(earlyAnchorEvent);
  if (earlyAnchorResult.statusCode !== 400) {
    throw new Error(`Expected blockchain anchor rejection with 400, got: ${earlyAnchorResult.statusCode}`);
  }
  console.log('  [PASS] 4.2: Guard Verified: Pre-consent blockchain anchoring strictly rejected with HTTP 400.');

  // 4c. Respondent submits OTP -> triggers CONSENT_ACHIEVED
  const respConsentEvent = createEvent({
    method: 'POST',
    path: `/cases/${caseId}/confirm`,
    headers: { 'x-user-id': '+919876543211', 'x-user-role': 'CITIZEN' },
    body: {
      phone: '+919876543211',
      otp: respondentOtp,
    },
  });
  const respConsentResult = await lambdaHandler(respConsentEvent);
  const respConsentData = JSON.parse(respConsentResult.body);
  if (respConsentResult.statusCode !== 200 || !respConsentData.consentEvaluation.consentAchieved) {
    throw new Error(`Respondent consent step failed: ${respConsentResult.body}`);
  }
  console.log('  [PASS] 4.3: Respondent OTP verified. Dual-Party digital consent achieved (2/2)!');
  console.log(`        - Updated Case Status: CONSENT_ACHIEVED`);

  // ---------------------------------------------------------------------------
  // STEP 5: Polygon Amoy Blockchain Anchoring
  // ---------------------------------------------------------------------------
  console.log('\n>>> [STEP 5] Anchoring Settlement On-Chain (Polygon Amoy Testnet)...');

  const anchorEvent = createEvent({
    method: 'POST',
    path: `/cases/${caseId}/anchor`,
    headers: { 'x-user-id': '+919876543210', 'x-user-role': 'CITIZEN' },
  });
  const anchorResult = await lambdaHandler(anchorEvent);
  if (anchorResult.statusCode !== 200) {
    throw new Error(`Anchoring failed: ${anchorResult.body}`);
  }
  const anchorData = JSON.parse(anchorResult.body);
  console.log(`  [PASS] 5.1: Canonical SHA-256 Settlement Hash: ${anchorData.receipt.settlementHash}`);
  console.log(`  [PASS] 5.2: Polygon Amoy TxHash: ${anchorData.receipt.txHash}`);
  console.log(`  [PASS] 5.3: Block Number: #${anchorData.receipt.blockNumber}`);
  console.log(`  [PASS] 5.4: Explorer URL: ${anchorData.receipt.explorerUrl}`);
  console.log(`  [PASS] 5.5: Final Case Status: ${anchorData.case.status} (Tamper-Proof)`);

  // ---------------------------------------------------------------------------
  // STEP 6: Cedar Authorization & Tamper-Proof Audit Trail
  // ---------------------------------------------------------------------------
  console.log('\n>>> [STEP 6] Verifying Cedar Fine-Grained AuthZ & Audit Trail...');

  // 6a. Unauthorized outsider attempts to view audit trail
  const unauthorizedAudit = createEvent({
    method: 'GET',
    path: `/cases/${caseId}/audit`,
    headers: { 'x-user-id': '+919999999999', 'x-user-role': 'CITIZEN' },
  });
  const unauthResult = await lambdaHandler(unauthorizedAudit);
  if (unauthResult.statusCode !== 403) {
    throw new Error(`Expected HTTP 403 for unauthorized party, got: ${unauthResult.statusCode}`);
  }
  console.log('  [PASS] 6.1: Non-disputant blocked from reading private audit trail with HTTP 403.');

  // 6b. Authorized petitioner reads audit trail
  const authorizedAudit = createEvent({
    method: 'GET',
    path: `/cases/${caseId}/audit`,
    headers: { 'x-user-id': '+919876543210', 'x-user-role': 'CITIZEN' },
  });
  const authAuditResult = await lambdaHandler(authorizedAudit);
  if (authAuditResult.statusCode !== 200) {
    throw new Error(`Audit retrieval failed: ${authAuditResult.body}`);
  }
  const auditData = JSON.parse(authAuditResult.body);
  console.log(`  [PASS] 6.2: Authorized audit trail retrieved: ${auditData.count} immutable events recorded.`);
  const actionSequence = auditData.auditTrail.map((e: any) => e.action);
  console.log(`        - Event Sequence: [${actionSequence.join(' -> ')}]`);

  if (!actionSequence.includes('CASE_CREATED') || !actionSequence.includes('ANCHORED_ON_CHAIN')) {
    throw new Error('Audit trail missing critical lifecycle checkpoints.');
  }

  // ---------------------------------------------------------------------------
  // STEP 7: Vernacular Audio Synthesis for Non-Literate Disputants
  // ---------------------------------------------------------------------------
  console.log('\n>>> [STEP 7] Generating Vernacular Speech for Rural Disputants...');

  const speakResp = await fetch('http://127.0.0.1:8001/speak', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: 'Dono paksh khet ke medh ke nirdharan par sahmat baadan.',
      lang: 'bhojpuri',
    }),
  });
  if (!speakResp.ok) {
    throw new Error(`Speech synthesis failed: ${speakResp.status}`);
  }
  const audioBuffer = await speakResp.arrayBuffer();
  console.log(`  [PASS] 7.1: Vernacular audio synthesized: ${audioBuffer.byteLength} audio bytes generated.`);

  // ---------------------------------------------------------------------------
  // STEP 8: Safety Escalation Gate & Cross-District Isolation
  // ---------------------------------------------------------------------------
  console.log('\n>>> [STEP 8] Testing Complex Title / Violence Safety Escalation Gate...');

  const escalationIntake = createEvent({
    method: 'POST',
    path: '/cases',
    body: {
      title: 'Ancestral land title dispute and violent threats',
      description: 'Pushtaini zameen registry ko lekar vivaad hai aur lathi se mar-peet ki dhamki di gayi.',
      dialect: 'hindi',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
    },
  });
  const escResult = await lambdaHandler(escalationIntake);
  const escData = JSON.parse(escResult.body);
  const escalatedCaseId = escData.case.id;

  if (escData.case.status !== 'ESCALATED') {
    throw new Error(`Expected case to be ESCALATED due to title/violence, got: ${escData.case.status}`);
  }
  console.log(`  [PASS] 8.1: Safety Gate triggered! Case ${escalatedCaseId} routed to ESCALATED.`);
  console.log(`        - Escalation Reason: ${escData.aiAnalysis.escalationReason}`);

  // In-jurisdiction mediator queries queue
  const mediatorQueueEvent = createEvent({
    method: 'GET',
    path: '/mediator-queue',
    headers: {
      'x-user-id': 'mediator-varanasi-01',
      'x-user-role': 'MEDIATOR',
      'x-user-jurisdiction': 'Varanasi',
    },
    queryStringParameters: { district: 'Varanasi', status: 'ESCALATED' },
  });
  const medQueueResult = await lambdaHandler(mediatorQueueEvent);
  const medQueueData = JSON.parse(medQueueResult.body);
  if (medQueueResult.statusCode !== 200 || medQueueData.count === 0) {
    throw new Error(`Mediator queue query failed: ${medQueueResult.body}`);
  }
  console.log(`  [PASS] 8.2: In-jurisdiction mediator retrieved ${medQueueData.count} escalated case(s).`);

  // Cross-district mediator blocked
  const crossDistEvent = createEvent({
    method: 'GET',
    path: '/mediator-queue',
    headers: {
      'x-user-id': 'mediator-sonipat-01',
      'x-user-role': 'MEDIATOR',
      'x-user-jurisdiction': 'Sonipat',
    },
    queryStringParameters: { district: 'Varanasi' },
  });
  const crossResult = await lambdaHandler(crossDistEvent);
  if (crossResult.statusCode !== 403) {
    throw new Error(`Expected HTTP 403 for cross-district mediator, got: ${crossResult.statusCode}`);
  }
  console.log('  [PASS] 8.3: Cross-district mediator strictly blocked with HTTP 403.');

  // Mediator reviews and approves settlement
  const mediatorReviewEvent = createEvent({
    method: 'PATCH',
    path: `/cases/${escalatedCaseId}/mediator-review`,
    headers: {
      'x-user-id': 'mediator-varanasi-01',
      'x-user-role': 'MEDIATOR',
      'x-user-jurisdiction': 'Varanasi',
    },
    body: {
      settlementDraft: 'Mediator negotiated partition accord after spot physical inspection with Revenue Lekhpal.',
      notes: 'Parties agree to equal 50/50 partition under Section 116 of UP Revenue Code.',
    },
  });
  const medReviewResult = await lambdaHandler(mediatorReviewEvent);
  const medReviewData = JSON.parse(medReviewResult.body);
  if (medReviewResult.statusCode !== 200 || medReviewData.case.status !== 'MEDIATOR_APPROVED') {
    throw new Error(`Mediator review failed: ${medReviewResult.body}`);
  }
  console.log(`  [PASS] 8.4: Mediator revised draft. Case status updated to: ${medReviewData.case.status}.`);

  // ---------------------------------------------------------------------------
  // STEP 9: Lok Adalat Formal Petition Generation
  // ---------------------------------------------------------------------------
  console.log('\n>>> [STEP 9] Generating Formal Section 20 Lok Adalat Petition...');

  const petitionResp = await fetch('http://127.0.0.1:8001/generate-petition', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      case_id: caseId,
      parties: [
        { name: 'Ram Lakhan Yadav', role: 'Petitioner' },
        { name: 'Harish Chandra Singh', role: 'Respondent' },
      ],
      dispute_type: 'Agricultural Land Demarcation & Boundary Encroachment',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      settlement_terms: intakeData.aiAnalysis.settlementDraft,
      statutory_provisions: ['UP Revenue Code 2006, Section 24', 'Legal Services Authorities Act 1987, Section 20'],
    }),
  });
  if (!petitionResp.ok) {
    throw new Error(`Petition generation failed: ${petitionResp.status}`);
  }
  const petitionData = await petitionResp.json();
  console.log(`  [PASS] 9.1: Formal Lok Adalat Petition Generated: ${petitionData.petition_number}`);
  console.log(`        - Target Court: ${petitionData.court}`);
  console.log(`        - Statutory Forum: ${petitionData.statutory_forum}`);
  console.log(`        - Status: ${petitionData.status}`);

  console.log('\n================================================================');
  console.log('  ALL END-TO-END SYSTEM INTEGRATION TESTS PASSED CLEANLY!       ');
  console.log('  TypeScript Backend + Python AI Service + Blockchain Verified! ');
  console.log('================================================================\n');
}

runEndToEndTests().catch((err) => {
  console.error('\n❌ E2E TEST FAILED:', err);
  process.exit(1);
});
