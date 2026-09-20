import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import styles from './CaseStudy.module.css';

export const LandDemarcation: React.FC = () => {
  const revealRef = useScrollReveal();

  return (
    <main className={`container ${styles.page}`}>
      <div ref={revealRef}>
        <Link to="/work" className={styles.backLink}>
          ← Back to All Dispute Accords
        </Link>

        <div className={styles.badgeRow}>
          <span className={`${styles.badge} ${styles.badgeCategory}`}>Land & Demarcation</span>
          <span className={`${styles.badge} ${styles.badgeStatute}`}>UP Revenue Code §24</span>
          <span className={`${styles.badge} ${styles.badgeDialect}`}>Bhojpuri Intake</span>
          <span className={`${styles.badge} ${styles.badgeStatus}`}>Consent Achieved</span>
        </div>

        <h1 className={styles.title}>
          Agricultural Land Boundary Demarcation
        </h1>

        <p className={styles.subhead}>
          Boundary ridge trimmed by two feet during wheat sowing in Mauza Shivpur. ClearCase processed vernacular voice testimony, matched Section 24 demarcation statutes, and framed a mutual stone boundary accord within 48 hours.
        </p>

        <div className={styles.heroImageWrapper}>
          <img
            src="/images/proj-land-demarcation.jpg"
            alt="Agricultural Land Boundary Demarcation Case Study"
            className={styles.heroImage}
          />
        </div>

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Disputing Parties</span>
            <span className={styles.metaValue}>Ram Lakhan Yadav vs. Harish Chandra Singh</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Jurisdiction</span>
            <span className={styles.metaValue}>Mauza Shivpur, Varanasi, Uttar Pradesh</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Dialect & Intake</span>
            <span className={styles.metaValue}>Spoken Bhojpuri Audio (96% Confidence)</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Statutory Forum</span>
            <span className={styles.metaValue}>Panchayat Adalat / Section 89 CPC</span>
          </div>
        </div>

        <div className={styles.gridTwoCol}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>The Rural Grievance</span>
              <span className={styles.confidencePill}>Intake Verified</span>
            </div>
            <div className={styles.quoteBox}>
              "The neighboring landowner cut down the old boundary ridge and encroached two feet into my field during wheat sowing, claiming the land belongs to them."
            </div>
            <p className={styles.bodyText}>
              A 14-year neighboring tenure dispute flared after monsoonal rains washed out traditional earthen markers. Both landholders asserted title over a 2-foot strip along Khasra plot boundaries 142 and 143.
            </p>
            <p className={styles.bodyText}>
              Previous attempts at informal panchayat resolution stalled due to lack of surveyor measurements. ClearCase intake captured the voice testimony at the village Common Service Centre.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>Statutory Grounding & RAG Retrieval</span>
              <span className={styles.confidencePill}>0.92 Match</span>
            </div>
            <div className={styles.statuteBox}>
              <div className={styles.statuteName}>Uttar Pradesh Revenue Code, 2006 — Section 24</div>
              <div className={styles.statuteSnippet}>
                "The Sub-Divisional Officer may demarcate boundaries of any holding or plot and settle any dispute concerning the same through on-spot measurement by the Lekhpal based on village Shajra map."
              </div>
            </div>
            <div className={styles.statuteBox}>
              <div className={styles.statuteName}>Uttar Pradesh Revenue Code, 2006 — Section 20</div>
              <div className={styles.statuteSnippet}>
                "Every tenure-holder shall be responsible for the maintenance and repair of the permanent boundary marks erected on his holding."
              </div>
            </div>
            <p className={styles.bodyText}>
              Statutory RAG extracted Section 24 provisions directly into English legal terms, guaranteeing that the proposed accord is legally binding and admissible before the Tehsildar.
            </p>
          </div>
        </div>

        <div className={styles.accordSection}>
          <h2 className={styles.cardTitle}>Three-Step Mutual Compromise Accord</h2>
          <p className={styles.bodyText}>
            Formulated under Section 89 CPC and the Mediation Act 2023. Signed electronically by both tenure-holders with Gram Pradhan attestation:
          </p>
          <div className={styles.accordSteps}>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Official Lekhpal On-Spot Demarcation</div>
                <div className={styles.stepDesc}>
                  Both parties agree to a joint spot demarcation by the local Village Lekhpal within 7 days, utilizing the official village Shajra cadastre map and metric chain survey.
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Joint Ridge Reconstruction & Shared Expense</div>
                <div className={styles.stepDesc}>
                  Both landholders agree to jointly reconstruct the permanent earthen boundary ridge (medh) along the surveyor coordinates, sharing labor and material costs equally.
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Crop Protection & Lok Adalat Enforceability</div>
                <div className={styles.stepDesc}>
                  Both parties undertake not to interfere with standing wheat crops and agree that this settlement will be formally recorded at the upcoming National Lok Adalat under Section 20.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.blockchainCard}>
          <div className={styles.blockchainHeader}>
            <span className={styles.blockchainTag}>Polygon Amoy Proof of Settlement</span>
            <span className={styles.cedarStamp}>Cedar AuthZ: PERMIT_SIGN_ACCORD</span>
          </div>
          <div className={styles.hashText}>
            SHA-256 Hash: 0x8f4c82b9a71e1d03c5b96781f1e9c20a44bf09c735d883b271d440ad819e64e1
          </div>
          <div className={styles.hashText}>
            Transaction Block #5492104 · Timestamp: 2026-03-14 11:28 UTC · Immutably Anchored
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
