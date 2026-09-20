import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import styles from './CaseStudy.module.css';

export const CartTrackObstruction: React.FC = () => {
  const revealRef = useScrollReveal();

  return (
    <main className={`container ${styles.page}`}>
      <div ref={revealRef}>
        <Link to="/work" className={styles.backLink}>
          ← Back to All Dispute Accords
        </Link>

        <div className={styles.badgeRow}>
          <span className={`${styles.badge} ${styles.badgeCategory}`}>Land & Demarcation</span>
          <span className={`${styles.badge} ${styles.badgeStatute}`}>Indian Easements Act §15</span>
          <span className={`${styles.badge} ${styles.badgeDialect}`}>Customary Way Intake</span>
          <span className={`${styles.badge} ${styles.badgeStatus}`}>Passage Restored</span>
        </div>

        <h1 className={styles.title}>
          Village Cart-Track Obstruction Accord
        </h1>

        <p className={styles.subhead}>
          50-year-old customary dirt rasta blocked with thorny hedges and barbed fencing, immobilizing tractor and harvest passage. ClearCase synthesized prescriptive easement statutes and brokered a formal 8-foot clearway accord.
        </p>

        <div className={styles.heroImageWrapper}>
          <img
            src="/images/proj-cart-track.jpg"
            alt="Village Cart-Track Obstruction Accord Case Study"
            className={styles.heroImage}
          />
        </div>

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Disputing Parties</span>
            <span className={styles.metaValue}>Balbir Singh Hooda vs. Hawa Singh Malik</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Jurisdiction</span>
            <span className={styles.metaValue}>Sampla Gram, Rohtak, Haryana</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Dialect & Intake</span>
            <span className={styles.metaValue}>Spoken Audio Intake (96% Confidence)</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Statutory Forum</span>
            <span className={styles.metaValue}>Gram Panchayat Adalat / CrPC §133 / Easements</span>
          </div>
        </div>

        <div className={styles.gridTwoCol}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>The Rural Grievance</span>
              <span className={styles.confidencePill}>Intake Verified</span>
            </div>
            <div className={styles.quoteBox}>
              "The neighbor erected barbed wire and thorny shrubs over an old village dirt track, blocking tractor and bullock cart access to our fields that farmers have used for fifty years."
            </div>
            <p className={styles.bodyText}>
              Customary village pathways (kacha rasta) frequently lack formal revenue registry entries, leaving them vulnerable to unilateral fencing by adjacent larger landholders during sowing seasons.
            </p>
            <p className={styles.bodyText}>
              Six adjoining tenant farmers were unable to move harvesters and threshing machinery. ClearCase intake organized testimony and mapped prescriptive easement usage history.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>Statutory Grounding & RAG Retrieval</span>
              <span className={styles.confidencePill}>0.93 Match</span>
            </div>
            <div className={styles.statuteBox}>
              <div className={styles.statuteName}>Indian Easements Act, 1882 — Section 15</div>
              <div className={styles.statuteSnippet}>
                "Protects open and peaceable enjoyment of customary agricultural access ways used for over twenty years without interruption as an easement of prescription."
              </div>
            </div>
            <div className={styles.statuteBox}>
              <div className={styles.statuteName}>Code of Criminal Procedure — Section 133</div>
              <div className={styles.statuteSnippet}>
                "Conditional order for removal of unlawful obstruction or nuisance from any way, river, or channel lawfully used by the public."
              </div>
            </div>
            <p className={styles.bodyText}>
              Clear legal grounding prevented the conflict from escalating into physical altercations or police FIR filings by framing an immediate mutual clearance plan.
            </p>
          </div>
        </div>

        <div className={styles.accordSection}>
          <h2 className={styles.cardTitle}>Three-Step Customary Way Clearance Accord</h2>
          <p className={styles.bodyText}>
            Framed with neutral Panchayat witness and recorded for electronic audit:
          </p>
          <div className={styles.accordSteps}>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Immediate 48-Hour Fence Removal</div>
                <div className={styles.stepDesc}>
                  The respondent agrees to dismantle all barbed wire fencing and clear thorny vegetation to re-establish an unobstructed 8-foot wide agricultural corridor within 48 hours.
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Exclusive Agricultural Access Undertaking</div>
                <div className={styles.stepDesc}>
                  Both parties agree that the corridor shall be utilized solely for agricultural implements, tractors, cattle, and harvesters, without commercial dumping or permanent structures.
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Panchayat Stone Demarcation & Neutral Log</div>
                <div className={styles.stepDesc}>
                  The village Panchayat will set permanent stone markers delineating the corridor borders, permanently ending the recurring seasonal feud.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.blockchainCard}>
          <div className={styles.blockchainHeader}>
            <span className={styles.blockchainTag}>Polygon Amoy Proof of Settlement</span>
            <span className={styles.cedarStamp}>Cedar AuthZ: PERMIT_EASEMENT_ACCORD</span>
          </div>
          <div className={styles.hashText}>
            SHA-256 Hash: 0x93f41270b24e8a7199c9efd23819024ea57c913508f7db0183acbd84610214a1
          </div>
          <div className={styles.hashText}>
            Transaction Block #5501932 · Timestamp: 2026-03-15 14:15 UTC · Immutably Anchored
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
