# ClearCase Backend

> **Offline-First, Voice-Native AI Dispute Resolution Mesh for Bharat**  
> Hackathon: *Bharat Builds by WeMakeDevs* | Track: AWS First Commit

ClearCase bridges the justice gap for rural citizens by combining voice-first regional dialect intake, statutory RAG matching against state acts, Bedrock Claude 3.5 Sonnet neutral settlement drafting, fine-grained Cedar authorization, dual-party OTP digital consent, human mediator escalation queues, and cryptographic settlement anchoring on Polygon Amoy.

This repository hosts the **complete end-to-end backend system** (Phases 1 through 4), implementing a DynamoDB Single-Table Design, AWS Cedar AuthZ, Amazon Bedrock AI orchestration, Twilio/Exotel OTP state machine, and Polygon Amoy smart contract anchoring.

---

## 🛠️ Architecture & Core Components

```
                +-------------------------------------------------------------+
                |                    Regional Citizen Intake                  |
                |  Voice Grievance (Bhojpuri/Hindi/Maithili) / Dialect Audio  |
                +------------------------------+------------------------------+
                                               |
                                               v
                +-------------------------------------------------------------+
                |           Amazon API Gateway & AWS Lambda Router            |
                |          AWS Cedar Policy Engine (Fine-Grained AuthZ)       |
                +--------------+-------------------------------+--------------+
                               |                               |
                               v                               v
        +------------------------------+       +------------------------------+
        |  Amazon Bedrock Multi-Agent  |       |   Amazon DynamoDB (Single)   |
        |  - Dialect Transcription     |       |  - PK: CASE#<id>, SK: META   |
        |  - OpenSearch Statutory RAG  |       |  - GSI1: MediatorQueueIndex  |
        |  - Claude 3.5 Sonnet Draft   |       |  - TTL on `otpExpiry`        |
        +--------------+---------------+       +--------------+---------------+
                       |                                      |
                       v                                      v
        +------------------------------+       +------------------------------+
        |   Dual-Party OTP Consent     |       |   Polygon Amoy Blockchain    |
        |  - SMS & IVR Audio Stubs     | ----> |  - Deterministic SHA-256     |
        |  - Atomic CONSENT_ACHIEVED   |       |  - ClearCaseRegistry Anchor  |
        +------------------------------+       +------------------------------+
```

### Complete Documentation Suite (`docs/`)
* **Python AI/ML Multi-Agent Core**: [README_AI.md](README_AI.md)
* **Project Original Pitch Deck Context**: [docs/legal.pdf](docs/legal.pdf)
* **01. Project Overview & Bharat Domain Context**: [docs/01-project-overview-and-domain-context.md](docs/01-project-overview-and-domain-context.md)
* **02. Backend Integration & Developer Guide**: [docs/02-backend-integration-and-developer-guide.md](docs/02-backend-integration-and-developer-guide.md)
* **03. AI Stack & Multi-Agent Architecture**: [docs/03-ai-stack-and-multi-agent-architecture.md](docs/03-ai-stack-and-multi-agent-architecture.md)
* **04. Proposed Architecture, User Flows & Mermaid Diagrams**: [docs/04-proposed-architecture-user-flow-and-diagrams.md](docs/04-proposed-architecture-user-flow-and-diagrams.md)
* **05. Credentials & Secret Keys Setup Guide**: [docs/05-credentials-and-secret-keys-setup-guide.md](docs/05-credentials-and-secret-keys-setup-guide.md)
* **06. AWS Configuration & Cloud Services**: [docs/06-aws-configuration-and-cloud-services.md](docs/06-aws-configuration-and-cloud-services.md)
* **07. Full Project Summary & Key Pointers**: [docs/07-full-project-summary-and-key-pointers.md](docs/07-full-project-summary-and-key-pointers.md)
* **08. Troubleshooting & Common Issues Guide**: [docs/08-troubleshooting-and-common-issues.md](docs/08-troubleshooting-and-common-issues.md)
* **09. How to Run End-to-End Commands Guide**: [docs/09-how-to-run-end-to-end-commands-guide.md](docs/09-how-to-run-end-to-end-commands-guide.md)
* **10. Frontend UI Specifications & Low-Literacy Requirements**: [docs/10-frontend-ui-specifications-and-requirements.md](docs/10-frontend-ui-specifications-and-requirements.md)
* **11. Full Features Catalog & Capabilities Matrix**: [docs/11-full-features-catalog.md](docs/11-full-features-catalog.md)
* **12. Complete API & AI Endpoints Reference**: [docs/12-complete-api-and-ai-endpoints-reference.md](docs/12-complete-api-and-ai-endpoints-reference.md)
* **13. Frontend Single-Shot Master Prompt**: [docs/13-frontend-master-prompt-single-shot.md](docs/13-frontend-master-prompt-single-shot.md)
* **Single-Table Design & Schema**: [docs/database-schema.md](docs/database-schema.md)
* **AWS Cedar Authorization**: [docs/authorization-cedar.md](docs/authorization-cedar.md)
* **Dual-Party OTP Consent Engine**: [docs/otp-consent-flow.md](docs/otp-consent-flow.md)
* **Polygon Amoy Blockchain Anchoring**: [docs/blockchain-anchoring.md](docs/blockchain-anchoring.md)
* **Backend API Summary**: [docs/backend-api-summary.md](docs/backend-api-summary.md)

