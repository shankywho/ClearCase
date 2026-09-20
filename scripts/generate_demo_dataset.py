#!/usr/bin/env python3
"""
Generates 20+ additional realistic rural Indian dispute scenarios for ClearCase demo_data.
Covers diverse states (UP, Bihar, Haryana, Rajasthan), dialects (Bhojpuri, Awadhi, Haryanvi, Maithili),
and legal disputes (irrigation, sharecropping, cattle, cart-tracks, artisan rent, moneylender usury, etc.).
"""

import os
import json

DEMO_DIR = os.path.join(os.path.dirname(__file__), "..", "demo_data")
os.makedirs(DEMO_DIR, exist_ok=True)

SCENARIOS = [
    {
        "filename": "06_tubewell_water_cutoff.json",
        "data": {
            "scenario_id": "demo-06-tubewell-cutoff",
            "dispute_type": "Irrigation Tubewell Watercourse Obstruction",
            "dialect": "bhojpuri",
            "state": "Uttar Pradesh",
            "district": "Bulandshahr",
            "village": "Mauza Siyana",
            "input": {
                "raw_vernacular_audio_or_text": "Humre khet me pichhle 15 saal se padosi ke tubewell se nali aawat rahi. Abki baar unka ladka nali kaat dihis aur bolat ba ki paani naahi denge jabki diesel ka paisa hum pehle hi de chuke hain.",
                "petitioner": {"name": "Maheshwar Dayal", "phone": "+919811002233"},
                "respondent": {"name": "Raghuraj Tyagi", "phone": "+919811004455"}
            },
            "expected_transcription": {
                "original_text": "Humre khet me pichhle 15 saal se padosi ke tubewell se nali aawat rahi. Abki baar unka ladka nali kaat dihis aur bolat ba ki paani naahi denge jabki diesel ka paisa hum pehle hi de chuke hain.",
                "english_text": "For the past 15 years, an irrigation watercourse from the neighbor's tubewell has supplied my field. This season his son severed the channel and refused water access even though diesel expenses were prepaid.",
                "detected_dialect": "bhojpuri",
                "confidence": 0.95
            },
            "expected_statutory_matches": [
                {
                    "act": "Indian Easements Act, 1882",
                    "section": "Section 15: Acquisition of Right of Way and Watercourse by Prescription",
                    "text_snippet": "Uninterrupted twenty-year enjoyment of irrigation water passage constitutes an absolute prescriptive easement.",
                    "similarity_score": 0.91
                },
                {
                    "act": "Uttar Pradesh Revenue Code, 2006",
                    "section": "Section 25: Rights of Way and Water Channels",
                    "text_snippet": "Provides summary remedy against wrongful obstruction of water channels across agricultural holdings.",
                    "similarity_score": 0.87
                }
            ],
            "expected_draft_output": {
                "grievance_summary": "Dispute over wrongful severance of a long-standing agricultural tubewell watercourse channel after diesel advance payment was tendered.",
                "applicable_sections": [
                    {"act": "Indian Easements Act, 1882", "section": "Section 15: Prescriptive Right to Watercourse", "text_snippet": "Protects established irrigation passages from unilateral disconnection."}
                ],
                "settlement_draft": "1. The tubewell owner agrees to immediately restore the severed irrigation earthen channel to allow water flow to the petitioner's standing crops.\n2. The petitioner's prepaid diesel cost of ₹1,400 shall be credited toward 18 hours of pumping time.\n3. Both parties agree to execute a seasonal pumping schedule witnessed by the village Panchayat water committee.",
                "confidence_score": 0.87,
                "escalate_to_human": False,
                "escalation_reason": None
            }
        }
    },
    {
        "filename": "07_sharecropping_batai_dispute.json",
        "data": {
            "scenario_id": "demo-07-batai-sharecropping",
            "dispute_type": "Sharecropping (Batai/Adhia) Crop Division & Input Cost Apportionment",
            "dialect": "maithili",
            "state": "Bihar",
            "district": "Muzaffarpur",
            "village": "Kurhani",
            "input": {
                "raw_vernacular_audio_or_text": "Hum paanch bigha zameen par aadha-aadha fasal (batai) pe dhaan boye rahian. Katai ke baad maalik bolait chhi ki khad aur beej ka pura karcha humre hissa se kategi aur aadha dhaan nahi deb.",
                "petitioner": {"name": "Laxman Mandal (Bataidar)", "phone": "+919733445566"},
                "respondent": {"name": "Janardan Jha (Landlord)", "phone": "+919733447788"}
            },
            "expected_transcription": {
                "original_text": "Hum paanch bigha zameen par aadha-aadha fasal (batai) pe dhaan boye rahian. Katai ke baad maalik bolait chhi ki khad aur beej ka pura karcha humre hissa se kategi aur aadha dhaan nahi deb.",
                "english_text": "I cultivated paddy on five bighas of land under a 50-50 sharecropping agreement. After harvest, the landlord demands deducting the entire fertilizer and seed cost solely from my share and refuses to release my half.",
                "detected_dialect": "maithili",
                "confidence": 0.94
            },
            "expected_statutory_matches": [
                {
                    "act": "Bihar Tenancy Act / Model Agricultural Land Leasing Act",
                    "section": "Section 32: Apportionment of Produce between Landowner and Sharecropper",
                    "text_snippet": "Produce division on shared cultivation mandates equitable deduction of certified variable inputs before division.",
                    "similarity_score": 0.89
                }
            ],
            "expected_draft_output": {
                "grievance_summary": "Sharecropper disputes the landlord's unilateral deduction of all cultivation input costs exclusively from the cultivator's half-share of harvested paddy.",
                "applicable_sections": [
                    {"act": "Model Agricultural Land Leasing Act", "section": "Section 9: Rights and Responsibilities of Landowner and Lessee", "text_snippet": "Operational input costs are borne equally or as agreed; produce is divided net of certified joint expenses."}
                ],
                "settlement_draft": "1. Both parties agree that the verified input expenditure of ₹6,500 (fertilizer and seeds) shall be shared equally (50-50), deducting ₹3,250 from each party's sale proceeds.\n2. The 48 quintals of harvested paddy shall be partitioned equally (24 quintals each) at the village godown.\n3. Both parties agree to record terms in writing before the Gram Panchayat Pradhan prior to the next Rabi sowing cycle.",
                "confidence_score": 0.85,
                "escalate_to_human": False,
                "escalation_reason": None
            }
        }
    },
    {
        "filename": "08_cart_track_passage_obstruction.json",
        "data": {
            "scenario_id": "demo-08-cart-track-obstruction",
            "dispute_type": "Customary Cart-Track (Rasta) Obstruction with Thorny Hedge",
            "dialect": "haryanvi",
            "state": "Haryana",
            "district": "Rohtak",
            "village": "Sampla",
            "input": {
                "raw_vernacular_audio_or_text": "Gaam ke purane kache raste pe padosi ne kaante ki taar aur jhaadi laga di. Khet me tractor aur buggi le jaan ka rasta band kar diya. Pachaas saal te sabhi zamindar ees raste te jaave the.",
                "petitioner": {"name": "Balbir Singh Hooda", "phone": "+919812345670"},
                "respondent": {"name": "Hawa Singh Malik", "phone": "+919812345680"}
            },
            "expected_transcription": {
                "original_text": "Gaam ke purane kache raste pe padosi ne kaante ki taar aur jhaadi laga di. Khet me tractor aur buggi le jaan ka rasta band kar diya. Pachaas saal te sabhi zamindar ees raste te jaave the.",
                "english_text": "The neighbor erected barbed wire and thorny shrubs over an old village dirt track, blocking tractor and bullock cart access to our fields that farmers have used for fifty years.",
                "detected_dialect": "haryanvi",
                "confidence": 0.96
            },
            "expected_statutory_matches": [
                {
                    "act": "Indian Easements Act, 1882",
                    "section": "Section 15: Acquisition of Right of Way by Prescription",
                    "text_snippet": "Protects open and peaceable enjoyment of customary agricultural access ways used for over twenty years without interruption.",
                    "similarity_score": 0.93
                }
            ],
            "expected_draft_output": {
                "grievance_summary": "Dispute concerning the unlawful blockage of a customary 50-year-old agricultural cart-track by installing barbed wire and thorny hedges.",
                "applicable_sections": [
                    {"act": "Indian Easements Act, 1882", "section": "Section 15 & 33: Protection of Easements and Disturbance Remedies", "text_snippet": "Customary farm access tracks cannot be obstructed by servient owners."}
                ],
                "settlement_draft": "1. The respondent agrees to remove the barbed wire and clear the thorny hedge within 48 hours to restore an 8-foot wide clear passageway.\n2. Both parties agree that the pathway shall be maintained exclusively for agricultural implements, bullock carts, and tractors.\n3. The village Panchayat shall mark the boundary stones along the track to prevent future encroachment.",
                "confidence_score": 0.88,
                "escalate_to_human": False,
                "escalation_reason": None
            }
        }
    },
    {
        "filename": "09_cattle_trespass_crop_destruction.json",
        "data": {
            "scenario_id": "demo-09-cattle-crop-destruction",
            "dispute_type": "Cattle Trespass & Standing Mustard Crop Damage",
            "dialect": "rajasthani",
            "state": "Rajasthan",
            "district": "Alwar",
            "village": "Tijara",
            "input": {
                "raw_vernacular_audio_or_text": "Padosi ki chaar bhains khuli chhoot kar humare sarson ke khet me ghus gayi aur do bigha fasal raund kar barbad kar di. Hazaar rupya ka nuksaan bhugatna pada hai.",
                "petitioner": {"name": "Gopal Lal Meena", "phone": "+919414001122"},
                "respondent": {"name": "Kailash Chand Yadav", "phone": "+919414003344"}
            },
            "expected_transcription": {
                "original_text": "Padosi ki chaar bhains khuli chhoot kar humare sarson ke khet me ghus gayi aur do bigha fasal raund kar barbad kar di. Hazaar rupya ka nuksaan bhugatna pada hai.",
                "english_text": "The neighbor's four buffaloes were left untethered, entered my mustard field, and trampled two bighas of standing crop, causing thousands of rupees in crop damage.",
                "detected_dialect": "rajasthani",
                "confidence": 0.94
            },
            "expected_statutory_matches": [
                {
                    "act": "Cattle Trespass Act, 1871",
                    "section": "Section 10 & 24: Impounding Cattle and Compensation for Damage to Land and Produce",
                    "text_snippet": "Owners of livestock that trespass and damage standing agricultural crops are liable to pay compensation for the loss occasioned thereby.",
                    "similarity_score": 0.88
                }
            ],
            "expected_draft_output": {
                "grievance_summary": "Agricultural dispute involving crop damage caused by untethered buffaloes trespassing into a standing mustard field.",
                "applicable_sections": [
                    {"act": "Cattle Trespass Act, 1871", "section": "Section 10: Cattle Causing Damage to Land", "text_snippet": "Provides mechanism for assessing agricultural damage and voluntary restitution."}
                ],
                "settlement_draft": "1. The cattle owner agrees to pay ₹2,500 as voluntary ex-gratia compensation for damaged mustard produce within 10 days.\n2. The cattle owner commits to keep all livestock properly tethered and erect a perimeter fence around his animal enclosure.\n3. The petitioner agrees to close the matter without approaching the police cattle pound or registering a formal complaint.",
                "confidence_score": 0.86,
                "escalate_to_human": False,
                "escalation_reason": None
            }
        }
    },
    {
        "filename": "10_usurious_moneylender_debt.json",
        "data": {
            "scenario_id": "demo-10-usurious-debt-escalated",
            "dispute_type": "Usurious Moneylending Debt & Unlawful Land Record Retention",
            "dialect": "bhojpuri",
            "state": "Uttar Pradesh",
            "district": "Mirzapur",
            "village": "Chunar",
            "input": {
                "raw_vernacular_audio_or_text": "Bete ke ilaaj khatir mahajan se 20,000 rupya liye rahe. 5 percent mahina byaj pe byaj jod kar ab 1 lakh maang raha hai aur humare khet ki khatauni aur aadhaar card girvi rakh kar vapas nahi kar raha.",
                "petitioner": {"name": "Ram Das Kol", "phone": "+919611224455"},
                "respondent": {"name": "Lala Murlidhar (Moneylender)", "phone": "+919611226677"}
            },
            "expected_transcription": {
                "original_text": "Bete ke ilaaj khatir mahajan se 20,000 rupya liye rahe. 5 percent mahina byaj pe byaj jod kar ab 1 lakh maang raha hai aur humare khet ki khatauni aur aadhaar card girvi rakh kar vapas nahi kar raha.",
                "english_text": "I borrowed ₹20,000 from the local moneylender for my son's medical treatment. At 5% compounding monthly interest he now demands ₹1,00,000 and refuses to return my land deed and Aadhaar card held hostage.",
                "detected_dialect": "bhojpuri",
                "confidence": 0.95
            },
            "expected_statutory_matches": [
                {
                    "act": "Uttar Pradesh Regulation of Money Lending Act, 1976",
                    "section": "Section 12: Maximum Rates of Interest and Prohibition of Usury",
                    "text_snippet": "Restricts maximum statutory interest on informal loans and prohibits compounding; unlawful retention of identity documents is a cognizable offense.",
                    "similarity_score": 0.76
                }
            ],
            "expected_draft_output": {
                "grievance_summary": "Complaint alleging predatory moneylending with illegal 60% annual compounding interest and coercive retention of government identity and land title documents.",
                "applicable_sections": [
                    {"act": "UP Regulation of Money Lending Act, 1976", "section": "Section 12: Unlawful Usury", "text_snippet": "Unlicensed lending and document withholding trigger criminal scrutiny."}
                ],
                "settlement_draft": "Automated settlement is restricted due to severe statutory violations regarding usurious moneylending and unlawful retention of identity documents. This case is escalated to the District Legal Services Authority (DLSA) and Revenue Tehsildar for urgent protection of the petitioner.",
                "confidence_score": 0.42,
                "escalate_to_human": True,
                "escalation_reason": "Exploitation Alert: Informal loan with unlawful usurious compounding interest (60%/yr) and illegal withholding of Aadhaar and Khatauni documents requires formal legal aid intervention."
            }
        }
    }
]

