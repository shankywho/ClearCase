# ClearCase: End-to-End Command & Execution Guide

This document contains step-by-step terminal commands for developers, evaluators, and judges to run and test the complete ClearCase system on Windows (PowerShell) and Linux/macOS (Bash).

---

## 1. Prerequisites & Environment Setup

### Node.js & TypeScript
- Node.js v18.0.0 or higher
- npm v9.0.0 or higher

```powershell
# Verify Node.js
node -v
npm -v

# Install dependencies in repository root
npm install
```

### Python Environment
- Python 3.10 or 3.11 recommended

```powershell
# (Optional) Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install Python AI dependencies
pip install fastapi uvicorn pydantic sentence-transformers chromadb boto3 requests
```

---

## 2. Ingesting Statutory Legal Knowledge Base

Run the semantic ingestion pipeline to chunk statutory acts, compute vector embeddings, and populate ChromaDB and the local persistent index:

```powershell
python ingest.py
```

**Expected Output**:
```text
Loaded 5 statutory act documents from data/legal_acts
Generated 30 semantic chunks across statutory domains.
Indexed 30 chunks into ChromaDB ('clearcase_legal_acts') and data/local_vector_index.json.
Ingestion pipeline completed successfully!
```

---

## 3. Generating Expanded Demo Dataset (25 Scenarios)

Populate the 25 diverse real-world Indian rural dispute files spanning land boundaries, minimum wages, tenancy, irrigation canals, and predatory usury:

```powershell
python scripts/generate_demo_dataset.py
```

**Expected Output**:
```text
Generated 25 comprehensive dispute scenario files in demo_data/
```

---

## 4. Running the Verification & Test Suites

### A. Python AI Microservice Tests (35 Comprehensive Unit & Integration Tests)
```powershell
python test_comprehensive_suite.py
```
*Validates Statutory RAG, Precedent Memory, Shajra OCR, Coercion Safety Gates, Vernacular Dialects, Section 20 Lok Adalat Petitions, and FastAPI REST endpoints.*

### B. Python Fast Pipeline Sanity Check (13 Core Tests)
```powershell
python test_ai_pipeline.py
```

### C. TypeScript Backend Integration & Native Suite
```powershell
# Run all Jest backend tests
npm test

# Run dedicated AI Service integration test
npm run test:ai
```

---

## 5. Starting the Services

### Step 1: Start the Python AI Microservice (Port 8000)
Open Terminal 1:
```powershell
python api.py
```
Server starts on `http://localhost:8000`. You can inspect interactive OpenAPI documentation at `http://localhost:8000/docs`.

### Step 2: Start the TypeScript Express Backend (Port 3000)
Open Terminal 2:
```powershell
# Set environment flags to connect to Python AI
$env:USE_PYTHON_AI = "true"
$env:AI_SERVICE_URL = "http://localhost:8000"

npm run dev
```
Backend API starts on `http://localhost:3000`.

---

## 6. Testing Endpoints via cURL or PowerShell

### 1. Health Check
```powershell
curl http://localhost:8000/health
```

### 2. Statutory Dispute Analysis (RAG + Precedent + Coercion Gate)
```powershell
curl -X POST http://localhost:8000/analyze `
  -H "Content-Type: application/json" `
  -d '{"transcript": "Bhaiya padosi ne khet ki medh do foot kaat li hai. Lekhpal se naap karwa ke purani seema bahal karni hai.", "district": "Varanasi", "state": "Uttar Pradesh", "dialect": "bhojpuri"}'
```

### 3. Land Record & Shajra Map OCR Parsing
```powershell
curl -X POST http://localhost:8000/analyze-record `
  -H "Content-Type: application/json" `
  -d '{"record_text_or_ocr": "Khatauni Khasra No 412/1, Rakba 0.4520 Hectare, Village Shivpur, Tehsil Sadar"}'
```

### 4. Section 20 Lok Adalat Court Petition Generation
```powershell
curl -X POST http://localhost:8000/generate-petition `
  -H "Content-Type: application/json" `
  -d '{"case_id": "CASE-2026-VNS-001", "title": "Field Boundary Encroachment", "district": "Varanasi", "state": "Uttar Pradesh", "petitioner": {"name": "Ram Lakhan Yadav"}, "respondent": {"name": "Harish Chandra Singh"}, "settlement_draft": "Both parties agreed to restore boundary ridge under Section 24 of UP Revenue Code 2006."}'
```

### 5. Vernacular Voice Synthesis
```powershell
curl -X POST http://localhost:8000/speak `
  -H "Content-Type: application/json" `
  -d '{"text": "Aapka samjhauta tayyar hai. Kripya sunein.", "language_code": "hi-IN", "voice_id": "Kajal"}'
```