---

## ⚙️ Environment Variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `AWS_REGION` | `ap-south-1` | AWS Region (e.g., Mumbai `ap-south-1` or `us-east-1` for Bedrock) |
| `BEDROCK_MODEL_ID` | `anthropic.claude-3-5-sonnet-20240620-v1:0` | Amazon Bedrock Foundation Model ID |
| `MOCK_AI` | `true` | When `true`, returns calibrated legal RAG responses without Bedrock network calls |
| `TABLE_NAME` | `ClearCaseTable-local` | Target DynamoDB table name |
| `DYNAMODB_ENDPOINT` | `http://localhost:8000` | Custom DynamoDB endpoint (used in local development) |
| `POLYGON_RPC_URL` | `https://rpc-amoy.polygon.technology/` | Polygon Amoy testnet RPC endpoint (Chain ID: 80002) |
| `PRIVATE_KEY` | `mock-key` | Signer private key for on-chain anchoring transactions |
| `CLEARCASE_REGISTRY_ADDRESS` | `0x435A9D490EbF92C32D19D20888913B0957917C5B` | Deployed `ClearCaseRegistry.sol` smart contract on Amoy |
| `MOCK_BLOCKCHAIN` | `true` | When `true`, simulates ~2.5s block confirmation and returns realistic Amoy receipts |

---

## 🚀 Quickstart: Running Locally

### 1. Prerequisites
* **Node.js**: v20.x, v22+, or v24+
* **Docker Desktop**: For running DynamoDB Local
* **AWS SAM CLI**: (Optional) for `sam local start-api` container emulation

---

### 2. Install Dependencies
```bash
npm install
```

---

### 3. Start DynamoDB Local
Launch the DynamoDB Local Docker container on port `8000`:
```bash
docker compose up -d
```

Verify that the container is healthy:
```bash
docker ps --filter "name=clearcase-dynamodb-local"
```

---

### 4. Initialize Local Database Table
Run the schema initialization script to create `ClearCaseTable-local`, configure the `MediatorQueueIndex` GSI, and activate TTL on `otpExpiry`:
```bash
npm run db:init
```

---

### 5. Run Automated Test Suites
Run all four automated test suites across the complete system:

```bash
# Run ALL test suites and build verification in a single command:
npm run test:all

# Or run individual test suites:
# Test 1: Single-Table CRUD & GSI Mediator Queue
npm test

# Test 2: Multi-Agent AI Pipeline, Bedrock Claude Draft, and Escalation Routing
npm run test:ai

# Test 3: Cedar Fine-Grained AuthZ, Dual-Party OTP Consent, Mediator Overrides & Audit Trail
npm run test:phase3

# Test 4: Canonical SHA-256 Hashing, Polygon Amoy Anchoring, Precondition Guard & Immutability
npm run test:phase4
```

