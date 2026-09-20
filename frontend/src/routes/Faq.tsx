import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ClosingCtaSection } from '@/components/home/ClosingCtaSection';
import styles from './Faq.module.css';

const FAQS = [
  {
    q: 'Is a ClearCase compromise accord legally binding?',
    a: 'Yes. Once both disputants review and confirm the 3-step compromise agreement via dual-party OTP, ClearCase compiles it into a formal pre-litigation petition under Section 20 of the Legal Services Authorities Act, 1987. When submitted to the Taluk Lok Adalat, it receives the enforceable status of a non-appealable civil court decree under Section 21.',
  },
  {
    q: 'How does ClearCase guarantee zero AI hallucination of laws?',
    a: 'ClearCase uses a deterministic Statutory RAG architecture backed by official State Gazettes (such as the UP Revenue Code 2006 and Minimum Wages Act 1948). The autonomous mediation agents are strictly forbidden from citing any section not retrieved from verified statutory vectors.',
  },
  {
    q: 'What happens if a dispute involves violence, usury, or forged records?',
    a: 'ClearCase has built-in ethical safety gates. If context indicates physical violence, predatory usury (>36% compound interest), or contested ancestral wills, the AI flags the case as MANDATORY_HUMAN_ESCALATION and routes it immediately to District Legal Services Authority (DLSA) panel advocates.',
  },
  {
    q: 'Can citizens who cannot read or write use ClearCase?',
    a: 'Absolutely. ClearCase is voice-first. Disputants tap a single microphone button to speak their dispute in their regional dialect, and the synthesized compromise accord is read back aloud through high-fidelity vernacular audio playback.',
  },
  {
    q: 'Which regional dialects are currently supported?',
    a: 'The system natively supports Bhojpuri, Awadhi, Maithili, Malvi, and Standard Hindi for both spoken audio grievance intake and vernacular speech playback.',
  },
  {
    q: 'Why is the Polygon blockchain used for dispute records?',
    a: 'Verbal village agreements are frequently denied or breached months later. By anchoring a deterministic SHA-256 hash of the mutual OTP-verified accord on the Polygon Amoy testnet, neither party can alter or deny the agreed terms, while keeping personal identity data off-chain.',
  },
  {
    q: 'Does ClearCase replace village Panchayats or local judges?',
    a: 'No. ClearCase operates under Section 89 of the Code of Civil Procedure (1908) as an autonomous alternative dispute resolution (ADR) layer. It assists Gram Pradhans, Revenue Inspectors (Lekhpals), and Lok Adalat conciliators by providing instant statutory grounding.',
  },
  {
    q: 'How is citizen privacy and sensitive land data protected?',
    a: 'All case records, plot identifiers, and audio statements are secured with fine-grained AWS Cedar authorization policies, ensuring data isolation and preventing unauthorized third-party access.',
  },
];

export const Faq: React.FC = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();

  return (
    <main>
      <section className="container section">
        <div ref={headerRef} className={styles.header}>
          <h1 className={styles.title}>
            Frequently Asked Questions.
          </h1>
          <p className={styles.subhead}>
            Detailed legal and architectural answers on statutory grounding, Lok Adalat enforceability, vernacular audio, and blockchain consensus.
          </p>
        </div>

        <div className={styles.faqList}>
          {FAQS.map((faq, idx) => (
            <details key={idx} className={styles.faqItem} open={idx === 0}>
              <summary className={styles.questionSummary}>
                <span>{faq.q}</span>
                <span className={styles.icon} aria-hidden="true">+</span>
              </summary>
              <div className={styles.answerBody}>
                <p style={{ margin: 0 }}>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <TestimonialsSection />
      <ClosingCtaSection />
    </main>
  );
};
