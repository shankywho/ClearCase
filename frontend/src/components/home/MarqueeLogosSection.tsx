import React from 'react';
import styles from './MarqueeLogosSection.module.css';

export const MarqueeLogosSection: React.FC = () => {
  const logos = [
    { name: 'Google Japan', tag: 'Visual Storytelling' },
    { name: 'Mountain Dew', tag: 'Global Campaign' },
    { name: 'Fetus', tag: 'Streetwear Universe' },
    { name: 'Play It', tag: 'Toy Brand' },
    { name: 'Zerocircle', tag: 'Climate Bio-Materials' },
    { name: 'Greed', tag: 'Consumer Coffee' },
    { name: 'Namaha', tag: 'Healthcare' },
  ];

  return (
    <section className={styles.section} aria-label="Client Partners">
      <div className={styles.labelWrapper}>
        <p className={styles.label}>Trusted by Category Defining Brands</p>
      </div>

      <div className={styles.marqueeContainer}>
        <div className={styles.track}>
          {[...logos, ...logos].map((logo, i) => (
            <div key={`${logo.name}-${i}`} className={styles.logoItem}>
              <span className={styles.logoName}>{logo.name}</span>
              <span className={styles.logoTag}>{logo.tag}</span>
              <span className={styles.divider}>✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
