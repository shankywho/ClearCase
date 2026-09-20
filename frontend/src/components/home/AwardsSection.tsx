import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import styles from './AwardsSection.module.css';

const METRICS_AND_ACCREDITATIONS = [
  { brand: 'Bharat Builds', title: 'AWS First Commit Track Showcase' },
  { brand: 'Civil Backlog', title: 'Filtering 40 Million Disputes at Pre-Litigation Stage' },
  { brand: 'Statutory Accuracy', title: 'Zero Hallucinations Across State Revenue Codes' },
  { brand: 'Polygon Amoy', title: 'Deterministic SHA-256 Dual-Consent On-Chain Anchoring' },
  { brand: 'Vernacular Access', title: '5 Regional Dialects Supported with Audio-First UI' },
  { brand: 'Statutory Foundation', title: 'Backed by Section 89 CPC & Section 20 LSAA 1987' },
  { brand: 'Resolution Time', title: 'Average Mutual Accord Drafted in Under 8 Minutes' },
  { brand: 'Safety Gate', title: 'Automatic Interception of Usury and Coercive Intimidation' },
];

export const AwardsSection: React.FC = () => {
  const revealRef = useScrollReveal<HTMLDivElement>();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      const cards = track.querySelectorAll<HTMLElement>(`.${styles.card}`);

      cards.forEach((card) => {
        const brand = card.querySelector(`.${styles.brand}`);

        const onMouseEnter = () => {
          gsap.to(card, {
            y: -6,
            scale: 1.04,
            borderColor: '#71efe4',
            boxShadow: '0 12px 28px rgba(113, 239, 228, 0.18)',
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
          });

          if (brand) {
            gsap.to(brand, {
              color: '#71efe4',
              duration: 0.25,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }
        };

        const onMouseLeave = () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            borderColor: '',
            boxShadow: '',
            duration: 0.45,
            ease: 'power3.out',
            overwrite: 'auto',
          });

          if (brand) {
            gsap.to(brand, {
              color: '',
              duration: 0.35,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }
        };

        card.addEventListener('mouseenter', onMouseEnter);
        card.addEventListener('mouseleave', onMouseLeave);
      });
    }, track);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} aria-label="Statutory Metrics & Accreditations">
      <div className="container">
        <div ref={revealRef}>
          <p className={styles.label}>Statutory Metrics &amp; Key Accreditations</p>
        </div>
      </div>

      <div ref={trackRef} className={styles.marqueeTrack}>
        {[...METRICS_AND_ACCREDITATIONS, ...METRICS_AND_ACCREDITATIONS].map((item, idx) => (
          <div key={`${item.brand}-${idx}`} className={styles.card}>
            <span className={styles.brand}>{item.brand}</span>
            <p className={styles.headline}>{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
