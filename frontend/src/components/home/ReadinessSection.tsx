import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
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
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;

    const ctx = gsap.context(() => {
      const items = listEl.querySelectorAll<HTMLElement>(`.${styles.item}`);

      items.forEach((item) => {
        const bullet = item.querySelector(`.${styles.bullet}`);
        const text = item.querySelector(`.${styles.text}`);

        const onMouseEnter = () => {
          gsap.to(item, {
            x: 12,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
          });

          if (bullet) {
            gsap.to(bullet, {
              rotate: 90,
              scale: 1.35,
              duration: 0.4,
              ease: 'back.out(2)',
              overwrite: 'auto',
            });
          }

          if (text) {
            gsap.to(text, {
              color: '#000000',
              duration: 0.25,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }
        };

        const onMouseLeave = () => {
          gsap.to(item, {
            x: 0,
            duration: 0.45,
            ease: 'power3.out',
            overwrite: 'auto',
          });

          if (bullet) {
            gsap.to(bullet, {
              rotate: 0,
              scale: 1,
              duration: 0.45,
              ease: 'power3.out',
              overwrite: 'auto',
            });
          }

          if (text) {
            gsap.to(text, {
              color: '',
              duration: 0.3,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }
        };

        item.addEventListener('mouseenter', onMouseEnter);
        item.addEventListener('mouseleave', onMouseLeave);
      });
    }, listEl);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} aria-label="Rural Justice Reality in Bharat">
      <div className="container">
        <div ref={revealRef}>
          <p className={styles.label}>The rural justice chasm in Bharat:</p>

          <div ref={listRef} className={styles.list}>
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
