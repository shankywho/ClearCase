# ClearCase: Complete API & AI Endpoints Reference

This document provides exhaustive API documentation for both the Python AI Microservice (Port 8000) and the Node.js TypeScript Backend (Port 3000).

---

## 1. Python AI Microservice Endpoints (Port 8000)

Base URL: `http://localhost:8000`

### 1.1 `GET /health`
Verifies microservice operational status, version, and active AI engine.

**Response `200 OK`**:
```json
{
  "status": "healthy",
  "service": "ClearCase AI Statutory Engine",
  "version": "2.0.0",
  "supported_features": [
    "Statutory RAG (OpenSearch / ChromaDB / Local)",
    "Panchayat Precedent Memory RAG",
    "Land Record & Shajra Map OCR Parser",
    "Coercion & Usury Safety Gate",
    "Vernacular Dialect Re-Synthesizer",
    "Section 20 Lok Adalat Petition Generator",
    "Groq Open-Source Fallback (LLaMA-3.3-70B / Qwen-2.5-32B)",
    "Amazon Polly / Resilient PCM Voice Synthesis"
  ]
}
```

---

### 1.2 `POST /transcribe`
Transcribes regional dialect voice input into standardized Devanagari and English legal text.

**Request**:
```json
{
  "audio_uri": "s3://clearcase-audio/disputes/boundary-01.wav",
  "transcript": "Bhaiya padosi ne khet ki medh do foot kaat li hai.",
  "dialect_hint": "bhojpuri"
}
```

**Response `200 OK`**:
```json
{
  "transcript": "The neighboring landowner cut down the boundary ridge and encroached by two feet.",
  "language_detected": "bhojpuri",
  "confidence": 0.94
}
```

---

### 1.3 `POST /analyze`
Primary multi-agent reasoning endpoint: checks coercion safety gate, searches statutory acts, retrieves Gram Panchayat precedents, and formulates a 3-point neutral accord.

**Request**:
```json
{
  "transcript": "Padosi ne purani medh kaat kar do feet kabza kar liya hai. Lekhpal se naap karwana chahte hain.",
  "district": "Varanasi",
  "state": "Uttar Pradesh",
  "dialect": "bhojpuri",
  "village": "Mauza Shivpur"
}
```

**Response `200 OK`**:
```json
{
  "case_id": "CASE-2026-VNS-001",
  "statutory_matches": [
    {
      "act_title": "Uttar Pradesh Revenue Code, 2006",
      "section_number": "Section 24",
      "section_title": "Settlement of Boundary Disputes and Demarcation of Holdings",
      "similarity_score": 0.92,
      "plain_summary": "Provides for boundary ridge identification and revenue demarcation by Lekhpal/Revenue Inspector."
    }
  ],
  "precedent_match": {
    "precedent_id": "PREC-VNS-2024-001",
    "village": "Mauza Shivpur",
    "dispute_type": "Agricultural Ridge Encroachment",
    "resolution_summary": "Both parties agreed to restore boundary ridge under Section 24 of UP Revenue Code 2006."
  },
  "settlement_draft": {
    "clauses": [
      "Clause 1: Joint boundary survey conducted by Revenue Inspector (Lekhpal) as per Shajra map within 14 days.",
      "Clause 2: Restoration of boundary ridge (medh) along confirmed cadastral coordinates.",
      "Clause 3: Costs of stone boundary markers (seema chinha) shared equally between both landholders."
    ],
    "applicable_section": "Uttar Pradesh Revenue Code, 2006 (Section 24)",
    "confidence_score": 0.88,
    "escalation_recommended": false,
    "vernacular_audio_text": "Lekhpal aur Panchayat ke roobroo dono pakh mil kar medh ke naap karwaihein..."
  },
  "coercion_details": {
    "coercion_detected": false,
    "coercion_type": null,
    "action_required": "STANDARD_CIVIL_MEDIATION"
  }
}
```

---

### 1.4 `POST /speak`
Synthesizes speech via Amazon Polly or resilient offline PCM audio.

**Request**:
```json
{
  "text": "Aapka samjhauta tayyar hai. Kripya sunein.",
  "language_code": "hi-IN",
  "voice_id": "Kajal"
}
```

**Response `200 OK`**:
- `Content-Type: audio/wav` (Binary stream of speech audio)

---

### 1.5 `POST /analyze-record`
Extracts cadastral land record metadata from Khatauni / Khasra text or OCR.

**Request**:
```json
{
  "record_text_or_ocr": "Khatauni Khasra No 412/1, 412/2, Rakba 0.4520 Hectare, Village Shivpur, Tehsil Sadar"
}
```

**Response `200 OK`**:
```json
{
  "khasra_numbers": ["412/1", "412/2"],
  "khatauni_number": "142",
  "recorded_area": "0.4520 Hectare",
  "demarcation_ready": true,
  "inspection_authority": "Revenue Inspector / Lekhpal"
}
```

