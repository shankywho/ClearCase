# ClearCase: Frontend Single-Shot Master Prompt

> **Instructions for the User:**  
> Copy and paste the entire prompt below into any AI coding assistant (such as Antigravity, Claude 3.5 Sonnet, Cursor, or ChatGPT) to generate the complete, production-ready frontend for **ClearCase** in a single shot.

---

```markdown
# MISSION PROMPT: BUILD "CLEARCASE | न्याय सेतु" FRONTEND (SINGLE-SHOT COMPLETE WEB APP)

You are an expert Principal Frontend Architect and UI/UX Designer.
Your mission is to build the complete, production-ready frontend web application for:
"ClearCase (न्याय सेतु)" — an offline-first, voice-native, statutory RAG-based AI dispute resolution mesh designed for rural Indian citizens and Gram Panchayats.

The app interfaces directly with:
1. Python AI Microservice on `http://localhost:8000` (Endpoints: `/health`, `/transcribe`, `/analyze`, `/speak`, `/analyze-record`, `/generate-petition`)
2. Node.js TypeScript Backend on `http://localhost:3000` (Endpoints: `POST /cases`, `GET /cases/:id`, `POST /cases/:id/consent`, `GET /mediator/cases`)

---

## 1. DESIGN SPECIFICATION & VISUAL TOKENS

- **Target Audience**: Rural citizens with low digital and English literacy, Panchayat Pradhans, and Nyaya Sahayaks (paralegals).
- **Aesthetic**: Modern, dignified, high-contrast, institutional yet warm Indian palette.
- **Color Palette**:
  - Primary Slate/Navy: `#0F172A` (Tailwind `slate-900`)
  - Warm Indian Amber/Saffron: `#D97706` (Tailwind `amber-600`)
  - Settlement Emerald: `#059669` (Tailwind `emerald-600`)
  - Safety Alert Red: `#DC2626` (Tailwind `red-600`)
  - Surface Background: `#F8FAFC` (Tailwind `slate-50`)
  - Clean White Card: `#FFFFFF` with shadow `shadow-lg border border-slate-200`
- **Typography**: `Inter`, `Outfit`, or `Noto Sans Devanagari` (loaded via Google Fonts).
- **Low-Literacy Requirement**: EVERY key legal card and settlement clause MUST feature a prominent "Suno / सुनिए" (Listen) audio button that plays back speech from `/speak`.

---

## 2. CORE FEATURES & SCREENS TO BUILD

The application should be a responsive Single Page Application (React/Next.js or Vanilla HTML5/CSS3/JavaScript) with a clean tabbed/step navigation:

### Screen 1: Top Navigation & Status Bar
- Brand: **"ClearCase | न्याय सेतु"** with an emblem/scales of justice icon.
- Network status badge: "Mesh Mode: Active (Local Offline-Ready)" with pulsating green LED indicator.
- Dialect Selector: Dropdown with options:
  - भोजपुरी (Bhojpuri)
  - अवधी (Awadhi)
  - मैथिली (Maithili)
  - मालवी (Malvi)
  - हिन्दी (Standard Hindi)
  - English
- Quick Action: "New Dispute" button and "Mediator Dashboard" toggle.

### Screen 2: Voice Grievance Recorder (Hero Component)
- Large central 90px circular recording button with microphone icon.
- Dynamic audio waveform animation when recording is active.
- Timer display ("0:00" -> "0:14").
- Audio player widget to preview recorded grievance.
- One-click trigger: "विश्लेषण करें / Analyze Dispute" button calling `POST http://localhost:8000/analyze`.
- Pre-loaded Quick Scenario buttons for instant demo:
  - 🌾 *Boundary Encroachment (मेढ़ कटाई विवाद)*
  - 💰 *Unpaid Agricultural Wages (मजदूरी विवाद)*
  - 🏠 *Rural Tenancy Eviction (दुकान किराया विवाद)*
  - 🚨 *Predatory Moneylender (साहूकार ब्याज विवाद - Coercion Trigger)*

### Screen 3: Multimodal Land Record / Shajra Map OCR
- File dropzone or camera snapshot button: "भू-अभिलेख / खतौनी या सजरा नक्शा अपलोड करें".
- Sample OCR extract preview displaying:
  - Khasra Plot Numbers: `[412/1, 412/2]`
  - Khatauni Account No: `142`
  - Registered Area: `0.4520 Hectare`
  - Revenue Verification Badge: `Ready for Lekhpal Demarcation`

### Screen 4: Multi-Agent AI Statutory & Settlement Dashboard
When the analysis returns, render a 4-quadrant responsive grid:
1. **Statutory Law Card**:
   - Act Name: e.g., "Uttar Pradesh Revenue Code, 2006".
   - Section Citation: "Section 24: Demarcation & Boundary Settlement".
   - Plain summary with a large "सुनिए (Listen)" button.
2. **Panchayat Precedent Memory Card**:
   - Village Match: "Mauza Shivpur Gram Sabha (91% Match)".
   - Historical Resolution: "Both neighbors jointly realigned boundary markers under Lekhpal supervision with shared costs."
3. **Coercion & Exploitation Alert (Safety Gate)**:
   - *If `coercion_detected == true`*:
   - High-visibility red warning banner: "शोषण चेतावनी (Exploitation Alert): Predatory usury (>36%) or identity document withholding detected. Automated civil accord suspended. Case escalated to District Legal Services Authority (DLSA)."
4. **Proposed Neutral Settlement Accord**:
   - 3 clear, practical compromise clauses.
   - Disputant 1 & Disputant 2 obligations.
   - Assigned neutral witness (Gram Pradhan / Revenue Inspector).
   - "Vernacular Voice Audio" playback button.

### Screen 5: Digital Consent & Section 20 Lok Adalat Petition Modal
- Two-party OTP Consent verification boxes:
  - Disputant 1 (Petitioner): `[ 5 7 0 2 0 3 ]` -> Verified ✓
  - Disputant 2 (Respondent): `[ 1 2 3 4 5 6 ]` -> Verified ✓
- SHA-256 Immutable Audit Hash badge: `0x9a8f...3c4e` (Polygon / Hyperledger anchored).
- Button: **"धारा 20 लोक अदालत औपचारिक आवेदन तैयार करें (Generate Lok Adalat Petition)"**:
  - Opens a court-formatted bilingual legal petition packet.
  - Formatted under Section 19 & 20 of Legal Services Authorities Act, 1987.
  - Buttons: "Print Petition (प्रिंट करें)" and "Download Legal PDF (डाउनलोड करें)".

---

## 3. TECHNICAL ARCHITECTURE & RESILIENT FALLBACKS

1. **Dual Network Modes**:
   - If `http://localhost:8000` is reachable, use the live FastAPI endpoints.
   - If backend is offline or in pure client demo mode, provide realistic local mock responses for all 4 demo scenarios seamlessly without errors.
2. **Audio Handling**:
   - Call `POST http://localhost:8000/speak` with `{text, language_code, voice_id}`.
   - Play the returned `audio/wav` blob using the HTML5 `Audio()` API.
   - If offline, play the fallback audio tone or use browser `window.speechSynthesis`.
3. **Responsive Layout**:
   - Fully optimized for mobile screens (360px width) up to 4K desktop screens.
   - Clean, modular CSS/Tailwind code with zero external breaking dependencies.

Build the complete, beautiful, working application now!
```
