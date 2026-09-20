#!/usr/bin/env python3
"""
ClearCase AI Core Automated Test Suite
======================================
Validates all AI/ML components:
  1. Statutory ingestion & vector store retrieval
  2. TranscriptionAgent (Bhojpuri/Awadhi/Haryanvi -> English)
  3. StatutoryMatchingAgent (top-3 matches & citations)
  4. MediationDraftAgent (strict JSON schema & < 0.60 escalation gate)
  5. TTS engine (valid playable audio bytes)
  6. FastAPI endpoints (/health, /transcribe, /analyze, /speak)
"""

import os
import sys
import json
import unittest

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from fastapi.testclient import TestClient

from ingest import (
    chunk_markdown_legal_file,
    LocalJsonVectorStore,
    get_vector_store,
    get_embedding_client
)
from agents import (
    TranscriptionAgent,
    StatutoryMatchingAgent,
    MediationDraftAgent,
    orchestrate_dispute
)
from tts import synthesize
from api import app

client = TestClient(app)


class TestClearCaseAICore(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Force offline/resilient mode for deterministic testing
        os.environ["MOCK_AI"] = "true"
        cls.local_store = LocalJsonVectorStore()

    # --------------------------------------------------------------------------
    # 1. Statutory Ingestion & Vector Retrieval Tests
    # --------------------------------------------------------------------------
    def test_01_statutory_chunks_exist(self):
        """Verify that statutory acts are indexed and retrievable."""
        count = self.local_store.count()
        self.assertGreaterEqual(count, 5, f"Expected at least 5 legal chunks, found {count}")
        print(f"[TEST 1 PASS] Vector store contains {count} statutory chunks.")

    def test_02_semantic_retrieval(self):
        """Verify that semantic query retrieves relevant statutory sections."""
        emb_client = get_embedding_client()
        query_emb = emb_client.get_embedding("neighbor cut boundary ridge medh in farm")
        matches = self.local_store.search(query_emb, top_k=3)
        self.assertGreaterEqual(len(matches), 1)

        top_chunk, score = matches[0]
        self.assertIn("Revenue", top_chunk.act_name)
        self.assertGreater(score, 0.5)
        print(f"[TEST 2 PASS] Boundary query correctly matched: {top_chunk.act_name} ({top_chunk.section}) with score {score:.2f}")

    # --------------------------------------------------------------------------
    # 2. Transcription Agent Tests
    # --------------------------------------------------------------------------
    def test_03_transcription_bhojpuri_boundary(self):
        agent = TranscriptionAgent()
        vernacular = "Padosi khet ki purani medh kaat kar do feet humre khet ki or bada liya hai gehu buaai ke samay."
        result = agent.transcribe(vernacular, dialect_hint="bhojpuri")

        self.assertIn("boundary", result.english_text.lower())
        self.assertIn("ridge", result.english_text.lower())
        self.assertEqual(result.detected_dialect, "bhojpuri")
        self.assertGreaterEqual(result.confidence, 0.90)
        print(f"[TEST 3 PASS] Bhojpuri transcription normalized to: '{result.english_text}'")

    def test_04_transcription_awadhi_wages(self):
        agent = TranscriptionAgent()
        vernacular = "Hum thekedar ke khet me pandrah din lagatar dhaan katai ka kaam kiye rahe, baaki majdoori abhi tak naahi mila."
        result = agent.transcribe(vernacular, dialect_hint="awadhi")

        self.assertIn("wage", result.english_text.lower())
        self.assertGreaterEqual(result.confidence, 0.90)
        print(f"[TEST 4 PASS] Awadhi wage transcription normalized to: '{result.english_text}'")

    # --------------------------------------------------------------------------
    # 3. Statutory Matching Agent Tests
    # --------------------------------------------------------------------------
    def test_05_statutory_matching_agent(self):
        agent = StatutoryMatchingAgent()
        clean_text = "The contractor has withheld balance harvest labor wages of ₹3,600."
        matches = agent.match(clean_text, top_k=3)

        self.assertGreaterEqual(len(matches), 1)
        self.assertIn("Wages", matches[0]["act"])
        all_sections = " ".join(m["section"] for m in matches)
        self.assertTrue(any(s in all_sections for s in ["Section 12", "Section 20"]))
        self.assertIn("similarity_score", matches[0])
        print(f"[TEST 5 PASS] Statutory matching returned: {matches[0]['act']} -> {matches[0]['section']}")

    # --------------------------------------------------------------------------
    # 4. Mediation Draft Agent & Safety Escalation Gate Tests
    # --------------------------------------------------------------------------
    def test_06_high_confidence_boundary_draft(self):
        agent = MediationDraftAgent()
        statutes = [{
            "act": "Uttar Pradesh Revenue Code, 2006",
            "section": "Section 24: Demarcation",
            "text_snippet": "Demarcation of agricultural boundaries based on Shajra map."
        }]
        result = agent.draft_settlement(
            transcript="Boundary ridge encroachment of 2 feet during wheat sowing.",
            statutes=statutes,
            dialect="bhojpuri"
        )

        self.assertIn("grievance_summary", result)
        self.assertIn("applicable_sections", result)
        self.assertIn("settlement_draft", result)
        self.assertGreaterEqual(result["confidence_score"], 0.70)
        self.assertFalse(result["escalate_to_human"])
        self.assertIsNone(result["escalation_reason"])
        print(f"[TEST 6 PASS] High confidence boundary settlement formulated (Score: {result['confidence_score']}).")

    def test_07_contested_title_escalation(self):
        """Verify that disputed hereditary title triggers mandatory human escalation."""
        agent = MediationDraftAgent()
        result = agent.draft_settlement(
            transcript="Cousin forged ancestral will and disputes unregistered family partition deed.",
            statutes=[],
            dialect="bhojpuri"
        )

        self.assertTrue(result["escalate_to_human"])
        self.assertLess(result["confidence_score"], 0.60)
        self.assertIsNotNone(result["escalation_reason"])
        print(f"[TEST 7 PASS] Title dispute properly escalated to human mediator: '{result['escalation_reason'][:60]}...'")

    def test_08_criminal_violence_escalation(self):
        """Verify that violent physical altercation is strictly barred and escalated."""
        agent = MediationDraftAgent()
        result = agent.draft_settlement(
            transcript="Attacked with lathi and sticks causing skull fracture over tubewell water.",
            statutes=[],
            dialect="haryanvi"
        )

        self.assertTrue(result["escalate_to_human"])
        self.assertLess(result["confidence_score"], 0.50)
        self.assertIn("criminal", result["escalation_reason"].lower())
        print(f"[TEST 8 PASS] Criminal violence properly escalated to police/mediator.")

    # --------------------------------------------------------------------------
    # 5. Speech Synthesis (TTS) Tests
    # --------------------------------------------------------------------------
    def test_09_tts_synthesis(self):
        text = "1. Dono paksh lekhpal dwara seema nirdharan par sahmat hain."
        audio_bytes = synthesize(text, lang_code="hi-IN")

        self.assertIsInstance(audio_bytes, bytes)
        self.assertGreater(len(audio_bytes), 500)
        print(f"[TEST 9 PASS] TTS synthesis returned {len(audio_bytes)} valid audio bytes.")

    # --------------------------------------------------------------------------
    # 6. FastAPI REST Endpoints Tests
    # --------------------------------------------------------------------------
    def test_10_api_health(self):
        res = client.get("/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "UP")
        print(f"[TEST 10 PASS] GET /health returned status: {data['status']}")

    def test_11_api_transcribe(self):
        res = client.post(
            "/transcribe",
            json={"audio_or_text": "Padosi khet ki purani medh kaat kar do feet bada liya.", "dialect": "bhojpuri"}
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("english_text", data)
        self.assertEqual(data["detected_dialect"], "bhojpuri")
        print(f"[TEST 11 PASS] POST /transcribe returned: '{data['english_text']}'")

    def test_12_api_analyze(self):
        res = client.post(
            "/analyze",
            json={
                "grievance_text": "The contractor has not paid balance harvesting wages of 3600 rupees.",
                "dialect": "awadhi",
                "state": "Uttar Pradesh",
                "district": "Ayodhya"
            }
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("grievance_summary", data)
        self.assertIn("settlement_draft", data)
        self.assertIn("applicable_sections", data)
        self.assertGreaterEqual(data["confidence_score"], 0.70)
        self.assertFalse(data["escalate_to_human"])
        print(f"[TEST 12 PASS] POST /analyze drafted settlement successfully (Confidence: {data['confidence_score']}).")

    def test_13_api_speak(self):
        res = client.post(
            "/speak",
            json={"text": "Namaste, yeh samjhauta patr hai.", "lang": "hi-IN"}
        )
        self.assertEqual(res.status_code, 200)
        self.assertIn("audio", res.headers.get("content-type", ""))
        self.assertGreater(len(res.content), 500)
        print(f"[TEST 13 PASS] POST /speak returned audio stream ({len(res.content)} bytes).")


if __name__ == "__main__":
    unittest.main(verbosity=2)
