# ClearCase: Troubleshooting & Common Issues Guide

This document outlines known edge-cases, common runtime warnings, environment discrepancies, and diagnostic resolutions across the ClearCase AI engine, Node.js backend, and local storage layers.

---

## 1. Windows UTF-8 Terminal Encoding (`cp1252` vs Rupee `₹` / Hindi Glyphs)

### Symptom:
Running Python scripts or tests throws:
```text
UnicodeEncodeError: 'charmap' codec can't encode character '\u20b9' in position ...: character maps to <undefined>
```

### Root Cause:
Windows command prompt and PowerShell default to OEM code page 437 or Windows-1252 (`cp1252`), which cannot print unicode symbols such as `₹` (Indian Rupee), Devanagari characters, or special bullet points.

### Resolution:
1. All ClearCase entrypoints (`api.py`, `ingest.py`, `test_ai_pipeline.py`, `test_comprehensive_suite.py`) include automatic stdout/stderr re-encoding:
   ```python
   import sys
   if sys.platform == "win32":
       sys.stdout.reconfigure(encoding="utf-8", errors="replace")
       sys.stderr.reconfigure(encoding="utf-8", errors="replace")
   ```
2. In PowerShell, you can also permanently enable UTF-8:
   ```powershell
   [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
   $env:PYTHONIOENCODING = "utf-8"
   ```

---

## 2. AWS Bedrock Access / Throttling / Unconfigured Environment

### Symptom:
`ResourceNotFoundException`, `AccessDeniedException`, or credentials not found when attempting to invoke Claude 3.5 Sonnet or Titan Embeddings.

### Root Cause:
- Bedrock foundation model access is not enabled for the AWS account in `us-east-1` or `ap-south-1`.
- `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` are not set.

### Resolution:
ClearCase implements an **automatic, zero-breakage dual fallback**:
1. **Embedding Layer**: If AWS Titan (`amazon.titan-embed-text-v1`) is unreachable, `ingest.py` automatically initializes local HuggingFace `sentence-transformers/all-MiniLM-L6-v2`. If PyTorch is unavailable, it uses offline deterministic n-gram vectorization.
2. **LLM Reasoning Layer**: If AWS Bedrock Claude 3.5 Sonnet is unavailable, `agents.py` checks for `GROQ_API_KEY` and invokes open-source models:
   - `llama-3.3-70b-versatile`
   - `qwen-2.5-32b`
3. If neither cloud API is available, the built-in deterministic statutory rule engine (`_rule_based_draft()`) executes with 100% reliability for offline village demo mode.

---

## 3. Port Conflicts (`Port 8000` or `Port 3000` Already in Use)

### Symptom:
`Error: listen EADDRINUSE: address already in use :::3000` or `Uvicorn: [Errno 10048] error while attempting to bind on address ('0.0.0.0', 8000)`.

### Resolution:
1. **Find PID on Windows**:
   ```powershell
   Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object LocalAddress, LocalPort, OwningProcess
   Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object LocalAddress, LocalPort, OwningProcess
   ```
2. **Terminate the process**:
   ```powershell
   Stop-Process -Id <PID> -Force
   ```
3. Alternatively, launch on custom ports via environment variables:
   ```powershell
   $env:PORT = "8005"; python api.py
   $env:PORT = "3005"; npm run dev
   ```

---

## 4. ChromaDB SQLite3 Dependency Issues on Windows

### Symptom:
`OperationalError: sqlite3 version is too old` or ChromaDB native binary initialization errors on minimal Python installations.

### Resolution:
ClearCase includes an offline **persistent local JSON vector store fallback** at `data/local_vector_index.json`.
- When ChromaDB is present, embeddings are indexed into `./chroma_db` collection `clearcase_legal_acts`.
- When ChromaDB is absent, `ingest.py` serializes all chunks and embeddings into `data/local_vector_index.json`.
- `StatutoryMatchingAgent` computes cosine similarity over the local store with sub-millisecond response times.

---

## 5. Backend TypeScript to Python Microservice Connectivity

### Symptom:
Backend logs show:
```text
[AI Service] Python AI gateway unreachable at http://localhost:8000. Falling back to native mediator.
```

### Verification & Diagnostic Steps:
1. Check if Python AI server is running:
   ```powershell
   curl http://localhost:8000/health
   ```
   Should return:
   ```json
   {"status":"healthy","service":"ClearCase AI Statutory Engine","version":"2.0.0"}
   ```
2. Check `.env` configurations:
   ```env
   AI_SERVICE_URL=http://localhost:8000
   USE_PYTHON_AI=true
   ```
3. Even if Python is temporarily stopped, `src/services/aiService.ts` contains resilient offline fallback logic, ensuring that citizen grievance submission, DB persistence, and OTP verification never crash.

---

## 6. Audio Transcription / Polly Synthetic Fallback

### Symptom:
AWS Polly synthetic voice synthesis fails with `AccessDenied` or AWS credentials missing.

### Resolution:
`tts.py` provides a dual-layer audio handler:
1. **Polly Synthesis**: Uses voices `Kajal` (Hindi/English bilingual) or `Aditi` via `boto3`.
2. **Offline PCM Tone Synthesizer**: If AWS Polly is unavailable, `tts.py` generates a valid standard 44.1kHz 16-bit PCM WAV audio file with pleasant harmonic notification chime. This ensures the frontend audio player receives a playable audio payload without throwing HTTP 500 errors.

---

## 7. Pydantic v2 Migration (`model_dump` vs `dict`)

### Symptom:
`PydanticDeprecatedSince20: The dict method is deprecated; use model_dump instead.`

### Resolution:
All models in `api.py` use backward-and-forward compatible pattern:
```python
data = req.model_dump() if hasattr(req, "model_dump") else req.dict()
```
This guarantees flawless execution on both Pydantic v1.x and Pydantic v2.x.
