import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import styles from './ValuePropositionSection.module.css';

export const ValuePropositionSection: React.FC = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();

  const pillars = [
    {
      num: '01',
      title: 'Dialect Voice Intake',
      tagline: 'Speak naturally in native dialects.',
      desc: 'Rural citizens state disputes in Bhojpuri, Awadhi, Maithili, or Hindi. Spoken input is transcribed and normalized without literacy requirements.',
    },
    {
      num: '02',
      title: 'Statutory RAG',
      tagline: 'Grounded in official State Gazettes.',
      desc: 'Our semantic engine retrieves verified statutes from State Revenue Codes, Minimum Wages Acts, and Tenancy Laws with zero fabricated citations.',
    },
    {
      num: '03',
      title: 'Coercion Safety Gate',
      tagline: 'Strict ethical guardrails.',
      desc: 'Disputes involving predatory usury (>36%), document withholding, or intimidation trigger automatic escalation to human Legal Aid panels.',
    },
    {
      num: '04',
      title: 'Polygon Anchoring',
      tagline: 'Tamper-proof digital consensus.',
      desc: 'Mutually approved accords generate a deterministic SHA-256 hash anchored onto Polygon Amoy, preventing future denial or re-encroachment.',
    },
  ];

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div ref={headerRef} className={styles.header}>
          <span className="badge-tag">Autonomous Dispute Mesh</span>
          <h2 className="text-h1" style={{ marginBlock: 'var(--space-md)' }}>
            Four pillars of vernacular justice.
          </h2>
          <p className="text-body-lg" style={{ maxWidth: '640px' }}>
            Bridging the gap between spoken village realities and statutory Indian law through voice-first AI mediation, fine-grained access control, and cryptographic consensus.
          </p>
        </div>

        <div className={styles.grid}>
          {pillars.map((p) => (
            <div key={p.num} className={styles.card}>
              <span className={styles.num}>{p.num}</span>
              <h3 className={styles.title}>{p.title}</h3>
              <p className={styles.tagline}>{p.tagline}</p>
              <p className={styles.desc}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
