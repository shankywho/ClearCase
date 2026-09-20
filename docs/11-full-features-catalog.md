# ClearCase: Full Features Catalog & Capabilities Matrix

This catalog details all functional modules, AI capabilities, statutory reasoning engines, and safety gates implemented in ClearCase.

---

## 1. Feature Breakdown Matrix

| # | Feature Name | Core Component | Model / Engine | Purpose & Rural Impact |
|---|--------------|----------------|----------------|------------------------|
| **1** | **Voice-Native Dialect Transcription** | `TranscriptionAgent` | AWS Transcribe / Whisper / Normalizer | Transcribes raw spoken rural audio into clean standardized Hindi/English with colloquial preservation. |
| **2** | **Statutory RAG Semantic Search** | `StatutoryMatchingAgent` | Amazon Titan / `all-MiniLM-L6-v2` / ChromaDB | Embeds state and central legal acts to retrieve exact legal sections (e.g., UP Revenue Code §24, Minimum Wages Act §20). |
| **3** | **Neutral Mediation Accord Formulator** | `MediationDraftAgent` | AWS Claude 3.5 Sonnet / Groq LLaMA 3.3 70B / Rule Engine | Generates balanced, non-binding 3-point compromise accords grounded in retrieved statutes. |
| **4** | **Gram Panchayat Precedent Memory RAG** | `PrecedentMemoryAgent` | Vector / Semantic Matcher | Recalls past amicable resolutions from neighboring village Panchayats to align proposed accords with local custom. |
| **5** | **Multimodal Land Record & Shajra OCR** | `LandRecordAgent` | Multimodal Parser / Regex / NER | Extracts plot numbers (Khasra), tenancy account (Khatauni), and acreage (Bigha/Hectare) from land document scans. |
| **6** | **Coercion, Usury & Power Safety Gate** | `CoercionDetector` | Rule Classifier & Safety Gate | Intercepts predatory loans (>36% interest), identity document retention (Aadhaar/Passbook), and caste boycotts. |
| **7** | **Vernacular Dialect Re-Synthesizer** | `DialectTranslator` | Vernacular Lexicon & Dialect Grammar | Re-translates dense legal terms into authentic Bhojpuri, Awadhi, Maithili, Malvi, and Haryanvi phrases for audio playback. |
| **8** | **Section 20 Lok Adalat Petition Generator** | `PetitionGenerator` | Court Formatter | One-click creation of formal bilingual petitions ready for filing before the Taluk Legal Services Committee (TLSC). |
| **9** | **Groq Open-Source Dual Fallback** | `GroqLLMClient` | Groq API (`gpt-oss-120b`, `qwen-2.5-32b`) | High-speed, cost-effective open-source LLM backup when AWS Bedrock is throttled or offline. |
| **10** | **Resilient Dual-Layer TTS Audio Engine** | `TTSEngine` | Amazon Polly (`Kajal`/`Aditi`) + PCM Tone Chime | Streams native neural Devanagari audio back to the citizen, with offline PCM WAV fallback if cloud credentials are absent. |
| **11** | **Resilient Express-to-Python Bridge** | `src/services/aiService.ts` | Node.js Axios + Retry + Native Fallback | Zero-downtime microservice architecture; automatically fails over to native mediator if Python port 8000 is stopped. |
| **12** | **Immutable Cryptographic Audit Trail** | DynamoDB Single-Table + Event Store | SHA-256 Hash Chaining | Generates tamper-proof audit records for case creation, party joining, OTP consent, and accord signing. |

---

## 2. In-Depth Feature Descriptions

### Feature 1: Panchayat Precedent Memory (Gram Sabha RAG)
- **Problem**: Rural villagers often reject rigid legal decrees if they violate centuries-old local village conventions (*reeti-riwaaj*).
- **ClearCase Solution**: A dedicated memory agent searches historical Gram Panchayat resolutions in the same district. For example, in a field ridge dispute in Varanasi, it surfaces an accord where both neighbors jointly re-aligned boundary markers and shared stone costs, giving disputants high confidence and community buy-in.

### Feature 2: Multimodal Land Record & Shajra Map OCR
- **Problem**: Disputes over agricultural land require verifying Khatauni extracts and Shajra (cadastral village field maps).
- **ClearCase Solution**: Disputants photograph their revenue record. The `LandRecordAgent` extracts Khasra numbers (e.g., `402/1`, `402/2`), registered area, and village coordinates, automatically identifying whether the land is ready for demarcation by the Revenue Inspector (Lekhpal).

### Feature 3: Coercion & Predatory Usury Safety Gate
- **Problem**: Powerful landlords or moneylenders may attempt to abuse mediation to lock smallholders into illegal debt traps or bonded labor.
- **ClearCase Solution**: Before any compromise accord is drafted, the `CoercionDetector` analyzes the citizen's grievance. If it detects:
  - Usurious interest rates (>36% compounding)
  - Retention of Aadhaar, ration card, or bank passbook
  - Communal boycott (*hukka pani band*)
- It halts automated mediation, tags the case as `MANDATORY_HUMAN_ESCALATION`, and routes it directly to the District Legal Services Authority (DLSA) panel advocate.

### Feature 4: Vernacular Dialect Re-Synthesizer
- **Problem**: Even simple Hindi legal words (*seemaankan*, *praavidhaan*, *nirdhaarit*) can intimidate rural citizens.
- **ClearCase Solution**: The `DialectTranslator` converts the output accord into natural spoken idioms:
  - **Bhojpuri**: *"Panchayat aur Lekhpal ke samne medh ki napai hoi..."*
  - **Awadhi**: *"Lekhpal ke aage medh ke napai hoyi..."*
  - **Haryanvi**: *"Lekhpal ke aage khet ki daul ka naap hoyega..."*

### Feature 5: One-Click Section 20 Lok Adalat Petition Generator
- **Problem**: Non-binding accords can fall apart if one party changes their mind later.
- **ClearCase Solution**: With one click, the system compiles the disputant details, statutory section, and agreed terms into a formal pre-litigation petition under Section 20 of the Legal Services Authorities Act, 1987. When signed and submitted to the Taluk Lok Adalat, it receives an enforceable court decree status under Section 21.
