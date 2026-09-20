import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import { ClosingCtaSection } from '@/components/home/ClosingCtaSection';
import { InteractiveTerminalSection } from '@/components/home/InteractiveTerminalSection';
import styles from './Approach.module.css';

const TIERS = [
  {
    number: 'Tier 01',
    title: 'Vernacular Audio & Spoken Dialect Normalization',
    summary: 'Grassroots dispute resolution begins by meeting citizens in their spoken mother tongue, removing the prerequisite of English or formal legal Hindi literacy.',
    badges: ['Whisper Neural', 'AWS Transcribe', 'Acoustic Confidence Score', 'Offline PCM Engine'],
    specs: [
      'Native phonetic ingestion for Bhojpuri, Awadhi, Maithili, Malvi, and Standard Hindi.',
      'Acoustic signal normalization stripping ambient agricultural background noise and farm machinery.',
      'Conversational entity extraction parsing disputant relationships, disputed land bounds, and crop cycles.',
    ],
  },
  {
    number: 'Tier 02',
    title: 'Statutory Knowledge RAG & Zero-Hallucination Agent',
    summary: 'Autonomous agentic pipeline that searches official state gazettes and enacted legislation, barring the AI from generating speculative legal advice.',
    badges: ['State Gazette RAG', 'Amazon Titan Embeddings', 'Groq LLaMA 3.3 70B', 'Claude 3.5 Sonnet'],
    specs: [
      'Exact statutory retrieval against the UP Revenue Code (2006), Minimum Wages Act (1948), and Model Tenancy Act.',
      'Strict prompt boundary gates refusing automated resolution if confidence falls below 0.60.',
      'Section 89 CPC conciliation framing ensuring all recommendations remain non-coercive and voluntary.',
    ],
  },
  {
    number: 'Tier 03',
    title: 'Panchayat Precedent Memory & Coercion Safeguards',
    summary: 'Surfaces historical resolutions from neighboring Gram Sabhas while enforcing ethical barriers against usury and systemic intimidation.',
    badges: ['Gram Sabha Memory', 'Coercion Classifier', 'DLSA Escalation Route', 'Panchayat Context'],
    specs: [
      'Vector search across thousands of historical village accords to ensure proposed settlements reflect local custom.',
      'Automatic detection of predatory usury (>36% compounding interest), caste boycotts, and document withholding.',
      'Immediate routing of high-risk cases to District Legal Services Authority (DLSA) panel mediators.',
    ],
  },
  {
    number: 'Tier 04',
    title: 'Dual-Party OTP Consensus & Polygon Amoy Anchoring',
    summary: 'Converts voluntary compromise accords into permanent, tamper-proof legal instruments recognized under Section 20 of the Legal Services Authorities Act, 1987.',
    badges: ['Polygon Amoy Testnet', 'SHA-256 Hash Chaining', 'Dual-Party OTP Verification', 'Section 20 Petitions'],
    specs: [
      'Bilingual vernacular voice playback allowing both parties to audit the 3-step compromise agreement before signing.',
      'Dual-party digital OTP consent triggering atomic on-chain state transition to CONSENT_ACHIEVED.',
      'One-click compilation of court-ready Lok Adalat petitions carrying the full legal weight of a civil court decree.',
    ],
  },
];

export const Approach: React.FC = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();

  return (
    <main>
      <section className="container section">
        <div ref={headerRef} className={styles.header}>
          <h1 className={styles.title}>
            The 4-Tier Decentralized Dispute Mesh.
          </h1>
          <p className={styles.subhead}>
            From spoken dialect intake to on-chain cryptographic settlement anchoring: how ClearCase combines vernacular speech, statutory RAG, and fine-grained authorization for rural India.
          </p>
        </div>

        <div className={styles.tiersGrid}>
          {TIERS.map((tier) => (
            <article key={tier.number} className={styles.tierCard}>
              <span className={styles.tierNumber}>{tier.number}</span>
              <h2 className={styles.tierTitle}>{tier.title}</h2>
              <p className={styles.tierSummary}>{tier.summary}</p>

              <ul className={styles.specList}>
                {tier.specs.map((spec, idx) => (
                  <li key={idx} className={styles.specItem}>
                    <span className={styles.specBullet}>✦</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>

              <div className={styles.badgeRow}>
                {tier.badges.map((b) => (
                  <span key={b} className={styles.techBadge}>{b}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Interactive Live Statutory Resolution Bench */}
      <InteractiveTerminalSection />

      <ClosingCtaSection />
    </main>
  );
};