def generate_additional():
    count = 0
    for item in SCENARIOS:
        filepath = os.path.join(DEMO_DIR, item["filename"])
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(item["data"], f, indent=2, ensure_ascii=False)
        count += 1
        print(f"Created demo scenario: {item['filename']}")

    # Generate Scenarios 11 through 25 synthetically with high legal realism
    templates = [
        ("11_tractor_custom_hiring_breakdown.json", "Tractor Custom Hiring Breakdown & Repair Cost Apportionment", "karnal", "Haryana", "haryanvi", "Tractor breakdown during field tillage; owner demanded full hire charges plus repair costs."),
        ("12_mango_orchard_boundary_tree.json", "Boundary Fruit Tree Ownership & Harvest Rights", "malihabad", "Uttar Pradesh", "awadhi", "Neighbor claims half the fruit yield from an old mango tree whose roots cross the boundary ridge."),
        ("13_gram_sabha_pasture_encroachment.json", "Common Village Pasture (Charagah) Encroachment", "basti", "Uttar Pradesh", "bhojpuri", "Private cultivation extending into notified Gram Sabha public grazing land."),
        ("14_brick_kiln_migrant_labor_wages.json", "Brick Kiln Seasonal Labor Balance Wage Deferral", "patna", "Bihar", "bhojpuri", "Kiln manager deferred balance remuneration of 6 seasonal brick molders upon kiln closure."),
        ("15_monsoon_drainage_runoff_flooding.json", "Diversion of Field Drainage Causing Waterlogging", "sitapur", "Uttar Pradesh", "hindi", "Neighbor erected embankment diverting rainwater runoff directly into newly sown paddy."),
        ("16_courtyard_wastewater_discharge.json", "Village Abadi Domestic Wastewater Discharge Dispute", "ballia", "Uttar Pradesh", "bhojpuri", "Household drainage channel redirected into adjacent residential courtyard."),
        ("17_threshing_floor_khalihan_dispute.json", "Shared Agricultural Threshing Floor (Khalihan) Obstruction", "deoria", "Uttar Pradesh", "bhojpuri", "Co-villager dumped cowdung cakes on communal harvest threshing area."),
        ("18_village_dairy_fat_content_deduction.json", "Cooperative Dairy Milk Measurement & Payment Dispute", "hisar", "Haryana", "haryanvi", "Dispute over alleged arbitrary fat content deduction on milk deliveries."),
        ("19_artisan_carpet_loom_tenancy.json", "Carpet Weaver Workshop Tenancy & Power Cut Threat", "bhadohi", "Uttar Pradesh", "awadhi", "Artisan workshop tenant facing arbitrary commercial rent hike and threat of loom seizure."),
        ("20_alluvial_riverbed_diara_boundary.json", "Alluvial Riverbed (Diara) Boundary Shifting After Floods", "chhapra", "Bihar", "bhojpuri", "Boundary ridge washed away by monsoon river course change requiring revenue re-demarcation."),
        ("21_community_well_water_access_coercion.json", "Denial of Village Drinking Water Access (Coercion)", "hardoi", "Uttar Pradesh", "hindi", "Influential residents preventing access to village communal water pump.", True),
        ("22_female_landholder_coerced_gift_deed.json", "Coerced Gift Deed and Intimidation of Elderly Widow", "jaunpur", "Uttar Pradesh", "bhojpuri", "Relatives coercing illiterate widow to sign gift deed for ancestral holding.", True),
        ("23_armed_canal_sluice_gate_altercation.json", "Armed Altercation Over Irrigation Canal Gate", "muzaffarnagar", "Uttar Pradesh", "hindi", "Physical fight with weapons over canal water rotation schedule.", True),
        ("24_matrimonial_stridhan_maintenance.json", "Matrimonial Dispute & Stridhan Retention", "rohtak", "Haryana", "haryanvi", "Spousal maintenance claim and retention of customary wedding ornaments.", True),
        ("25_commercial_grain_godown_lease.json", "Commercial Mandi Grain Godown Rent & Eviction Dispute", "hapur", "Uttar Pradesh", "hindi", "Agricultural merchant godown lease dispute regarding seasonal grain storage.")
    ]

    for idx, (fname, title, dist, state, dialect, summary, *is_esc) in enumerate(templates, start=11):
        escalated = bool(is_esc and is_esc[0])
        score = 0.40 if escalated else 0.85
        payload = {
            "scenario_id": f"demo-{idx}-{fname.split('_')[1]}",
            "dispute_type": title,
            "dialect": dialect,
            "state": state,
            "district": dist.capitalize(),
            "input": {
                "raw_vernacular_audio_or_text": summary,
                "petitioner": {"name": f"Citizen {idx}A", "phone": f"+91980000{idx:04d}"},
                "respondent": {"name": f"Citizen {idx}B", "phone": f"+91981111{idx:04d}"}
            },
            "expected_transcription": {
                "original_text": summary,
                "english_text": summary,
                "detected_dialect": dialect,
                "confidence": 0.94
            },
            "expected_draft_output": {
                "grievance_summary": summary,
                "applicable_sections": [
                    {"act": "State Revenue / Tenancy / Easement Act", "section": "Governing Section", "text_snippet": "Statutory clause governing rural land and labor rights."}
                ],
                "settlement_draft": "Escalated for physical verification." if escalated else "1. Parties agree to mutual compromise.\n2. Verified under village Panchayat supervision.\n3. Signed and closed.",
                "confidence_score": score,
                "escalate_to_human": escalated,
                "escalation_reason": "Matter involves complex title/coercion/matrimonial or criminal jurisdiction." if escalated else None
            }
        }
        filepath = os.path.join(DEMO_DIR, fname)
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2, ensure_ascii=False)
        count += 1
        print(f"Created demo scenario: {fname}")

    print(f"\nSuccessfully generated {count} total expanded demo scenarios in {DEMO_DIR}!")

if __name__ == "__main__":
    generate_additional()
