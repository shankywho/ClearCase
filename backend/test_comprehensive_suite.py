#!/usr/bin/env python3
"""
ClearCase Comprehensive AI & Integration Test Suite (35 Tests)
=============================================================
Validates all AI core modules, killer features, security hygiene, and FastAPI endpoints:
  1. Statutory Ingestion & Vector Retrieval (Tests 1-2)
  2. Panchayat Precedent Memory RAG (Tests 3-4)
  3. Multimodal Land Record & Shajra OCR (Tests 5-6)
  4. Coercion & Exploitation Safety Gates (Tests 7-10)
  5. Vernacular Dialect Re-Synthesis (Tests 11-13)
  6. Lok Adalat Section 20 Petition Generator (Tests 14-15)
  7. Groq Open-Source LLM Fallback (Tests 16-17)
  8. Transcription Agent Across Dialects (Tests 18-20)
  9. Statutory Matching & Legal Citations (Test 21)
  10. Mediation Draft Agent & Safety Gates (Tests 22-26)
  11. Vernacular Speech Synthesis (TTS) (Tests 27-28)
  12. FastAPI Production Endpoints (Tests 29-34)
  13. Security & Zero-Hardcoded Secrets Audit (Test 35)
"""

import os
import sys
import json
import re
import unittest
from fastapi.testclient import TestClient

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from ingest import LocalJsonVectorStore, get_embedding_client
from agents import (
    TranscriptionAgent,
    StatutoryMatchingAgent,
    MediationDraftAgent,
    PrecedentMemoryAgent,
    LandRecordAgent,
    CoercionDetector,
    DialectTranslator,
    PetitionGenerator,
    GroqLLMClient,
    orchestrate_dispute
)
from tts import synthesize
from api import app

client = TestClient(app)


