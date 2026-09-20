# ClearCase ⚖️

> **Offline-First, Voice-Native AI Dispute Resolution Mesh for Bharat**  
> *Built for Hackathon: Bharat Builds by WeMakeDevs | Track: AWS First Commit*

ClearCase bridges the justice gap for rural and semi-urban citizens across Bharat by providing vernacular dialect voice intake (Bhojpuri, Hindi, Maithili), statutory RAG grounding against state land/revenue and tenancy acts, neutral compromise formulation, dual-party cryptographic OTP digital consent, and immutable settlement anchoring on the Polygon Amoy blockchain.

---

## 📁 Repository Structure

```
ClearCase/
├── backend/                  # Multi-agent AI engine, AWS Lambda mesh, DynamoDB, Cedar AuthZ & Polygon Amoy
│   ├── agents.py             # Python statutory RAG & compromise drafting agents
│   ├── api.py                # FastAPI microservices for voice, cadastre OCR & translation
│   ├── contracts/            # ClearCaseRegistry.sol Solidity smart contract
│   ├── docs/                 # Complete architectural, security & API specification suite
│   ├── policies/             # AWS Cedar fine-grained authorization policies
│   ├── scripts/              # Automated test suites & end-to-end integration tests
│   ├── src/                  # TypeScript Lambda services, repositories & blockchain anchoring
│   └── whisper_stt.py        # Local Whisper speech-to-text intake engine
│
└── frontend/                 # React 18 + Vite + TypeScript high-fidelity web application
    ├── public/               # Static assets, fonts, case study visual boards
    ├── src/
    │   ├── animations/       # Framer Motion sequence variants & transitions
    │   ├── components/       # Editorial navigation, terminal demo, audio players, preloader
    │   ├── routes/           # Interactive pages: /resolve, /land-records, /mediator, /verify, /work/*
    │   └── lib/              # API clients, Lenis smooth scrolling, GSAP ScrollTriggers
    └── vercel.json           # Vercel deployment configuration with SPA URL rewrites
```

---

## 🚀 Live Demo & Deployment

- **Frontend Deployment (Vercel):** [https://clearcase-studio.vercel.app](https://clearcase-studio.vercel.app)
- **Local AI Backend:** `http://127.0.0.1:8001`
- **Local Lambda Router:** `http://localhost:3000`

---

## 🛠️ Quickstart

### 1. Frontend Setup
```bash
cd frontend
bun install     # or npm install
bun run dev     # runs on http://localhost:5173
```

### 2. Backend Setup
```bash
cd backend
npm install
docker compose up -d    # starts DynamoDB Local on port 8000
npm run db:init         # initializes Single-Table schema & GSIs
npm run test:all        # runs automated test suites
```

---

## ⚖️ License
Apache-2.0. Built for Bharat.
