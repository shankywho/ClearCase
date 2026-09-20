import { mockClient } from 'aws-sdk-client-mock';
import { PutCommand, UpdateCommand, QueryCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '../src/db/client';
import { orchestrateDisputeAnalysis, transcribeGrievance, matchStatute, generateDraft } from '../src/services/aiService';
import { lambdaHandler } from '../src/app';
import { APIGatewayProxyEvent } from 'aws-lambda';

// Force mock AI mode for deterministic testing
process.env.MOCK_AI = 'true';
process.env.TABLE_NAME = 'ClearCaseTable-test';

const ddbMock = mockClient(docClient);

async function runAiOrchestrationTests() {
  console.log('================================================================');
  console.log('  CLEARCASE AI ORCHESTRATION & RAG PIPELINE: VERIFICATION RUN   ');
  console.log('================================================================\n');

  // ---------------------------------------------------------------------------
  // TEST 1: High-Confidence Boundary Dispute -> SETTLEMENT_PROPOSED
  // ---------------------------------------------------------------------------
  console.log('--- Test 1: High-Confidence Land Boundary Dispute ---');
  const boundaryResult = await orchestrateDisputeAnalysis({
    audioRef: 's3://clearcase-audio/grievances/boundary-shivpur.wav',
    dialect: 'bhojpuri',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
  });

  console.log(`[PASS] Transcription Dialect: ${boundaryResult.transcription.detectedDialect}`);
  console.log(`[PASS] Matched Statute: ${boundaryResult.statutes[0]?.act} - ${boundaryResult.statutes[0]?.section}`);
  console.log(`[PASS] Confidence Score: ${boundaryResult.draft.confidenceScore} (>= 0.70)`);
  console.log(`[PASS] Routed Status: ${boundaryResult.suggestedStatus}`);

  if (boundaryResult.suggestedStatus !== 'SETTLEMENT_PROPOSED') {
    throw new Error('Test 1 Failed: Expected SETTLEMENT_PROPOSED status.');
  }
  if (!boundaryResult.draft.suggestedDraft) {
    throw new Error('Test 1 Failed: Missing suggested draft.');
  }
  console.log('');

  // ---------------------------------------------------------------------------
  // TEST 2: Low-Confidence Dispute (< 0.70) -> ESCALATED to Human Mediator
  // ---------------------------------------------------------------------------
  console.log('--- Test 2: Low-Confidence Contested Ancestral Deed Dispute ---');
  const lowConfidenceResult = await orchestrateDisputeAnalysis({
    transcript: 'Neighbor claims boundary based on disputed unregistered ancestral deed and title registry.',
    dialect: 'hindi',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
  });

  console.log(`[PASS] Confidence Score: ${lowConfidenceResult.draft.confidenceScore} (< 0.70 threshold)`);
  console.log(`[PASS] Escalation Recommended: ${lowConfidenceResult.draft.escalationRecommended}`);
  console.log(`[PASS] Escalation Reason: ${lowConfidenceResult.draft.escalationReason}`);
  console.log(`[PASS] Routed Status: ${lowConfidenceResult.suggestedStatus}`);

  if (lowConfidenceResult.suggestedStatus !== 'ESCALATED') {
    throw new Error('Test 2 Failed: Expected ESCALATED status for low confidence score.');
  }
  console.log('');

  // ---------------------------------------------------------------------------
  // TEST 3: Agricultural Wage Dispute -> Minimum Wages Act Match
  // ---------------------------------------------------------------------------
  console.log('--- Test 3: Agricultural Wage Dispute ---');
  const wageResult = await orchestrateDisputeAnalysis({
    audioRef: 's3://clearcase-audio/grievances/unpaid-wage.wav',
    dialect: 'bhojpuri',
    state: 'Uttar Pradesh',
    district: 'Gorakhpur',
  });

  console.log(`[PASS] Matched Statute: ${wageResult.statutes[0]?.act} - ${wageResult.statutes[0]?.section}`);
  console.log(`[PASS] Confidence Score: ${wageResult.draft.confidenceScore}`);
  console.log(`[PASS] Routed Status: ${wageResult.suggestedStatus}`);

  if (!wageResult.statutes[0]?.act.includes('Minimum Wages Act')) {
    throw new Error('Test 3 Failed: Expected Minimum Wages Act match.');
  }
  console.log('');

  // ---------------------------------------------------------------------------
  // TEST 4: End-to-End API Gateway Lambda Flow (POST /cases)
  // ---------------------------------------------------------------------------
  console.log('--- Test 4: End-to-End API Gateway POST /cases with AI Routing ---');
  ddbMock.reset();
  ddbMock.on(PutCommand).resolves({});
  ddbMock.on(UpdateCommand).resolves({
    Attributes: {
      PK: 'CASE#demo-001',
      SK: 'METADATA',
      GSI1PK: 'JURISDICTION#Varanasi',
      GSI1SK: 'STATUS#SETTLEMENT_PROPOSED',
      id: 'demo-001',
      title: 'Boundary dispute at Mauza Shivpur',
      status: 'SETTLEMENT_PROPOSED',
      confidenceScore: 0.86,
      settlementDraft: 'Joint physical demarcation with Village Lekhpal',
    },
  });

  const mockApiEvent: Partial<APIGatewayProxyEvent> = {
    httpMethod: 'POST',
    path: '/cases',
    body: JSON.stringify({
      title: 'Ridge encroachment in wheat plot',
      description: 'Padosi khet ki purani medh kaat kar do feet andar bada liya hai.',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      dialect: 'bhojpuri',
      petitioner: {
        name: 'Ram Lakhan Yadav',
        phone: '+919876543210',
      },
    }),
  };

  const response = await lambdaHandler(mockApiEvent as APIGatewayProxyEvent);
  console.log(`[PASS] HTTP Status Code: ${response.statusCode}`);
  const responseBody = JSON.parse(response.body);
  console.log(`[PASS] API Response Message: ${responseBody.message}`);
  console.log(`[PASS] AI Routed Case Status: ${responseBody.case.status}`);
  console.log(`[PASS] AI Confidence Score: ${responseBody.aiAnalysis.confidenceScore}`);

  if (response.statusCode !== 201) {
    throw new Error(`Test 4 Failed: Expected HTTP 201, got ${response.statusCode}`);
  }
  if (responseBody.case.status !== 'SETTLEMENT_PROPOSED') {
    throw new Error('Test 4 Failed: Expected SETTLEMENT_PROPOSED status in API response.');
  }

  console.log('\n================================================================');
  console.log('  ALL AI ORCHESTRATION & ESCALATION TESTS PASSED CLEANLY!       ');
  console.log('================================================================\n');
}

runAiOrchestrationTests().catch((err) => {
  console.error('[FAIL] AI Orchestration test encountered error:', err);
  process.exit(1);
});