---

### 1.6 `POST /generate-petition`
Generates a formal bilingual pre-litigation petition for Lok Adalat under Section 20 of Legal Services Authorities Act, 1987.

**Request**:
```json
{
  "case_id": "CASE-2026-VNS-001",
  "title": "Field Ridge Boundary Dispute",
  "district": "Varanasi",
  "state": "Uttar Pradesh",
  "petitioner": {"name": "Ram Lakhan Yadav"},
  "respondent": {"name": "Harish Chandra Singh"},
  "settlement_draft": "Mutual ridge restoration under Lekhpal supervision."
}
```

**Response `200 OK`**:
```json
{
  "petition_number": "PL-CC-VNS-001",
  "court": "Taluk Legal Services Committee / Lok Adalat, Varanasi",
  "petitioner": "Ram Lakhan Yadav",
  "respondent": "Harish Chandra Singh",
  "statutory_forum": "Section 19 & 20 of the Legal Services Authorities Act, 1987 read with Section 89 CPC",
  "formal_petition_text": "================================================================\nBEFORE THE TALUK LEGAL SERVICES COMMITTEE / PRE-LITIGATION LOK ADALAT...",
  "status": "READY_FOR_LOK_ADALAT_FILING"
}
```

---

## 2. Node.js Express Backend Endpoints (Port 3000)

Base URL: `http://localhost:3000`

### 2.1 `POST /cases`
Intakes a new rural grievance, invokes AI statutory analysis, stores in DynamoDB, and dispatches SMS/IVR OTP.

**Request**:
```json
{
  "title": "Field Boundary Encroachment",
  "description": "Neighbor cut two feet of the ridge in wheat plot.",
  "district": "Varanasi",
  "state": "Uttar Pradesh",
  "petitionerPhone": "+919876543210",
  "petitionerName": "Ram Lakhan Yadav",
  "dialect": "bhojpuri"
}
```

**Response `201 Created`**:
```json
{
  "message": "Case registered and settlement proposal formulated successfully",
  "caseId": "8ac28b4c-5f98-46e0-bfd0-cccd9016fded",
  "status": "SETTLEMENT_PROPOSED",
  "aiConfidence": 0.86,
  "settlement": {
    "clauses": ["..."],
    "applicableLaw": "Uttar Pradesh Revenue Code, 2006 (Section 24)"
  }
}
```

---

### 2.2 `GET /cases/:id`
Retrieves the single-table aggregate for a case including all parties, current status, and proposed accord.

**Response `200 OK`**:
```json
{
  "caseId": "8ac28b4c-5f98-46e0-bfd0-cccd9016fded",
  "title": "Field Boundary Encroachment",
  "status": "SETTLEMENT_PROPOSED",
  "parties": [
    {
      "phone": "+919876543210",
      "role": "PETITIONER",
      "name": "Ram Lakhan Yadav",
      "consentStatus": "PENDING"
    }
  ]
}
```

---

### 2.3 `POST /cases/:id/consent`
Submits 6-digit OTP consent for a disputant party.

**Request**:
```json
{
  "phone": "+919876543210",
  "otp": "570203",
  "consentStatus": "ACCEPTED"
}
```

**Response `200 OK`**:
```json
{
  "message": "Consent recorded successfully",
  "caseId": "8ac28b4c-5f98-46e0-bfd0-cccd9016fded",
  "allPartiesConsented": false
}
```

---

### 2.4 `GET /mediator/cases?district=Varanasi`
Queries the Mediator Queue for disputes requiring human intervention or escalated by the coercion safety gate.

**Response `200 OK`**:
```json
{
  "district": "Varanasi",
  "count": 1,
  "cases": [
    {
      "caseId": "8ac28b4c-5f98-46e0-bfd0-cccd9016fded",
      "title": "Field Boundary Encroachment",
      "status": "MEDIATOR_REVIEW_REQUIRED"
    }
  ]
}
```

---

### 2.5 `GET /cases/:id/audit`
Returns the immutable SHA-256 event log for the case lifecycle.

**Response `200 OK`**:
```json
{
  "caseId": "8ac28b4c-5f98-46e0-bfd0-cccd9016fded",
  "events": [
    {"eventType": "CASE_CREATED", "timestamp": "2026-09-20T10:50:53.182Z", "actor": "anonymous"},
    {"eventType": "PARTY_JOINED", "timestamp": "2026-09-20T10:50:53.183Z", "actor": "+919876543210"},
    {"eventType": "AI_ANALYSIS_COMPLETED", "timestamp": "2026-09-20T10:50:53.183Z", "actor": "BEDROCK_AGENT"}
  ]
}
```
