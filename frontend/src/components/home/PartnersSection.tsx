import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import styles from './PartnersSection.module.css';

export const PartnersSection: React.FC = () => {
  const revealRef = useScrollReveal<HTMLDivElement>();

  const logos = [
    { name: 'Amazon Bedrock', type: 'text' },
    { name: 'Polygon Amoy', type: 'text' },
    { name: 'AWS Cedar AuthZ', type: 'text' },
    { name: 'Groq LLaMA 3.3', type: 'text' },
    { name: 'Gram Panchayat Mesh', type: 'text' },
    { name: 'OpenSearch Statutory RAG', type: 'text' },
  ];

  return (
    <section className={styles.section} aria-label="Ecosystem & Technological Foundation">
      <div className="container">
        <div ref={revealRef}>
          <p className={styles.label}>Ecosystem & Technological Foundation</p>
          <div className={styles.logoRow}>
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
