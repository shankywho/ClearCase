import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import styles from './CaseStudy.module.css';

export const TubewellWatercourse: React.FC = () => {
  const revealRef = useScrollReveal();

  return (
    <main className={`container ${styles.page}`}>
      <div ref={revealRef}>
        <Link to="/work" className={styles.backLink}>
          ← Back to All Dispute Accords
        </Link>

        <div className={styles.badgeRow}>
          <span className={`${styles.badge} ${styles.badgeCategory}`}>Water & Rights</span>
          <span className={`${styles.badge} ${styles.badgeStatute}`}>Easements Act §15</span>
          <span className={`${styles.badge} ${styles.badgeDialect}`}>Dialect Voice Intake</span>
          <span className={`${styles.badge} ${styles.badgeStatus}`}>Watercourse Restored</span>
        </div>

        <h1 className={styles.title}>
          Tubewell Irrigation Watercourse Accord
        </h1>

        <p className={styles.subhead}>
          Unilateral severance of a shared irrigation watercourse during critical summer paddy transplantation. ClearCase matched prescriptive easement provisions and structured an audited rotational pumping agreement.
        </p>

        <div className={styles.heroImageWrapper}>
          <img
            src="/images/proj-tubewell-sharing.jpg"
            alt="Tubewell Irrigation Watercourse Accord Case Study"
            className={styles.heroImage}
          />
        </div>

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Disputing Parties</span>
            <span className={styles.metaValue}>Maheshwar Dayal vs. Raghuraj Tyagi</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Jurisdiction</span>
            <span className={styles.metaValue}>Mauza Siyana, Bulandshahr, Uttar Pradesh</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Dialect & Intake</span>
            <span className={styles.metaValue}>Spoken Audio Intake (95% Confidence)</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Statutory Forum</span>
            <span className={styles.metaValue}>Panchayat Water Committee / UP Revenue §25</span>
          </div>
        </div>

        <div className={styles.gridTwoCol}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>The Rural Grievance</span>
              <span className={styles.confidencePill}>Intake Verified</span>
            </div>
            <div className={styles.quoteBox}>
              "For the past 15 years, an irrigation watercourse from the neighbor's tubewell has supplied my field. This season his son severed the channel and refused water access even though diesel expenses were prepaid."
            </div>
            <p className={styles.bodyText}>
              In deep groundwater zones, single tubewells supply multiple fragmented agricultural holdings. Withholding water during heatwaves causes irreversible crop desiccation within 72 hours.
            </p>
            <p className={styles.bodyText}>
              Prepaid diesel charges of 1,400 rupees were acknowledged, but personal friction between families triggered the sudden blockage of the earthen channel (nali).
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>Statutory Grounding & RAG Retrieval</span>
              <span className={styles.confidencePill}>0.91 Match</span>
            </div>
            <div className={styles.statuteBox}>
              <div className={styles.statuteName}>Indian Easements Act, 1882 — Section 15</div>
              <div className={styles.statuteSnippet}>
                "Uninterrupted twenty-year enjoyment of irrigation water passage constitutes an absolute prescriptive easement."
              </div>
            </div>
            <div className={styles.statuteBox}>
              <div className={styles.statuteName}>Uttar Pradesh Revenue Code, 2006 — Section 25</div>
              <div className={styles.statuteSnippet}>
                "Provides summary remedy against wrongful obstruction of customary water channels across agricultural holdings with prompt Tehsildar injunction."
              </div>
            </div>
            <p className={styles.bodyText}>
              Section 25 provides summary restitution powers to the Tehsildar. ClearCase surfaced this remedy, enabling the parties to resolve the grievance voluntarily without official sanctions.
            </p>
          </div>
        </div>

        <div className={styles.accordSection}>
          <h2 className={styles.cardTitle}>Three-Step Irrigation Reconciliation Accord</h2>
          <p className={styles.bodyText}>
            Framed with neutral Panchayat witness and recorded for electronic audit:
          </p>
          <div className={styles.accordSteps}>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Immediate Channel Re-opening</div>
                <div className={styles.stepDesc}>
                  The tubewell owner agrees to immediately clear and reconnect the severed earthen channel, restoring uninhibited gravity flow to the petitioner's standing crops within 24 hours.
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Prepaid Fuel Hours Accounting</div>
                <div className={styles.stepDesc}>
                  The acknowledged prepaid fuel sum of 1,400 rupees is officially credited toward 18 verified hours of pumping during the ongoing paddy transplant cycle.
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Audited Rotational Schedule</div>
                <div className={styles.stepDesc}>
                  Both parties establish a weekly Tuesday/Friday water-sharing roster witnessed by the Village Panchayat Water Committee, preventing sudden unilateral cutoffs.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.blockchainCard}>
          <div className={styles.blockchainHeader}>
            <span className={styles.blockchainTag}>Polygon Amoy Proof of Settlement</span>
            <span className={styles.cedarStamp}>Cedar AuthZ: PERMIT_WATERCOURSE_ACCORD</span>
          </div>
          <div className={styles.hashText}>
            SHA-256 Hash: 0x76b251a39d84e031a57c126584288b209c15ff93aa128e461099d012176b92a4
          </div>
          <div className={styles.hashText}>
            Transaction Block #5507421 · Timestamp: 2026-03-15 16:30 UTC · Immutably Anchored
          </div>
        </div>

        <div className={styles.buttonRow}>
          <Link to="/work" className="btn-secondary">
            ← Explore All Case Studies
          </Link>
          <Link to="/pilot" className="btn-primary">
            Deploy Mesh in Your Tehsil →
          </Link>
        </div>
      </div>
    </main>
  );
};
