# ClearCase AI/ML Core

> **Voice-Native, Statutory RAG Legal Mediation Assistant for Bharat**  
> Hackathon: *Bharat Builds by WeMakeDevs* | Track: AWS First Commit

This directory contains the Python AI/ML core for **Project ClearCase**, providing:
1. **Statutory Legal RAG Engine (`ingest.py`)**: Chunks and indexes state-specific legal acts from India Code into Amazon OpenSearch / local ChromaDB / local JSON vector stores using Amazon Bedrock Titan Embeddings or local SentenceTransformers.
2. **Multi-Agent Dispute Orchestrator (`agents.py`)**:
   - `TranscriptionAgent`: Ingests regional dialect voice/text (Bhojpuri, Haryanvi, Awadhi, Hindi), normalizes it into clean English semantic text.
   - `StatutoryMatchingAgent`: Performs vector similarity search over state statutory acts, returning top-3 clauses with legal citations and confidence scores.
   - `MediationDraftAgent`: Calls Amazon Bedrock (`Claude 3.5 Sonnet`) with a strict system prompt to draft a neutral, plain-language 3-step compromise agreement in STRICT JSON, enforcing an automated human escalation gate (< 0.60 confidence, or criminal/contested title matters).
3. **Vernacular Speech Synthesis (`tts.py`)**: Converts settlement drafts into regional speech using Amazon Polly neural voices (`Kajal`, `Aditi`) or an offline audio generator.
4. **FastAPI Gateway (`api.py`)**: Exposes production REST endpoints for transcription, statutory analysis, and TTS audio playback.
5. **Canned Offline Datasets (`demo_data/`)**: Ready-to-demo scenarios for land boundary, agricultural wage, and shop rent disputes with offline evaluation guarantees.
6. **External Prompts (`prompts/`)**: Modular prompt templates allowing non-ML teammates to tweak wording without touching Python code.

---

## 🏛️ Statutory Legal Knowledge Base (`data/legal_acts/`)

