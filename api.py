#!/usr/bin/env python3
"""
ClearCase AI FastAPI Gateway
============================
Exposes REST endpoints for:
  - POST /transcribe        -> Vernacular speech/text to normalized English
  - POST /analyze           -> Multi-agent statutory matching, precedent RAG, & draft
  - POST /speak             -> Vernacular speech synthesis (Polly / resilient audio)
  - POST /analyze-record    -> Multimodal Khasra/Khatauni & Shajra map extraction
  - POST /generate-petition -> Section 20 Lok Adalat formal filing packet generator
  - GET  /health            -> Health check and vector store status
"""

import os
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from agents import (
    TranscriptionAgent,
    StatutoryMatchingAgent,
    MediationDraftAgent,
    LandRecordAgent,
    PetitionGenerator,
    orchestrate_dispute
)
from tts import synthesize
from ingest import LocalJsonVectorStore, get_vector_store

app = FastAPI(
    title="ClearCase AI Mediation Core",
    description="Voice-native, statutory RAG-based legal mediation assistant for rural Bharat",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Agent Singletons
transcription_agent = TranscriptionAgent()
statutory_agent = StatutoryMatchingAgent()
draft_agent = MediationDraftAgent()
land_record_agent = LandRecordAgent()
petition_generator = PetitionGenerator()
vector_store = get_vector_store()
local_store = LocalJsonVectorStore()


# ------------------------------------------------------------------------------
# Request & Response Schemas
# ------------------------------------------------------------------------------

class TranscribeRequest(BaseModel):
    audio_or_text: str = Field(..., description="Raw vernacular speech transcript or audio base64")
    dialect: Optional[str] = Field("bhojpuri", description="Regional dialect")


class TranscribeResponse(BaseModel):
    original_text: str
    english_text: str
    detected_dialect: str
    confidence: float


class ApplicableSection(BaseModel):
    act: str
    section: str
    text_snippet: str


class AnalyzeRequest(BaseModel):
    grievance_text: str = Field(..., description="Grievance text in vernacular or English")
    dialect: Optional[str] = Field("bhojpuri", description="Regional dialect")
    state: Optional[str] = Field("Uttar Pradesh", description="Target jurisdiction state")
    district: Optional[str] = Field("Varanasi", description="Target jurisdiction district")
    village: Optional[str] = Field("", description="Village name for local precedent search")


class AnalyzeResponse(BaseModel):
    grievance_summary: str
    applicable_sections: List[ApplicableSection]
    settlement_draft: str
    confidence_score: float
    escalate_to_human: bool
    escalation_reason: Optional[str] = None
    vernacular_settlement_draft: Optional[str] = None
    precedent_citation: Optional[Dict[str, Any]] = None
    coercion_details: Optional[Dict[str, Any]] = None
    # Compatibility aliases for TypeScript backend
    grievanceSummary: Optional[str] = None
    applicableSection: Optional[str] = None
    suggestedDraft: Optional[str] = None
    confidenceScore: Optional[float] = None
    escalationRecommended: Optional[bool] = None
    escalationReason: Optional[str] = None
    status: Optional[str] = None


class SpeakRequest(BaseModel):
    text: str = Field(..., description="Settlement draft or message to synthesize")
    lang: Optional[str] = Field("hi-IN", description="Regional language or dialect code")


class RecordAnalysisRequest(BaseModel):
    record_text_or_ocr: str = Field(..., description="Text extracted from Khasra/Khatauni or cadastre map trace")


class PetitionRequest(BaseModel):
    case_id: Optional[str] = "CASE-2026-VNS-001"
    title: Optional[str] = "Agricultural Boundary Dispute"
    district: Optional[str] = "Varanasi"
    state: Optional[str] = "Uttar Pradesh"
    petitioner: Optional[Dict[str, str]] = {"name": "Ram Lakhan Yadav"}
    respondent: Optional[Dict[str, str]] = {"name": "Harish Chandra Singh"}
    applicable_section: Optional[str] = "Uttar Pradesh Revenue Code, 2006 (Section 24)"
    settlement_draft: Optional[str] = "Mutual ridge restoration under Lekhpal supervision."


# ------------------------------------------------------------------------------
# Endpoints
# ------------------------------------------------------------------------------

@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "ClearCase AI Core",
        "version": "2.0.0",
        "features": [
            "Statutory RAG (OpenSearch / ChromaDB)",
            "Panchayat Precedent Memory RAG",
            "Multimodal Land Record OCR",
            "Coercion & Usury Safety Gate",
            "Vernacular Dialect Re-Synthesis",
            "Lok Adalat Section 20 Petition Generator"
        ],
        "providers": {
            "bedrock": os.getenv("BEDROCK_MODEL_ID", "anthropic.claude-3-5-sonnet-20240620-v1:0"),
            "groq": "configured" if os.getenv("GROQ_API_KEY") else "unconfigured",
            "mock_fallback": "active" if os.getenv("MOCK_AI", "false").lower() == "true" else "standby"
        },
        "indexed_clauses": local_store.count(),
        "supported_dialects": ["bhojpuri", "haryanvi", "awadhi", "hindi", "maithili", "rajasthani", "english"]
    }


