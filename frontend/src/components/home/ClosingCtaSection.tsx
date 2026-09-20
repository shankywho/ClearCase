import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import styles from './ClosingCtaSection.module.css';

export const ClosingCtaSection: React.FC = () => {
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className={styles.section} aria-label="Closing Call to Action">
      <div className="container">
        <div ref={revealRef} className={styles.inner}>
          <h2 className={styles.headline}>
            Ready to bring statutory dispute resolution to your Gram Panchayat?
          </h2>

          <Link to="/contact" className={styles.ctaBtn}>
            <span className={styles.ctaText}>Deploy ClearCase Mesh</span>
            <span className={styles.arrow} aria-hidden="true">
              <svg viewBox="0 0 14.879 32.733" width="14" height="26" fill="none">
                <path
                  d="M 1.5 1.5 L 13 16.367 L 1.5 31.233"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};
