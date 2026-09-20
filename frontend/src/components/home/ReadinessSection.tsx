import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import styles from './ReadinessSection.module.css';

const RURAL_JUSTICE_REALITIES = [
  'Agricultural boundary ridges and irrigation disputes simmer for generations without formal documentation.',
  'Rural citizens face high literacy barriers, while statutory legal codes remain locked in dense legalese.',
  'Speakers of regional dialects (Bhojpuri, Awadhi, Maithili, Malvi) are ignored by conventional legal portals.',
  'Verbal village settlements have no cryptographic paper trail, leading to cyclic re-encroachment.',
  'Formal court litigation takes decades and costs smallholders thousands of rupees in prohibitive fees.',
];

export const ReadinessSection: React.FC = () => {
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className={styles.section} aria-label="Rural Justice Reality in Bharat">
      <div className="container">
        <div ref={revealRef}>
          <p className={styles.label}>The rural justice chasm in Bharat:</p>

          <div className={styles.list}>
            {RURAL_JUSTICE_REALITIES.map((item, idx) => (
              <div key={idx} className={styles.item}>
                <span className={styles.bullet}>✦</span>
                <p className={styles.text}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
