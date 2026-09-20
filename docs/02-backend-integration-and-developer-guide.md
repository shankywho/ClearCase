# ClearCase: Backend Integration & Developer Guide

This document details how the **TypeScript/Node.js API Gateway Backend** and the **Python AI Microservice** communicate, how environment variables are wired, and how data flows end-to-end.

---

## 1. Hybrid Architecture Overview

ClearCase uses an optimized dual-engine architecture:
- **Core Backend (Node.js/TypeScript & AWS SAM)**: Handles single-table DynamoDB transactions, Cedar authorization, cryptographic hashing, Polygon Amoy blockchain broadcasting, and dual-party OTP state machines.
- **AI Core (Python FastAPI & PyTorch/Chroma/Bedrock)**: Handles audio transcription, dense semantic vector search across state laws, village precedent RAG, Claude 3.5 Sonnet / Groq Llama 3.3 mediation drafting, and vernacular speech synthesis.

```
+--------------------------+
|  Client (Next.js PWA)    |
+------------+-------------+
             |
             v
+------------------------------------+          +------------------------------------+
|  TypeScript Backend (Port 3000)    |          |  Python AI Service (Port 8000)     |
|  - AWS Lambda Router (`src/app.ts`) | -------> |  - FastAPI Gateway (`api.py`)      |
|  - Cedar AuthZ Engine              |  HTTP    |  - Multi-Agent Pipeline (`agents.py`)|
|  - DynamoDB Single Table           | /analyze |  - Statutory RAG & Precedents      |
|  - Blockchain Anchor (Polygon)     |          |  - Polly / Offline TTS (`tts.py`)  |
+------------------------------------+          +------------------------------------+
```

---

## 2. Zero-Breakage Bridge in `src/services/aiService.ts`

The integration bridge is implemented in `orchestrateDisputeAnalysis()`:

```typescript
// Checks if Python AI microservice is active
const pythonAiUrl = process.env.AI_SERVICE_URL || (process.env.USE_PYTHON_AI === 'true' ? 'http://127.0.0.1:8000' : null);

if (pythonAiUrl) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const resp = await fetch(`${pythonAiUrl}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grievance_text: params.transcript || 'Dispute text',
        dialect: params.dialect || 'bhojpuri',
        state: params.state,
        district: params.district,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (resp.ok) {
      const data = await resp.json();
      // Returns seamlessly mapped data to DynamoDB
    }
  } catch (err) {
    // Automatic fallback to native TypeScript Bedrock / Mock engine
  }
}
```

### Key Operational Guarantees:
1. **Fallback Resilience**: If the Python service is offline, down for maintenance, or network fails, the TypeScript backend never crashes—it immediately executes the native Bedrock/mock pipeline.
2. **Dual-Key Compatibility**: The Python service returns both snake_case (`grievance_summary`, `applicable_sections`) and camelCase (`grievanceSummary`, `applicableSection`) fields, ensuring zero transformation overhead.

---

## 3. Running Both Services Together

### Terminal 1: Start Python AI Microservice
```bash
# In project root:
uvicorn api:app --reload --port 8000
```

### Terminal 2: Start TypeScript Backend
```bash
# Enable the Python AI bridge:
export USE_PYTHON_AI="true"
npm test
npm run test:ai
```

Or run the SAM local API:
```bash
sam local start-api --port 3000
```