class TestClearCaseComprehensiveSuite(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        os.environ["MOCK_AI"] = "true"
        cls.local_store = LocalJsonVectorStore()
        cls.precedent_agent = PrecedentMemoryAgent()
        cls.land_record_agent = LandRecordAgent()
        cls.coercion_detector = CoercionDetector()
        cls.dialect_translator = DialectTranslator()
        cls.petition_generator = PetitionGenerator()

    # --------------------------------------------------------------------------
    # 1. Statutory Ingestion & Vector Retrieval (Tests 1-2)
    # --------------------------------------------------------------------------
    def test_01_statutory_chunks_indexed(self):
        count = self.local_store.count()
        self.assertGreaterEqual(count, 5)
        print(f"[TEST 1 PASS] Local vector index contains {count} statutory clauses.")

    def test_02_semantic_search_accuracy(self):
        emb_client = get_embedding_client()
        vec = emb_client.get_embedding("dispute regarding agricultural boundary ridge demarcation")
        matches = self.local_store.search(vec, top_k=2)
        self.assertGreaterEqual(len(matches), 1)
        self.assertIn("Revenue", matches[0][0].act_name)
        print(f"[TEST 2 PASS] Top semantic match correctly identified: {matches[0][0].act_name}")

    # --------------------------------------------------------------------------
    # 2. Panchayat Precedent Memory RAG (Tests 3-4)
    # --------------------------------------------------------------------------
    def test_03_precedent_memory_retrieval(self):
        prec = self.precedent_agent.search_precedent("boundary ridge medh", village="Mauza Shivpur")
        self.assertIsNotNone(prec)
        self.assertEqual(prec.get("dispute_category"), "boundary_ridge")
        self.assertIn("Lekhpal", prec.get("resolution_formula", ""))
        print(f"[TEST 3 PASS] Village precedent retrieved: {prec.get('precedent_id')} for Mauza Shivpur.")

    def test_04_precedent_wage_category(self):
        prec = self.precedent_agent.search_precedent("unpaid harvesting wages", district="Ayodhya")
        self.assertIsNotNone(prec)
        self.assertEqual(prec.get("dispute_category"), "agricultural_wages")
        print(f"[TEST 4 PASS] Wage precedent retrieved: {prec.get('precedent_id')} ({prec.get('resolution_formula')[:50]}...)")

    # --------------------------------------------------------------------------
    # 3. Multimodal Land Record & Shajra OCR (Tests 5-6)
    # --------------------------------------------------------------------------
    def test_05_land_record_plot_extraction(self):
        raw_text = "Khasra No. 402/1 and Gata 402/2 in Mauza Shivpur, Khatauni Account 142."
        res = self.land_record_agent.parse_record(raw_text)
        self.assertIn("402/1", res["khasra_plots"])
        self.assertEqual(res["khatauni_account"], "142")
        print(f"[TEST 5 PASS] Land record OCR parsed plots: {res['khasra_plots']} and Khatauni: {res['khatauni_account']}")

    def test_06_land_record_area_extraction(self):
        raw_text = "Land parcel area recorded as 2.5 Bigha agricultural holding."
        res = self.land_record_agent.parse_record(raw_text)
        self.assertIn("2.5", res["recorded_area"])
        self.assertTrue(res["demarcation_ready"])
        print(f"[TEST 6 PASS] Recorded area successfully extracted: {res['recorded_area']}")

    # --------------------------------------------------------------------------
    # 4. Coercion & Exploitation Safety Gates (Tests 7-10)
    # --------------------------------------------------------------------------
    def test_07_coercion_usury_detected(self):
        text = "Mahajan 5 percent mahina byaj pe byaj jod kar 1 lakh maang raha hai."
        res = self.coercion_detector.check_coercion(text)
        self.assertTrue(res["coercion_detected"])
        self.assertEqual(res["coercion_type"], "PREDATORY_USURY")
        print(f"[TEST 7 PASS] Predatory usury detected: {res['details']}")

    def test_08_coercion_document_retention(self):
        text = "Moneylender has aadhaar card rakh liya aur khatauni girvi rakh kar vapas nahi kar raha."
        res = self.coercion_detector.check_coercion(text)
        self.assertTrue(res["coercion_detected"])
        self.assertEqual(res["coercion_type"], "DOCUMENT_RETENTION_COERCION")
        print(f"[TEST 8 PASS] Document retention coercion detected.")

    def test_09_coercion_caste_boycott(self):
        text = "Gaon ke dabang kunwe se paani lene par rok laga diye hain aur hukka pani band kar diya."
        res = self.coercion_detector.check_coercion(text)
        self.assertTrue(res["coercion_detected"])
        self.assertEqual(res["coercion_type"], "COMMUNITY_COERCION_DISCRIMINATION")
        print(f"[TEST 9 PASS] Communal water access boycott detected.")

    def test_10_coercion_negative_control(self):
        text = "Padosi khet ki purani medh par do feet ka naap ka vivad hai."
        res = self.coercion_detector.check_coercion(text)
        self.assertFalse(res["coercion_detected"])
        self.assertEqual(res["action_required"], "STANDARD_CIVIL_MEDIATION")
        print(f"[TEST 10 PASS] Standard boundary dispute cleared with no false coercion flag.")

    # --------------------------------------------------------------------------
    # 5. Vernacular Dialect Re-Synthesis (Tests 11-13)
    # --------------------------------------------------------------------------
    def test_11_dialect_bhojpuri_resynthesis(self):
        formal = "1. Both parties agree to boundary demarcation by Lekhpal."
        vernacular = self.dialect_translator.resynthesize_for_voice(formal, dialect="bhojpuri")
        self.assertIn("Lekhpal ji", vernacular)
        self.assertIn("medh", vernacular)
        print(f"[TEST 11 PASS] Bhojpuri vernacular re-synthesized for voice-out.")

    def test_12_dialect_awadhi_resynthesis(self):
        formal = "Contractor agrees to disburse remaining wages within 7 days."
        vernacular = self.dialect_translator.resynthesize_for_voice(formal, dialect="awadhi")
        self.assertIn("Thekedar sahab", vernacular)
        self.assertIn("Pradhan ji", vernacular)
        print(f"[TEST 12 PASS] Awadhi vernacular re-synthesized for voice-out.")

    def test_13_dialect_haryanvi_resynthesis(self):
        formal = "Parties agree to land measurement according to government map."
        vernacular = self.dialect_translator.resynthesize_for_voice(formal, dialect="haryanvi")
        self.assertIn("patwari", vernacular)
        self.assertIn("paimaaish", vernacular)
        print(f"[TEST 13 PASS] Haryanvi vernacular re-synthesized for voice-out.")

    # --------------------------------------------------------------------------
    # 6. Lok Adalat Section 20 Petition Generator (Tests 14-15)
    # --------------------------------------------------------------------------
    def test_14_petition_generator_structure(self):
        case_data = {
            "case_id": "case-test-12345",
            "title": "Mauza Shivpur Boundary Encroachment",
            "district": "Varanasi",
            "state": "Uttar Pradesh",
            "petitioner": {"name": "Ram Lakhan Yadav"},
            "respondent": {"name": "Harish Chandra Singh"},
            "settlement_draft": "1. Mutual ridge restoration under Lekhpal supervision."
        }
        petition = self.petition_generator.generate_petition(case_data)
        self.assertEqual(petition["status"], "READY_FOR_LOK_ADALAT_FILING")
        self.assertIn("SECTION 19 & 20", petition["formal_petition_text"])
        self.assertIn("Ram Lakhan Yadav", petition["formal_petition_text"])
        print(f"[TEST 14 PASS] Formal Lok Adalat petition generated: {petition['petition_number']}.")

    def test_15_petition_generator_award_prayer(self):
        petition = self.petition_generator.generate_petition({})
        self.assertIn("Section 21 of the Legal Services Authorities Act", petition["formal_petition_text"])
        print(f"[TEST 15 PASS] Section 21 compromise decree prayer verified in petition.")

    # --------------------------------------------------------------------------
    # 7. Groq Open-Source LLM Fallback (Tests 16-17)
    # --------------------------------------------------------------------------
    def test_16_groq_client_unconfigured_safe(self):
        groq = GroqLLMClient(api_key="")
        self.assertFalse(groq.is_configured())
        self.assertIsNone(groq.generate_json("system", "user"))
        print(f"[TEST 16 PASS] Groq client safely handles unset API keys.")

    def test_17_groq_client_model_selection(self):
        groq = GroqLLMClient(api_key="gsk_test_key_1234567890", model="gpt-oss-120b", fallback_model="qwen-2.5-32b")
        self.assertTrue(groq.is_configured())
        self.assertEqual(groq.model, "gpt-oss-120b")
        self.assertEqual(groq.fallback_model, "qwen-2.5-32b")
        print(f"[TEST 17 PASS] Groq client primary model: {groq.model} with fallback: {groq.fallback_model}.")

    # --------------------------------------------------------------------------
    # 8. Transcription Agent Across Dialects (Tests 18-20)
    # --------------------------------------------------------------------------
    def test_18_transcription_bhojpuri(self):
        agent = TranscriptionAgent()
        res = agent.transcribe("Padosi khet ki purani medh kaat kar do feet bada liya.", dialect_hint="bhojpuri")
        self.assertEqual(res.detected_dialect, "bhojpuri")
        self.assertIn("ridge", res.english_text.lower())
        print(f"[TEST 18 PASS] Bhojpuri transcribed: '{res.english_text[:50]}...'")

    def test_19_transcription_awadhi(self):
        agent = TranscriptionAgent()
        res = agent.transcribe("Hum thekedar ke khet me kaam kiye baaki majdoori nahi mila.", dialect_hint="awadhi")
        self.assertEqual(res.detected_dialect, "awadhi")
        self.assertIn("wage", res.english_text.lower())
        print(f"[TEST 19 PASS] Awadhi wage transcribed: '{res.english_text[:50]}...'")

    def test_20_transcription_haryanvi(self):
        agent = TranscriptionAgent()
        res = agent.transcribe("Tubewell se paani lene par lathi se sar phod diya.", dialect_hint="haryanvi")
        self.assertEqual(res.detected_dialect, "haryanvi")
        self.assertIn("assault", res.english_text.lower())
        print(f"[TEST 20 PASS] Haryanvi assault transcribed: '{res.english_text[:50]}...'")

    # --------------------------------------------------------------------------
    # 9. Statutory Matching & Legal Citations (Test 21)
    # --------------------------------------------------------------------------
    def test_21_statutory_matching_citations(self):
        agent = StatutoryMatchingAgent()
        matches = agent.match("Shop owner demanding 3500 instead of 2000 rent and threatening eviction.", top_k=2)
        self.assertGreaterEqual(len(matches), 1)
        self.assertIn("Tenancy", matches[0]["act"])
        print(f"[TEST 21 PASS] Statutory matching returned: {matches[0]['act']} -> {matches[0]['section']}")

    # --------------------------------------------------------------------------
    # 10. Mediation Draft Agent & Safety Gates (Tests 22-26)
    # --------------------------------------------------------------------------
    def test_22_boundary_dispute_settlement(self):
        agent = MediationDraftAgent()
        res = agent.draft_settlement(
            transcript="Ridge encroachment during wheat sowing in Mauza Shivpur.",
            statutes=[{"act": "Uttar Pradesh Revenue Code, 2006", "section": "Section 24: Demarcation", "text_snippet": "Demarcation by Lekhpal"}],
            dialect="bhojpuri",
            village="Mauza Shivpur"
        )
        self.assertFalse(res["escalate_to_human"])
        self.assertGreaterEqual(res["confidence_score"], 0.70)
        self.assertIn("settlement_draft", res)
        print(f"[TEST 22 PASS] Boundary draft generated (Score: {res['confidence_score']}).")

    def test_23_wage_dispute_settlement(self):
        agent = MediationDraftAgent()
        res = agent.draft_settlement(
            transcript="Unpaid harvesting wages of 3600 rupees for 15 days labor.",
            statutes=[{"act": "Minimum Wages Act, 1948", "section": "Section 20: Wage Claims", "text_snippet": "Claims for delayed remuneration"}],
            dialect="awadhi"
        )
        self.assertFalse(res["escalate_to_human"])
        self.assertGreaterEqual(res["confidence_score"], 0.80)
        print(f"[TEST 23 PASS] Agricultural wage draft generated (Score: {res['confidence_score']}).")

    def test_24_shop_rent_settlement(self):
        agent = MediationDraftAgent()
        res = agent.draft_settlement(
            transcript="Shop tenant in village bazaar facing arbitrary rent increase.",
            statutes=[{"act": "UP Tenancy Act, 2021", "section": "Section 8 & 21: Rent Revision", "text_snippet": "Protection against arbitrary eviction"}],
            dialect="hindi"
        )
        self.assertFalse(res["escalate_to_human"])
        self.assertGreaterEqual(res["confidence_score"], 0.75)
        print(f"[TEST 24 PASS] Shop rent draft generated (Score: {res['confidence_score']}).")

    def test_25_contested_title_escalation(self):
        agent = MediationDraftAgent()
        res = agent.draft_settlement(
            transcript="Cousin forged ancestral will and disputes unregistered family partition deed.",
            statutes=[],
            dialect="bhojpuri"
        )
        self.assertTrue(res["escalate_to_human"])
        self.assertLess(res["confidence_score"], 0.60)
        self.assertIsNotNone(res["escalation_reason"])
        print(f"[TEST 25 PASS] Contested title properly escalated to mediator.")

    def test_26_criminal_violence_escalation(self):
        agent = MediationDraftAgent()
        res = agent.draft_settlement(
            transcript="Attacked with lathis and weapons causing skull fracture and hospital admission.",
            statutes=[],
            dialect="haryanvi"
        )
        self.assertTrue(res["escalate_to_human"])
        self.assertLess(res["confidence_score"], 0.50)
        self.assertIn("criminal", res["escalation_reason"].lower())
        print(f"[TEST 26 PASS] Criminal violence strictly escalated to police/DLSA.")

    # --------------------------------------------------------------------------
    # 11. Vernacular Speech Synthesis (TTS) (Tests 27-28)
    # --------------------------------------------------------------------------
    def test_27_tts_synthesis_audio_bytes(self):
        audio = synthesize("Dono paksh lekhpal dwara naap par sahmat hain.", lang_code="hi-IN")
        self.assertIsInstance(audio, bytes)
        self.assertGreater(len(audio), 500)
        print(f"[TEST 27 PASS] TTS returned {len(audio)} audio bytes.")

    def test_28_tts_dialect_routing(self):
        audio_bhojpuri = synthesize("Khet ke medh naap karwai par sahmat baadan.", lang_code="bhojpuri")
        self.assertGreater(len(audio_bhojpuri), 500)
        print(f"[TEST 28 PASS] Bhojpuri dialect audio synthesized.")

    # --------------------------------------------------------------------------
    # 12. FastAPI Production Endpoints (Tests 29-34)
    # --------------------------------------------------------------------------
    def test_29_api_health(self):
        res = client.get("/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "UP")
        self.assertEqual(data["version"], "2.0.0")
        print(f"[TEST 29 PASS] GET /health returned version: {data['version']}")

    def test_30_api_transcribe(self):
        res = client.post("/transcribe", json={"audio_or_text": "Padosi medh kaat kar khet bada liya.", "dialect": "bhojpuri"})
        self.assertEqual(res.status_code, 200)
        self.assertIn("english_text", res.json())
        print(f"[TEST 30 PASS] POST /transcribe succeeded.")

    def test_31_api_analyze_with_precedents(self):
        res = client.post(
            "/analyze",
            json={
                "grievance_text": "Ridge encroachment in Mauza Shivpur during wheat sowing.",
                "dialect": "bhojpuri",
                "state": "Uttar Pradesh",
                "district": "Varanasi",
                "village": "Mauza Shivpur"
            }
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("settlement_draft", data)
        self.assertIn("vernacular_settlement_draft", data)
        self.assertFalse(data["escalate_to_human"])
        print(f"[TEST 31 PASS] POST /analyze drafted settlement with vernacular audio text.")

    def test_32_api_speak(self):
        res = client.post("/speak", json={"text": "Namaste, yeh samjhauta patr hai.", "lang": "hi-IN"})
        self.assertEqual(res.status_code, 200)
        self.assertGreater(len(res.content), 500)
        print(f"[TEST 32 PASS] POST /speak streaming audio verified ({len(res.content)} bytes).")

    def test_33_api_analyze_record(self):
        res = client.post("/analyze-record", json={"record_text_or_ocr": "Khasra No. 402/1 and Gata 402/2 in Mauza Shivpur."})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("402/1", data["khasra_plots"])
        print(f"[TEST 33 PASS] POST /analyze-record parsed plots: {data['khasra_plots']}")

    def test_34_api_generate_petition(self):
        res = client.post("/generate-petition", json={"title": "Boundary Dispute", "district": "Varanasi"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("petition_number", data)
        self.assertIn("LEGAL SERVICES AUTHORITIES ACT", data["formal_petition_text"])
        print(f"[TEST 34 PASS] POST /generate-petition generated petition {data['petition_number']}.")

    # --------------------------------------------------------------------------
    # 13. Security & Zero-Hardcoded Secrets Audit (Test 35)
    # --------------------------------------------------------------------------
    def test_35_security_and_credential_hygiene(self):
        """Audit source code to verify zero hardcoded AWS secret keys, Groq keys, or private keys."""
        forbidden_patterns = [
            re.compile(r"AKIA[0-9A-Z]{16}"),               # AWS Access Key ID
            re.compile(r"gsk_[a-zA-Z0-9]{30,}"),            # Groq API Key
            re.compile(r"0x[a-fA-F0-9]{64}(?!['\"][,\s]*\/\/\s*mock)"), # Real Ethereum Private Keys (exclude labeled mocks)
        ]
        scanned_files = 0
        violations = []

        workspace_root = os.path.dirname(__file__)
        for root, dirs, files in os.walk(workspace_root):
            # Skip node_modules, .git, chroma_db, __pycache__
            if any(skip in root for skip in ["node_modules", ".git", "chroma_db", "__pycache__", "dist"]):
                continue
            for file in files:
                if file.endswith((".py", ".ts", ".js", ".cedar")):
                    scanned_files += 1
                    filepath = os.path.join(root, file)
                    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                        for pattern in forbidden_patterns:
                            matches = pattern.findall(content)
                            if matches:
                                violations.append(f"{file}: matched {matches[0][:8]}...")

        self.assertEqual(len(violations), 0, f"Hardcoded secrets detected: {violations}")
        self.assertGreater(scanned_files, 10)
        print(f"[TEST 35 PASS] Security hygiene verified across {scanned_files} source files. Zero leaked secrets!")


if __name__ == "__main__":
    unittest.main(verbosity=2)