The legal knowledge base contains curated statutes from [India Code](https://indiacode.gov.in/):
- **Uttar Pradesh Revenue Code, 2006**: Chapter IV & V (Sections 20 to 28) — Maintenance of boundary marks, Lekhpal reporting duties, penalties for medh destruction, and official SDO boundary demarcation.
- **Minimum Wages Act, 1948**: Sections 3, 11, 12, 15, 20, 22 — Agricultural minimum wages, cash/kind provisions, claims adjudication before the Panchayat authority, and compensation up to 10x for delayed/unpaid wages.
- **Uttar Pradesh Regulation of Urban Premises Tenancy Act, 2021**: Sections 4, 8, 10, 13, 21 — Written lease agreements, commercial rent revision limits (max 7%), security deposit caps, essential service protections, and mandatory 30-day notice against summary eviction.
- **Indian Easements Act, 1882**: Sections 4, 13, 15, 33 — Customary rights of way (pagdandi, rasta), cart-tracks, tubewell watercourse runoffs, and 20-year prescriptive easement acquisition.
- **Legal Services Authorities Act, 1987 & CPC Section 89**: Sections 19, 20, 21 — Pre-litigation Lok Adalats, consensual conciliation, non-binding mediation, and legal aid.

---

## ⚙️ Environment Variables & Configuration

All components read configuration from environment variables with safe, automatic fallbacks:

| Variable | Default | Description |
| :--- | :--- | :--- |
| `AWS_REGION` | `ap-south-1` | AWS Region for Bedrock, Polly, and OpenSearch (`ap-south-1` Mumbai or `us-east-1` N. Virginia) |
| `BEDROCK_MODEL_ID` | `anthropic.claude-3-5-sonnet-20240620-v1:0` | Amazon Bedrock Claude 3.5 Sonnet foundation model ID |
| `BEDROCK_EMBEDDING_MODEL_ID` | `amazon.titan-embed-text-v1` | Bedrock Titan Embeddings model ID |
| `EMBEDDING_PROVIDER` | `auto` | `bedrock` (Titan), `local` (SentenceTransformer `all-MiniLM-L6-v2`), or `auto` |
| `VECTOR_STORE` | `chroma` | `chroma` (ChromaDB), `opensearch`, or `local` (pure JSON/NumPy vector index) |
| `MOCK_AI` | `true` | When `true`, returns calibrated legal RAG responses without external network hops |
| `PORT` | `8000` | Port for the FastAPI server |

---

## 🚀 Quickstart: Running End-to-End

### 1. Install Dependencies
```bash
pip install -r requirements-ai.txt
```

### 2. Ingest the Statutory Legal Corpus
Run the ingestion pipeline to parse, chunk, and index the statutory Markdown files into the vector database:
```bash
python ingest.py
```
*Output: Chunks all 5 legal acts, computes embeddings, and indexes them into both ChromaDB (`./chroma_db`) and local persistent JSON store (`data/local_vector_index.json`).*

To use Bedrock Titan Embeddings explicitly:
```bash
EMBEDDING_PROVIDER=bedrock python ingest.py
```

### 3. Run Automated Tests
Execute the comprehensive test suite verifying chunking, vector retrieval, translation, drafting, escalation gates, TTS, and FastAPI endpoints:
```bash
python test_ai_pipeline.py
```

### 4. Start the FastAPI Server
```bash
uvicorn api:app --reload --port 8000
```
API Documentation and interactive Swagger UI will be available at:
👉 **`http://localhost:8000/docs`**

---

## 🔌 API Endpoints Reference

### 1. Health Check: `GET /health`
```bash
curl http://localhost:8000/health
```
**Response**:
```json
{
  "status": "UP",
  "service": "ClearCase AI Core",
  "environment": "MOCK_AI",
  "bedrock_model": "anthropic.claude-3-5-sonnet-20240620-v1:0",
  "vector_store": "ChromaVectorStore",
  "indexed_clauses": 30
}
```

---

### 2. Vernacular Transcription: `POST /transcribe`
Transcribes regional speech/text and translates to clean English semantic text:
```bash
curl -X POST http://localhost:8000/transcribe \
  -H "Content-Type: application/json" \
  -d '{
    "audio_or_text": "Padosi khet ki purani medh kaat kar do feet humre khet ki or bada liya hai gehu buaai ke samay.",
    "dialect": "bhojpuri"
  }'
```
**Response**:
```json
{
  "original_text": "Padosi khet ki purani medh kaat kar do feet humre khet ki or bada liya hai gehu buaai ke samay.",
  "english_text": "The neighboring landowner cut down the boundary ridge and encroached two feet into my field during wheat sowing.",
  "detected_dialect": "bhojpuri",
  "confidence": 0.96
}
```

---

### 3. Statutory Analysis & Mediation Draft: `POST /analyze`
Runs the complete multi-agent pipeline:
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "grievance_text": "The contractor has withheld balance harvest labor wages of ₹3,600 for 15 days.",
    "dialect": "awadhi",
    "state": "Uttar Pradesh",
    "district": "Ayodhya"
  }'
```
**Response**:
```json
{
  "grievance_summary": "Agricultural laborer claims unpaid balance wages for seasonal harvesting labor, which the contractor unilaterally deferred.",
  "applicable_sections": [
    {
      "act": "Minimum Wages Act, 1948",
      "section": "Section 20: Claims arising out of payment of less than minimum rates of wages",
      "text_snippet": "Statutory claim procedure for non-payment or delayed remuneration for scheduled agricultural operations before the Authority or Panchayat."
    }
  ],
  "settlement_draft": "1. The contractor agrees to disburse the full outstanding wage balance of ₹3,600 to the laborer within seven (7) calendar days via UPI or cash with a written receipt.\n2. Both parties agree that the payment shall be witnessed and signed by the Gram Panchayat Pradhan or labor conciliator.\n3. Upon full receipt of ₹3,600, all claims regarding the harvesting wages shall be permanently settled and closed without further dispute.",
  "confidence_score": 0.89,
  "escalate_to_human": false,
  "escalation_reason": null,
  "status": "SETTLEMENT_PROPOSED"
}
```

---

### 4. Vernacular Speech Playback (TTS): `POST /speak`
Synthesizes the settlement proposal into an audio stream for rural disputants:
```bash
curl -X POST http://localhost:8000/speak \
  -H "Content-Type: application/json" \
  -d '{
    "text": "1. Dono paksh lekhpal dwara seema nirdharan par sahmat hain.",
    "lang": "hi-IN"
  }' \
  --output settlement_voice.mp3
