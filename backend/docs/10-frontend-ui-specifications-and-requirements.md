# ClearCase: Frontend UI Specifications & Requirements

This document provides a comprehensive blueprint for the ClearCase frontend client. It specifies user interface components, accessibility standards for rural and low-literacy citizens, voice interaction workflows, and visual design tokens.

---

## 1. Design Philosophy & User Experience Goals

1. **Voice-First & Low-Literacy Friendly**:
   - Rural disputants often have limited English or formal Hindi reading abilities.
   - Every text-based legal finding must be accompanied by an **Audio Playback ("Suno" / सुनिए)** button.
   - Large touch targets (minimum 48x48dp), high-contrast text, and iconography supporting vernacular comprehension.

2. **Visual Palette & Tokens**:
   - **Primary Navy**: `#0F172A` (Slate 900) - Authority, trust, and institutional dignity.
   - **Accent Gold / Saffron**: `#D97706` (Amber 600) - Warm Indian cultural palette, highlight interactive states.
   - **Success / Mutual Agreement**: `#059669` (Emerald 600) - Resolution, conciliation, and verified status.
   - **Coercion / Escalation Warning**: `#DC2626` (Red 600) - Immediate alert for usury or intimidation.
   - **Neutral Background**: `#F8FAFC` (Slate 50) - Clean, soft, readable surface.
   - **Card Surface**: `#FFFFFF` with soft drop shadow `0 4px 6px -1px rgb(0 0 0 / 0.1)`.
   - **Typography**: `Inter`, `Outfit`, or `Noto Sans Devanagari` for crisp readability on mobile screens.

---

## 2. Core Screen & Component Breakdown

### A. App Header & Status Bar
- **Logo & Title**: "ClearCase | न्याय सेतु (Nyaya Setu)"
- **Network & Offline Badge**: "Mesh Active / Local Index Synchronized" (Green dot indicator).
- **Dialect Switcher**: Dropdown supporting:
  - Bhojpuri (भोजपुरी)
  - Awadhi (अवधी)
  - Maithili (मैथिली)
  - Malvi (मालवी)
  - Hindi (हिन्दी)
  - English

---

### B. Voice Grievance Recording Zone (Hero Component)
- **Interactive Record Button**:
  - 80x80px circular button with microphone icon.
  - Pulsing amber ring when listening.
  - Displays real-time audio waveform.
- **Audio Playback Preview**: Allows disputants to listen back to their recorded statement before submitting.
- **Transcription Display**: Live text preview with language detection indicator and confidence rating.

---

### C. Shajra Map & Land Record Upload Zone (Multimodal)
- **Drag-and-Drop or Camera Capture**:
  - Quick action to photograph Khatauni, Khasra, or Tehsil demarcation map.
- **Instant OCR Extractor Card**:
  - Parsed Khasra Plot No. (e.g., `412/1`)
  - Recorded Area (e.g., `0.4520 Hectare`)
  - Village / Tehsil metadata badge.
  - Demarcation status: `Ready for Revenue Inspection` vs `Pending Verification`.

---

### D. Multi-Agent AI Analysis Results Panel
Once the grievance is analyzed, the screen transitions into a structured 4-pillar dashboard:

1. **Statutory Law Grounding Card**:
   - Central or State Act badge (e.g., `Uttar Pradesh Revenue Code, 2006`).
   - Relevant Section & Sub-clause (e.g., `Section 24: Demarcation and Ridge Disputes`).
   - Plain-language legal explanation in citizen's selected dialect.
   - "Listen to Statutory Explanation" voice button (Amazon Polly / PCM chime).

2. **Gram Panchayat Precedent Memory Card**:
   - Matching historical village case (e.g., `Shivpur Gram Sabha - Case #2024-VNS-014`).
   - Similarity match percentage (e.g., `91% Context Match`).
   - How the village elders resolved it peacefully: *"Joint boundary realignment by Lekhpal with shared masonry costs."*

3. **Coercion & Usury Safety Alert Banner** *(Conditional)*:
   - If predatory usury (>36%), document retention, or caste exclusion is detected:
   - High-visibility amber/red alert box.
   - Text: *"Exploitation Alert: Predatory loan interest rate or document retention detected. Standard civil compromise suspended. Escalated to District Legal Services Authority (DLSA) / Nyaya Panchayat."*

4. **Neutral AI Mediation Accord Draft**:
   - Numbered, practical resolution clauses.
   - Responsibilities for Disputant 1 & Disputant 2.
   - Assigned timeline and neutral village witness (e.g., Gram Pradhan / Lekhpal).
   - Vernacular Audio playback for both disputants.

---

### E. Consent, Verification & Petition Export Modal
- **OTP / Aadhaar Consent Verification**:
  - 6-digit verification code input.
  - Digital consent checkbox confirming voluntary submission.
- **Blockchain Anchoring Badge**:
  - Displays cryptographic SHA-256 accord hash and Polygon/Hyperledger transaction reference.
- **Section 20 Lok Adalat Petition Generator**:
  - Single-click action: "Generate Court-Ready Lok Adalat Petition (धारा 20 लोक अदालत आवेदन)".
  - Displays formatted bilingual legal petition with case number, parties, statutory citations, and signature blocks.
  - Print / Download PDF button.
