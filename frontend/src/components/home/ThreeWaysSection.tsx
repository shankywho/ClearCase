import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import styles from './ThreeWaysSection.module.css';

export const ThreeWaysSection: React.FC = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className={styles.section} aria-label="Three ways we make you the Only">
      <div className="container">
        <div ref={headerRef} className={styles.header}>
          <h2 className={styles.mainTitle}>Three pillars</h2>
          <p className={styles.subtitle}>of statutory village mediation</p>
        </div>

        <div className={styles.blocks}>
          {/* Block 1 */}
          <div className={styles.block}>
            <div className={styles.mediaCol}>
              <img
                src="/images/pillar-vernacular-intake.jpg"
                alt="Vernacular Dialect Audio Intake"
                className={styles.image}
                loading="lazy"
              />
            </div>
            <div className={styles.contentCol}>
              <h3 className={styles.blockTitle}>
                Vernacular dialect intake that understands real village speech.
              </h3>
              <div className={styles.tagGrid}>
                {[
                  'Bhojpuri Speech',
                  'Awadhi Grammar',
                  'Maithili Dialect',
                  'Audio Waveforms',
                  'Whisper Normalizer',
                  'Acoustic Confidence',
                  'Zero Literacy Prerequisite',
                  'Oral Grievance Statements',
                ].map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Block 2 (Reversed) */}
          <div className={`${styles.block} ${styles.reverse}`}>
            <div className={styles.mediaCol}>
              <img
                src="/images/pillar-statutory-grounding.jpg"
                alt="Statutory Grounding & Revenue Codes"
                className={styles.image}
                loading="lazy"
              />
            </div>
            <div className={styles.contentCol}>
              <h3 className={styles.blockTitle}>
                Statutory grounding that anchors every clause in State Acts.
              </h3>
              <div className={styles.tagGrid}>
                {[
                  'UP Revenue Code 2006',
                  'Section 24 Demarcation',
                  'Minimum Wages Act 1948',
                  'CrPC Section 133',
                  'Indian Easements Act',
                  'Model Tenancy Code',
                  'Zero Hallucination Gate',
                  'Official State Gazettes',
                ].map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Block 3 */}
          <div className={styles.block}>
            <div className={styles.mediaCol}>
              <img
                src="/images/pillar-cryptographic-accord.jpg"
                alt="Cryptographic Consensus & Lok Adalat Enforceability"
                className={styles.image}
                loading="lazy"
              />
            </div>
            <div className={styles.contentCol}>
              <h3 className={styles.blockTitle}>
                Cryptographic consensus and formal Lok Adalat conversion.
              </h3>
              <div className={styles.tagGrid}>
                {[
                  'Section 89 CPC',
                  'Section 20 LSAA 1987',
                  'Dual-Party OTP Consent',
                  'Polygon Amoy Smart Contract',
                  'SHA-256 Audit Trail',
                  'Court-Enforceable Decrees',
                  'Panchayat Registry',
                  'Permanent Dispute Closure',
                ].map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.ctaWrapper}>
          <Link to="/approach" className={styles.ctaBtn}>
            <span>Explore The Architecture</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
