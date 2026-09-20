# Project ClearCase: Overview & Domain Context

> **Offline-First, Voice-Native AI Dispute Resolution Mesh for Bharat**  
> Hackathon: *Bharat Builds by WeMakeDevs* | Track: AWS First Commit

---

## 1. The Real-World Crisis in Rural Justice

In rural India (Bharat), more than **4 crore civil disputes** are pending across trial courts, and countless millions more never even reach formal institutions. They simmer or violently erupt at the village level. 

### Why Traditional Legal Mechanisms Fail Rural Citizens:
1. **The Literacy & Legalese Chasm**:
   Over 25% of rural citizens face literacy challenges, and virtually none understand English or Sanskritized legal Hindi. Yet Indian laws (such as Land Revenue Codes and Minimum Wages Acts) are written in dense legalese.
2. **Dialect Heterogeneity**:
   Disputants speak localized dialects—Bhojpuri, Awadhi, Haryanvi, Maithili, Magahi, Marwari—which urban legal-tech chatbots and text search engines ignore completely.
3. **Ad-Hoc, Biased Informal Adjudication**:
   Village Panchayats and local elders resolve disputes verbally based on memory, tradition, or local power dynamics rather than statutory law. This frequently reinforces caste, gender, or wealth biases.
4. **No Verifiable Paper Trail**:
   Verbal settlements settled over tea or panchayat gatherings have zero cryptographic or legal paper trail. Months later, a party re-encroaches or denies the compromise, restarting the cycle.
5. **Prohibitive Costs & Generational Delays**:
   Filing a formal title or boundary suit costs tens of thousands of rupees in lawyer fees, stamp duties, and court fees, often taking 10 to 20 years to reach a decree.

---

## 2. ClearCase: The Solution & Vision

ClearCase is an **autonomous AI legal mediation layer** that sits between citizens and local dispute resolution forums (Gram Panchayats, Lok Adalats, and Legal Aid Defense Counsel).

Instead of forcing a villager to write a petition or hire an advocate, a citizen simply **taps a single microphone button** and speaks their grievance in their native dialect:
> *"Padosi khet ki purani medh kaat kar do feet humre khet ki or bada liya hai gehu buaai ke samay..."*

ClearCase transforms this verbal grievance through an agentic pipeline:
1. **Dialect Transcription**: Recognizes vernacular speech and translates it into clean English semantic facts.
2. **Statutory Grounding (RAG)**: Searches verified state legal codes (UP Revenue Code 2006, Minimum Wages Act 1948, Tenancy Act 2021) to retrieve the exact clause governing the issue.
3. **Precedent Memory**: Searches past resolved Gram Panchayat cases in that district/village to ensure community consistency.
4. **Neutral Compromise Formulation**: Claude 3.5 Sonnet / Llama 3.3 70B drafts an objective, non-binding 3-step compromise agreement.
5. **Vernacular Voice Playback (TTS)**: Synthesizes the draft back into the citizen's own language and dialect so literacy is never a prerequisite.
6. **Dual-Party OTP & On-Chain Anchoring**: When both parties verbally or via SMS confirm agreement, the settlement hash is locked onto the **Polygon Amoy testnet**, creating a tamper-proof record.
7. **Strict Safety Gates**: If the dispute involves violence, criminal intimidation, or forged ancestral wills, the AI refuses to guess and escalates to a human mediator.

---

## 3. Core Philosophy: Grounded, Non-Binding, Empowering

- **Not Replacing the Judiciary**: ClearCase does not issue binding judicial judgments. It generates voluntary, well-grounded compromise drafts under **Section 89 CPC** and **Section 20 of the Legal Services Authorities Act, 1987**.
- **Zero Hallucination Tolerance**: The AI is forbidden from inventing statutes. Every recommendation must cite an existing legislative section.
- **Dignity of Vernacular Voice**: Justice begins with being understood in your mother tongue.