---

### 6. Run API via AWS SAM Local
1. Build the SAM application:
```bash
sam build
```

2. Start the local API Gateway on port `3000`:
```bash
sam local start-api --docker-network bridge
```

The API will route requests to DynamoDB Local via `http://host.docker.internal:8000`.

---

## 🔐 Cedar Authorization Headers

All API endpoints enforce fine-grained access control using caller headers:

| Header | Citizen Example | Mediator Example | Description |
| :--- | :--- | :--- | :--- |
| `x-user-id` | `+919876543210` | `mediator-vns-1` | Unique caller phone number or mediator ID |
| `x-user-role` | `CITIZEN` | `MEDIATOR` | Role (`CITIZEN` or `MEDIATOR`) |
| `x-user-jurisdiction` | *(None)* | `Varanasi` | Mandatory for mediators to enforce district isolation |

---

## 🎬 Hackathon Judge Demo Script

Follow these steps sequentially to test the full end-to-end pipeline from voice grievance intake to immutable Polygon Amoy blockchain anchoring.

```
Intake (Voice & AI RAG) ──> Respondent Join ──> Dual OTP Consent ──> Polygon Amoy Anchoring ──> Audit Verification
```

### Step 1: Health Check
Verify that the service is running and connected to the DynamoDB table:
```bash
curl -X GET http://localhost:3000/health
```
**Expected Output**: `{"status":"UP","service":"ClearCase Backend API","environment":"SAM_LOCAL",...}`

---

### Step 2: Dispute Intake with Voice Grievance & AI RAG
Citizen A (Petitioner) registers a boundary dispute in Bhojpuri. The Bedrock multi-agent pipeline automatically transcribes the audio, queries statutory provisions via OpenSearch RAG, drafts a neutral compromise proposal, and dispatches Petitioner OTP.

```bash
curl -s -X POST http://localhost:3000/cases \
  -H "Content-Type: application/json" \
  -H "x-user-id: +919876543210" \
  -H "x-user-role: CITIZEN" \
  -d '{
    "title": "Agricultural Boundary Dispute at Mauza Shivpur",
    "description": "Padosi khet ki purani medh kaat kar do feet humre khet ki or bada liya hai gehu buaai ke samay.",
    "dialect": "bhojpuri",
    "state": "Uttar Pradesh",
    "district": "Varanasi",
    "village": "Shivpur",
    "originalAudioUrl": "s3://clearcase-audio/grievance-shivpur-01.wav",
    "petitioner": {
      "name": "Ram Lakhan Yadav",
      "phone": "+919876543210"
    }
  }' | jq
```
*Note the returned `case.id` (e.g. `case-12345678`) and the 6-digit OTP displayed in the terminal logs.*

---

### Step 3: Respondent Joins the Dispute
Citizen B (Harish Chandra Singh) joins the case. An OTP is instantly dispatched to their phone via SMS/IVR.

```bash
curl -s -X POST http://localhost:3000/cases/<CASE_ID>/join \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Harish Chandra Singh",
    "phone": "+919123456780",
    "role": "RESPONDENT"
  }' | jq
```
*Note the second 6-digit OTP emitted in the terminal for the respondent.*

---

### Step 4: Dual-Party OTP Consent Verification
Both parties review the AI-formulated compromise and confirm their agreement using their respective OTPs.

#### 4a. Petitioner Confirms:
```bash
curl -s -X POST http://localhost:3000/cases/<CASE_ID>/confirm \
  -H "Content-Type: application/json" \
  -H "x-user-id: +919876543210" \
  -H "x-user-role: CITIZEN" \
  -d '{
    "phone": "+919876543210",
    "otp": "<PETITIONER_OTP>"
  }' | jq
```
*Status remains `SETTLEMENT_PROPOSED`; `consentEvaluation.consentAchieved` is `false` (waiting for Respondent).*

