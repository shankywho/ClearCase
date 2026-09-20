import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import styles from './CaseStudy.module.css';

export const PastureEncroachment: React.FC = () => {
  const revealRef = useScrollReveal();

  return (
    <main className={`container ${styles.page}`}>
      <div ref={revealRef}>
        <Link to="/work" className={styles.backLink}>
          ← Back to All Dispute Accords
        </Link>

        <div className={styles.badgeRow}>
          <span className={`${styles.badge} ${styles.badgeCategory}`}>Land & Demarcation</span>
          <span className={`${styles.badge} ${styles.badgeStatute}`}>UP Revenue Code §67</span>
          <span className={`${styles.badge} ${styles.badgeDialect}`}>Gram Sabha Intake</span>
          <span className={`${styles.badge} ${styles.badgeStatus}`}>Voluntary Vacation</span>
        </div>

        <h1 className={styles.title}>
          Gram Sabha Pasture Encroachment Accord
        </h1>

        <p className={styles.subhead}>
          Private barbed wire fencing extended across 1.2 acres of notified communal grazing pasture (Charagah). ClearCase referenced Section 67 eviction liabilities and brokered voluntary clearance, averting revenue court penalties.
        </p>

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Disputing Parties</span>
            <span className={styles.metaValue}>Ballia Gram Sabha vs. Devendra Nath Misra</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Jurisdiction</span>
            <span className={styles.metaValue}>Mauza Bairia, Ballia, Uttar Pradesh</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Dialect & Intake</span>
            <span className={styles.metaValue}>Spoken Audio Testimony (94% Confidence)</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Statutory Forum</span>
            <span className={styles.metaValue}>Gram Sabha Council / UP Revenue Code §67</span>
          </div>
        </div>

        <div className={styles.gridTwoCol}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>The Rural Grievance</span>
              <span className={styles.confidencePill}>Intake Verified</span>
            </div>
            <div className={styles.quoteBox}>
              "Private cultivation and thorny fencing extended into notified Gram Sabha public grazing land, blocking 120 village cattle from the common watering pond."
            </div>
            <p className={styles.bodyText}>
              Communal pastures (charagah) and threshing grounds (khalihan) are critical lifelines for landless pastoralists and smallholders. Gradual creeping encroachment by influential landowners often triggers severe community friction.
            </p>
            <p className={styles.bodyText}>
              The Gram Sabha Land Management Committee convened through the ClearCase portal to document historical cadastre coordinates before formal Tehsildar eviction summons were issued.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>Statutory Grounding & RAG Retrieval</span>
              <span className={styles.confidencePill}>0.93 Match</span>
            </div>
            <div className={styles.statuteBox}>
              <div className={styles.statuteName}>Uttar Pradesh Revenue Code, 2006 — Section 67</div>
              <div className={styles.statuteSnippet}>
                "Assistant Collector may order summary eviction and impose compensation damages up to market value against any person wrongfully occupying Gram Sabha land."
              </div>
            </div>
            <div className={styles.statuteBox}>
              <div className={styles.statuteName}>Supreme Court Ruling (Jagpal Singh vs. State of Punjab)</div>
              <div className={styles.statuteSnippet}>
                "Mandates state governments and panchayats to protect common village water bodies, pastures, and tracks from private usurpation."
              </div>
            </div>
            <p className={styles.bodyText}>
              Confronted with imminent Section 67 damage recovery, the respondent chose amicable voluntary retreat rather than facing police-backed bulldozing and heavy fiscal penalties.
            </p>
          </div>
        </div>

        <div className={styles.accordSection}>
          <h2 className={styles.cardTitle}>Three-Step Pasture Restoration Accord</h2>
          <p className={styles.bodyText}>
            Framed with Gram Sabha executive body witness and recorded for electronic audit:
          </p>
          <div className={styles.accordSteps}>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Voluntary 72-Hour Fence Demolition</div>
                <div className={styles.stepDesc}>
                  The landholder agrees to dismantle all private barbed wire fencing and remove private structures from the 1.2-acre communal grazing parcel within 72 hours.
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Waiver of Penal Damages & Court Actions</div>
                <div className={styles.stepDesc}>
                  In consideration of immediate voluntary surrender, the Gram Sabha Land Management Committee drops all formal Section 67 penal damages and revenue court petitions.
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Permanent Boundary Pillar Demarcation</div>
                <div className={styles.stepDesc}>
                  The Village Lekhpal and Gram Pradhan supervise the installation of permanent reinforced concrete boundary markers, safeguarding the pasture permanently.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.blockchainCard}>
          <div className={styles.blockchainHeader}>
            <span className={styles.blockchainTag}>Polygon Amoy Proof of Settlement</span>
            <span className={styles.cedarStamp}>Cedar AuthZ: PERMIT_PASTURE_RESTORATION</span>
          </div>
          <div className={styles.hashText}>
            SHA-256 Hash: 0x1f92e84c502b74a91942183c07ea88f912e9b8841029c78234190cba78432a10
          </div>
          <div className={styles.hashText}>
            Transaction Block #5521903 · Timestamp: 2026-03-16 15:10 UTC · Immutably Anchored
          </div>
        </div>

        <div className={styles.buttonRow}>
          <Link to="/work" className="btn-secondary">
            ← Explore All Case Studies
          </Link>
          <Link to="/contact" className="btn-primary">
            Deploy Mesh in Your Tehsil →
          </Link>
        </div>
      </div>
    </main>
  );
};
