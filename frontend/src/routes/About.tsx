import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ClosingCtaSection } from '@/components/home/ClosingCtaSection';
import styles from './About.module.css';

export const About: React.FC = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();

  return (
    <main>
      <section className="container section">
        <div ref={headerRef} className={styles.header}>
          <h1 className={styles.title}>
            Bridging the 4 Crore Justice Gap.
          </h1>
          <p className={styles.subhead}>
            More than 40 million civil disputes remain trapped in Indian trial courts, while millions more erupt at the village level without ever reaching formal institutions. ClearCase is building an autonomous, voice-first mediation layer for Gram Panchayats.
          </p>
        </div>

        <div className={styles.grid}>
          <article className={styles.storyCard}>
            <span className={styles.cardNum}>Pillar 01</span>
            <h2 className={styles.cardTitle}>The Literacy &amp; Legalese Chasm</h2>
            <p className={styles.cardBody}>
              Over 25% of rural citizens face reading and writing barriers, and virtually none understand formal legal legalese. Yet Indian legal codes—such as Land Revenue Codes and Tenancy Acts—are written exclusively in dense legal jargon. ClearCase eliminates the legalese barrier by translating complex statutory rights into intuitive spoken clarity.
            </p>
          </article>

          <article className={styles.storyCard}>
            <span className={styles.cardNum}>Pillar 02</span>
            <h2 className={styles.cardTitle}>The Dignity of Spoken Dialect</h2>
            <p className={styles.cardBody}>
              Justice begins with being understood in your mother tongue. Rural citizens speak localized dialects—Bhojpuri, Awadhi, Maithili, Malvi—which conventional legal portals ignore. By enabling oral grievance statements and spoken audio playback, ClearCase makes literacy completely optional for accessing statutory justice.
            </p>
          </article>

          <article className={styles.storyCard}>
            <span className={styles.cardNum}>Pillar 03</span>
            <h2 className={styles.cardTitle}>Constitutional Grounding &amp; Peace</h2>
            <p className={styles.cardBody}>
              ClearCase is strictly engineered to support, not replace, judicial mechanisms. Operating under Section 89 of the Code of Civil Procedure (1908) and Section 20 of the Legal Services Authorities Act (1987), it formulates voluntary, non-coercive compromise accords that can be formalized before Lok Adalats with full court-enforceable validity.
            </p>
          </article>
        </div>

        <div className={styles.highlightBanner}>
          <h2 className={styles.bannerTitle}>Zero Hallucination Guarantee</h2>
          <p className={styles.bannerText}>
            Our AI models are strictly bounded by official State Gazettes and enacted statutes. If a dispute involves criminal violence, forged documents, or falls below our strict 0.60 confidence threshold, the AI immediately halts automated resolution and routes the parties directly to District Legal Services Authority (DLSA) panel advocates.
          </p>
        </div>
      </section>

      <TestimonialsSection />
      <ClosingCtaSection />
    </main>
  );
};