@app.post("/transcribe", response_model=TranscribeResponse)
def transcribe_endpoint(req: TranscribeRequest):
    if not req.audio_or_text.strip():
        raise HTTPException(status_code=400, detail="Field 'audio_or_text' must not be empty.")

    result = transcription_agent.transcribe(req.audio_or_text, req.dialect or "bhojpuri")
    return TranscribeResponse(
        original_text=result.original_text,
        english_text=result.english_text,
        detected_dialect=result.detected_dialect,
        confidence=result.confidence
    )


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_endpoint(req: AnalyzeRequest):
    if not req.grievance_text.strip():
        raise HTTPException(status_code=400, detail="Field 'grievance_text' must not be empty.")

    pipeline_result = orchestrate_dispute(
        input_data=req.grievance_text,
        dialect=req.dialect or "bhojpuri",
        state=req.state or "Uttar Pradesh",
        district=req.district or "Varanasi",
        village=req.village or ""
    )

    draft = pipeline_result["draft"]
    sections = [
        ApplicableSection(
            act=s.get("act", ""),
            section=s.get("section", ""),
            text_snippet=s.get("text_snippet", "")
        )
        for s in draft.get("applicable_sections", [])
    ]

    return AnalyzeResponse(
        grievance_summary=draft.get("grievance_summary", ""),
        applicable_sections=sections,
        settlement_draft=draft.get("settlement_draft", ""),
        confidence_score=draft.get("confidence_score", 0.0),
        escalate_to_human=draft.get("escalate_to_human", False),
        escalation_reason=draft.get("escalation_reason"),
        vernacular_settlement_draft=draft.get("vernacular_settlement_draft"),
        precedent_citation=draft.get("precedent_citation"),
        coercion_details=draft.get("coercion_details"),
        grievanceSummary=draft.get("grievanceSummary"),
        applicableSection=draft.get("applicableSection"),
        suggestedDraft=draft.get("suggestedDraft"),
        confidenceScore=draft.get("confidenceScore"),
        escalationRecommended=draft.get("escalationRecommended"),
        escalationReason=draft.get("escalationReason"),
        status=pipeline_result.get("status")
    )


@app.post("/speak")
def speak_endpoint(req: SpeakRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Field 'text' must not be empty.")

    audio_bytes = synthesize(req.text, req.lang or "hi-IN")
    media_type = "audio/mpeg" if audio_bytes.startswith(b"\xff\xfb") or audio_bytes.startswith(b"ID3") else "audio/wav"

    return Response(
        content=audio_bytes,
        media_type=media_type,
        headers={"Content-Disposition": "inline; filename=settlement_speech.mp3"}
    )


@app.post("/analyze-record")
def analyze_record_endpoint(req: RecordAnalysisRequest):
    """Parses Khasra/Khatauni land records and extracts plot numbers and areas."""
    if not req.record_text_or_ocr.strip():
        raise HTTPException(status_code=400, detail="Field 'record_text_or_ocr' must not be empty.")
    return land_record_agent.parse_record(req.record_text_or_ocr)


@app.post("/generate-petition")
def generate_petition_endpoint(req: PetitionRequest):
    data = req.model_dump() if hasattr(req, "model_dump") else req.dict()
    return petition_generator.generate_petition(data)


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"Starting ClearCase AI Gateway on http://localhost:{port}")
    uvicorn.run("api:app", host="0.0.0.0", port=port, reload=True)