#### 4b. Respondent Confirms (Triggers Atomic State Transition):
```bash
curl -s -X POST http://localhost:3000/cases/<CASE_ID>/confirm \
  -H "Content-Type: application/json" \
  -H "x-user-id: +919123456780" \
  -H "x-user-role: CITIZEN" \
  -d '{
    "phone": "+919123456780",
    "otp": "<RESPONDENT_OTP>"
  }' | jq
```
*Case atomically transitions to **`CONSENT_ACHIEVED`**! Terminal logs display: `[OTP Service] 🎉 DUAL-PARTY CONSENT ACHIEVED for Case: <CASE_ID>`.*

---

### Step 5: (Precondition Guard Check) Anchoring Guard Verification
Attempting to anchor an unconsented case or modifying state without consent fails immediately:
```bash
# If called on any case NOT in CONSENT_ACHIEVED status:
# Returns HTTP 400 with code "PRECONDITION_FAILED"
```

---

### Step 6: Immutable Blockchain Anchoring on Polygon Amoy
Once `CONSENT_ACHIEVED` is reached, trigger cryptographic on-chain anchoring:

```bash
curl -s -X POST http://localhost:3000/cases/<CASE_ID>/anchor \
  -H "Content-Type: application/json" \
  -H "x-user-id: +919876543210" \
  -H "x-user-role: CITIZEN" | jq
```

**Terminal Trace**:
```text
================================================================
[Blockchain: Polygon Amoy] ⚡ Initiating on-chain anchoring for Case: <CASE_ID>
[Blockchain: Polygon Amoy] Settlement Hash: 0x14eeec557249ec5feb62914a0c2d64acc029b2ed75daa5d816e4ea9d603c319a
[Blockchain: Polygon Amoy] Target Contract: 0x435A9D490EbF92C32D19D20888913B0957917C5B
[Blockchain: Polygon Amoy] Network: Polygon Amoy Testnet (Chain ID: 80002)
[Blockchain: Polygon Amoy] MOCK_BLOCKCHAIN=true: Simulating transaction broadcast and block confirmation...
[Blockchain: Polygon Amoy] ✅ Transaction Confirmed in Block #15421476!
[Blockchain: Polygon Amoy] TxHash: 0x19f2d55666f5a2cc8f7d3be06f9010019ffd9b2a968c221fdb80bb49
[Blockchain: Polygon Amoy] 🔗 Amoy Polygonscan Explorer: https://amoy.polygonscan.com/tx/0x19f2d556...
================================================================
```

**Response**:
* Case status is updated to **`ANCHORED`**.
* `onChainTxHash` is permanently attached to the DynamoDB case record.
* Public Polygonscan explorer link is generated for verification.

---

### Step 7: View Immutable Audit Trail
Inspect the chronological, append-only audit trail proving every transition from creation to blockchain anchoring:

```bash
curl -s -X GET http://localhost:3000/cases/<CASE_ID>/audit \
  -H "x-user-id: +919876543210" \
  -H "x-user-role: CITIZEN" | jq
```

Events recorded:
1. `CASE_CREATED` (Citizen Intake)
2. `PARTY_JOINED` (Petitioner registration)
3. `OTP_SENT` (Simulated SMS/IVR dispatch)
4. `AI_ANALYSIS_COMPLETED` (Bedrock Claude 3.5 Sonnet RAG)
5. `PARTY_JOINED` (Respondent registration)
6. `OTP_VERIFIED` (Petitioner acceptance)
7. `OTP_VERIFIED` (Respondent acceptance)
8. `CONSENT_ACHIEVED` (Atomic consensus gate)
9. `ANCHORED_ON_CHAIN` (Polygon Amoy TxHash & Block confirmation)

---

### Step 8: (Optional Branch) Human Mediator Review & Escalation Workflow

To test the human mediator escalation path:

#### 8a. Mediator Queries District Queue (Cedar Guarded):
```bash
curl -s -X GET "http://localhost:3000/mediator-queue?district=Varanasi&status=ESCALATED" \
  -H "x-user-id: mediator-vns-1" \
  -H "x-user-role: MEDIATOR" \
  -H "x-user-jurisdiction: Varanasi" | jq
```