```

---

## 🛡️ Safety & Confidence Escalation Engine (< 0.60 Gate)

ClearCase implements an uncompromising safety gate: **The AI knows its own boundaries.**
Whenever a case:
- Computes a statutory confidence score `< 0.60`
- Involves **criminal offenses, physical violence, or assault** (`lathi`, `maara`, `aspatal`)
- Involves **contested hereditary title or forged partition deeds** (`farzi wasiyat`, `batwara`)
- Touches upon matrimonial or custody matters

The system automatically halts automated drafting and marks:
```json
{
  "escalate_to_human": true,
  "escalation_reason": "Criminal offense involving physical violence / Contested ancestral title requiring physical revenue records inspection",
  "status": "ESCALATED"
}
```
In the ClearCase architecture, this instantly routes the case into the human **Panchayat Mediator Queue** for in-person review and dispute conciliation.

---

## 🔄 How to Switch Between Mocks and Live AWS Bedrock

### To Run in 100% Offline Mock Mode (Recommended for Judging):
```bash
# Windows PowerShell:
$env:MOCK_AI="true"
uvicorn api:app --reload --port 8000

# Linux/macOS:
export MOCK_AI="true"
uvicorn api:app --reload --port 8000
```

### To Enable Live Amazon Bedrock & Polly:
1. Ensure your AWS credentials are configured:
   ```bash
   aws configure
   ```
   *(Or set `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION`)*
2. Request model access in the AWS Bedrock console for **Claude 3.5 Sonnet** and **Titan Embeddings**.
3. Set `MOCK_AI="false"`:
   ```bash
   # Windows PowerShell:
   $env:MOCK_AI="false"
   $env:AWS_REGION="us-east-1"  # or ap-south-1
   $env:EMBEDDING_PROVIDER="bedrock"
   uvicorn api:app --reload --port 8000
   ```

If network latency or credentials expire during a live demo, the engine **automatically falls back** to the resilient offline generator without crashing or returning HTTP 500 errors!

---

## 🌟 Advanced Multi-Agent Intelligence Features (v2.0)

In addition to core statutory RAG, ClearCase v2.0 introduces 5 killer multi-agent capabilities:

1. **Gram Panchayat Precedent Memory RAG (`PrecedentMemoryAgent`)**:
   - Indexes past village dispute accords from `data/village_precedents.json`.
   - Incorporates local customary resolutions (*reeti-riwaaj*) into settlement drafts to maximize community adherence.
2. **Multimodal Land Record & Shajra Map OCR Parser (`LandRecordAgent`)**:
   - Ingests scanned/photographed Khatauni and Khasra cadastral records.
   - Extracts plot numbers, registered acreage (Bigha/Hectares), and flags Lekhpal demarcation readiness.
3. **Coercion, Usury & Power-Imbalance Safety Gate (`CoercionDetector`)**:
   - Scans dispute grievances for predatory interest rates (>36%), retention of identity documents (Aadhaar, passbooks), and caste/well boycotts.
   - Automatically halts automated civil mediation and escalates directly to the District Legal Services Authority (DLSA).
4. **Vernacular Dialect Re-Synthesizer (`DialectTranslator`)**:
   - Translates formal legal terms into authentic regional spoken idioms (Bhojpuri, Awadhi, Maithili, Malvi, Haryanvi) for voice playback.
5. **Section 20 Lok Adalat Formal Petition Generator (`PetitionGenerator`)**:
   - Generates a court-ready, bilingual pre-litigation application formatted under Section 19 & 20 of the Legal Services Authorities Act, 1987.
   - Includes prayer for a compromise award under Section 21 having the force of a civil court decree.
6. **Groq Open-Source Dual Fallback (`GroqLLMClient`)**:
   - Seamless fallback to `llama-3.3-70b-versatile` and `qwen-2.5-32b` on Groq if AWS Bedrock is throttled or offline.

---

## 🧪 Comprehensive Verification & Test Suites

ClearCase includes two comprehensive test suites:

```bash
# Run the complete 35-test unit, multi-agent, and REST API suite
python test_comprehensive_suite.py

