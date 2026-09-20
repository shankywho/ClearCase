import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import styles from './PartnersSection.module.css';

export const PartnersSection: React.FC = () => {
  const revealRef = useScrollReveal<HTMLDivElement>();
  const rowRef = useRef<HTMLDivElement>(null);

  const logos = [
    { name: 'Amazon Bedrock', type: 'text' },
    { name: 'Polygon Amoy', type: 'text' },
    { name: 'AWS Cedar AuthZ', type: 'text' },
    { name: 'Groq LLaMA 3.3', type: 'text' },
    { name: 'Gram Panchayat Mesh', type: 'text' },
    { name: 'OpenSearch Statutory RAG', type: 'text' },
  ];

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const ctx = gsap.context(() => {
      const items = row.querySelectorAll<HTMLElement>(`.${styles.logoItem}`);

      items.forEach((item) => {
        const text = item.querySelector(`.${styles.textLogo}`);

        const onMouseEnter = () => {
          gsap.to(item, {
            y: -4,
            scale: 1.06,
            duration: 0.25,
            ease: 'power2.out',
            overwrite: 'auto',
          });

          if (text) {
            gsap.to(text, {
              color: '#71efe4',
              duration: 0.25,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }
        };

        const onMouseLeave = () => {
          gsap.to(item, {
            y: 0,
            scale: 1,
            duration: 0.55,
            ease: 'elastic.out(1, 0.4)',
            overwrite: 'auto',
          });

          if (text) {
            gsap.to(text, {
              color: '',
              duration: 0.35,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }
        };

        item.addEventListener('mouseenter', onMouseEnter);
        item.addEventListener('mouseleave', onMouseLeave);
      });
    }, row);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} aria-label="Ecosystem & Technological Foundation">
      <div className="container">
        <div ref={revealRef}>
          <p className={styles.label}>Ecosystem &amp; Technological Foundation</p>
          <div ref={rowRef} className={styles.logoRow}>
            {logos.map((logo) => (
              <div key={logo.name} className={styles.logoItem} title={logo.name}>
                <span className={styles.textLogo}>{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