#### 8b. Cross-District Mediator Blocked by Cedar (Rule 2):
```bash
# Sonipat mediator attempting to access Varanasi queue:
curl -s -X GET "http://localhost:3000/mediator-queue?district=Varanasi" \
  -H "x-user-id: mediator-sonipat-1" \
  -H "x-user-role: MEDIATOR" \
  -H "x-user-jurisdiction: Sonipat" | jq
```
*Returns HTTP `403 Forbidden` with reason: `Mediator jurisdiction "Sonipat" does not match Case jurisdiction "Varanasi"`.*

#### 8c. In-Jurisdiction Mediator Revises Draft:
```bash
curl -s -X PATCH http://localhost:3000/cases/<CASE_ID>/mediator-review \
  -H "Content-Type: application/json" \
  -H "x-user-id: mediator-vns-1" \
  -H "x-user-role: MEDIATOR" \
  -H "x-user-jurisdiction: Varanasi" \
  -d '{
    "settlementDraft": "Mediator revised compromise: Ridge restored to 1982 village survey map coordinates.",
    "notes": "Reviewed on-site with Gram Lekhpal and both parties."
  }' | jq
```
*Case updates to `MEDIATOR_APPROVED`; party consents are safely reset to `PENDING` with fresh OTPs.*

---

## 📂 Project Structure

```
.
├── contracts/
│   └── ClearCaseRegistry.sol     # Solidity contract for Polygon Amoy anchoring
├── docs/
│   ├── ai-orchestration.md       # Bedrock Claude 3.5 Sonnet & OpenSearch RAG doc
│   ├── authorization-cedar.md    # AWS Cedar fine-grained policies specification
│   ├── backend-api-summary.md    # Complete backend API & endpoints reference
│   ├── blockchain-anchoring.md   # Polygon Amoy anchoring & SHA-256 hashing doc
│   ├── database-schema.md        # Comprehensive DynamoDB Single-Table schema doc
│   └── otp-consent-flow.md       # Dual-party OTP consent state machine doc
├── policies/
│   └── clearcase.cedar           # Cedar policy rules (Citizen Isolation & Mediator Guards)
├── scripts/
│   ├── init-local-db.ts          # Table & GSI creation for local DynamoDB
│   ├── test-ai-orchestration.ts  # End-to-end multi-agent AI & escalation tests
│   ├── test-phase3.ts            # Phase 3 AuthZ, Dual-OTP, Mediator & Audit tests
│   ├── test-phase4.ts            # Phase 4 Blockchain Anchoring & Immutability tests
│   ├── test-repositories.ts      # Live DynamoDB integration test script
│   └── unit-test.ts              # Mock-based repository test suite
├── src/
│   ├── authz/
│   │   └── cedarService.ts       # AWS Cedar policy evaluation & principal extraction
│   ├── db/
│   │   ├── client.ts             # AWS SDK v3 client with SAM Local routing
│   │   ├── AuditRepository.ts    # Append-only audit trail logging in DynamoDB
│   │   ├── CaseRepository.ts     # Case CRUD and GSI Mediator Queue queries
│   │   └── PartyRepository.ts    # Party management, OTP verification, consent reset
│   ├── services/
│   │   ├── aiService.ts          # Bedrock Claude 3.5 Sonnet & OpenSearch RAG service
│   │   ├── blockchainService.ts  # Canonical SHA-256 hashing & Polygon Amoy service
│   │   ├── mediaService.ts       # S3 audio storage & Polly TTS service
│   │   └── otpService.ts         # Twilio/Exotel SMS stub & dual-consent evaluator
│   ├── types/
│   │   └── index.ts              # TypeScript entities, keys, DTOs & Cedar types
│   └── app.ts                    # API Gateway Lambda catch-all router with Cedar AuthZ
├── docker-compose.yml            # Local DynamoDB container definition
├── legal.md                      # ClearCase hackathon architecture & master plan
├── package.json
├── template.yaml                 # AWS SAM infrastructure definition
└── tsconfig.json
```

---

## ⚖️ License
Apache-2.0. Built for Bharat.