# Run the 13-test core pipeline check
python test_ai_pipeline.py
```

### Test Suite Coverage (35/35 PASSED):
- **Statutory Chunking & Retrieval** (Tests 1-2)
- **Gram Panchayat Precedent Memory RAG** (Tests 3-4)
- **Land Record & Shajra Map OCR Parsing** (Tests 5-6)
- **Coercion, Usury & Document Retention Safety Gates** (Tests 7-10)
- **Vernacular Dialect Re-Synthesis** (Tests 11-13)
- **Section 20 Lok Adalat Court Petitions** (Tests 14-15)
- **Groq Open-Source LLM Fallback Client** (Tests 16-17)
- **Regional Dialect Audio Transcription** (Tests 18-20)
- **Multi-Agent Dispute Settlement & Escalation** (Tests 21-26)
- **Amazon Polly & Resilient Speech Audio Synthesis** (Tests 27-28)
- **FastAPI Endpoints Integration** (Tests 29-34)
- **Zero-Secret Credential & Security Hygiene Audit** (Test 35)

---

## 📂 Directory Structure

```
.
├── data/
│   ├── legal_acts/                                # 5 State and Central Statutes (India Code)
│   │   ├── up_revenue_code_2006_boundary_and_demarcation.md
│   │   ├── minimum_wages_act_1948_agricultural_claims.md
│   │   ├── up_urban_premises_tenancy_act_2021_rent_and_eviction.md
│   │   ├── indian_easements_act_1882_access_and_watercourses.md
│   │   └── legal_services_authorities_act_1987_lok_adalat_mediation.md
│   ├── village_precedents.json                    # Historical Gram Panchayat precedent corpus
│   └── local_vector_index.json                    # Persistent offline NumPy/JSON vector index
├── prompts/                                       # Non-ML teammate editable prompt templates
├── demo_data/                                     # 25 expanded real-world dispute scenarios
├── docs/                                          # 13 comprehensive architecture & developer docs
│   ├── 01-project-overview-and-domain-context.md
│   ├── 02-backend-integration-and-developer-guide.md
│   ├── 03-ai-stack-and-multi-agent-architecture.md
│   ├── 04-proposed-architecture-user-flow-and-diagrams.md
│   ├── 05-credentials-and-secret-keys-setup-guide.md
│   ├── 06-aws-configuration-and-cloud-services.md
│   ├── 07-full-project-summary-and-key-pointers.md
│   ├── 08-troubleshooting-and-common-issues.md
│   ├── 09-how-to-run-end-to-end-commands-guide.md
│   ├── 10-frontend-ui-specifications-and-requirements.md
│   ├── 11-full-features-catalog.md
│   ├── 12-complete-api-and-ai-endpoints-reference.md
│   └── 13-frontend-master-prompt-single-shot.md
├── ingest.py                                      # Chunking, Titan/Local embedding & vector indexing
├── agents.py                                      # 8 Specialized AI Agents & safety gates
├── tts.py                                         # Polly & resilient speech synthesis
├── api.py                                         # FastAPI production REST gateway
├── test_ai_pipeline.py                            # 13 core tests
├── test_comprehensive_suite.py                    # 35 comprehensive tests
└── requirements-ai.txt                            # Python dependencies
```
