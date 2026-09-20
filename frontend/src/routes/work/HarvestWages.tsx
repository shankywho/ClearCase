import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import styles from './CaseStudy.module.css';

export const HarvestWages: React.FC = () => {
  const revealRef = useScrollReveal();

  return (
    <main className={`container ${styles.page}`}>
      <div ref={revealRef}>
        <Link to="/work" className={styles.backLink}>
          ← Back to All Dispute Accords
        </Link>

        <div className={styles.badgeRow}>
          <span className={`${styles.badge} ${styles.badgeCategory}`}>Labor & Wages</span>
          <span className={`${styles.badge} ${styles.badgeStatute}`}>Minimum Wages Act §20</span>
          <span className={`${styles.badge} ${styles.badgeDialect}`}>Awadhi Intake</span>
          <span className={`${styles.badge} ${styles.badgeStatus}`}>Disbursement Accord</span>
        </div>

        <h1 className={styles.title}>
          Agricultural Harvest Wages Conciliation
        </h1>

        <p className={styles.subhead}>
          15 days of intensive paddy harvesting wages withheld by an agricultural labor contractor. ClearCase captured Awadhi spoken testimony, referenced statutory minimum wage penalties, and finalized an enforceable disbursement schedule.
        </p>

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Disputing Parties</span>
            <span className={styles.metaValue}>Santosh Kumar Rawat vs. Balwant Singh (Contractor)</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Jurisdiction</span>
            <span className={styles.metaValue}>Rampur Gram, Ayodhya, Uttar Pradesh</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Dialect & Intake</span>
            <span className={styles.metaValue}>Spoken Awadhi Audio (94% Confidence)</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Statutory Forum</span>
            <span className={styles.metaValue}>Panchayat Labor Conciliation / Sec 20 MWA</span>
          </div>
        </div>

        <div className={styles.gridTwoCol}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>The Rural Grievance</span>
              <span className={styles.confidencePill}>Intake Verified</span>
            </div>
            <div className={styles.quoteBox}>
              "I worked continuously for fifteen days harvesting paddy in the contractor's fields. An outstanding balance of 3,600 rupees remains unpaid; upon asking, he said he would pay during the next harvest season and abused me."
            </div>
            <p className={styles.bodyText}>
              Seasonal agricultural workers frequently lack written contracts and are subject to unilateral payment deferrals across crop cycles.
            </p>
            <p className={styles.bodyText}>
              Fearing retaliation or complete default if left until the next season, the worker spoke into the ClearCase kiosk operated by the local Para-Legal Volunteer.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>Statutory Grounding & RAG Retrieval</span>
              <span className={styles.confidencePill}>0.91 Match</span>
            </div>
            <div className={styles.statuteBox}>
              <div className={styles.statuteName}>Minimum Wages Act, 1948 — Section 20</div>
              <div className={styles.statuteSnippet}>
                "Empowers the designated authority or Panchayat conciliator to hear claims regarding delayed or non-payment of agricultural wages with compensation up to ten times the balance."
              </div>
            </div>
            <div className={styles.statuteBox}>
              <div className={styles.statuteName}>Minimum Wages Act, 1948 — Section 12</div>
              <div className={styles.statuteSnippet}>
                "Employer must pay wages at notified rates without unauthorized deferral or deductions."
              </div>
            </div>
            <p className={styles.bodyText}>
              By highlighting Section 20 penalty exposure (up to 10x compensation before the labor court), both parties chose prompt amicable conciliation rather than protracted litigation.
            </p>
          </div>
        </div>

        <div className={styles.accordSection}>
          <h2 className={styles.cardTitle}>Three-Step Binding Wage Disbursement Accord</h2>
          <p className={styles.bodyText}>
            Framed with neutral Panchayat witness and recorded for electronic audit:
          </p>
          <div className={styles.accordSteps}>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Immediate Electronic Bank Transfer</div>
                <div className={styles.stepDesc}>
                  The contractor agrees to disburse the entire outstanding balance of 3,600 rupees directly to the worker's bank account via UPI within 7 calendar days.
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Panchayat Witness Attestation</div>
                <div className={styles.stepDesc}>
                  Payment receipt and confirmation SMS shall be verified and co-signed by the Gram Panchayat Pradhan or designated labor welfare conciliator.
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Full & Final Discharge Without Prejudice</div>
                <div className={styles.stepDesc}>
                  Upon confirmed receipt of 3,600 rupees, all claims regarding the Kharif harvesting wages stand permanently discharged without penalty or blacklisting for future seasonal employment.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.blockchainCard}>
          <div className={styles.blockchainHeader}>
            <span className={styles.blockchainTag}>Polygon Amoy Proof of Settlement</span>
            <span className={styles.cedarStamp}>Cedar AuthZ: PERMIT_WAGE_DISBURSEMENT</span>
          </div>
          <div className={styles.hashText}>
            SHA-256 Hash: 0x4d29a1b63e847c92e705bfa813d98ef732b1156829c41793a38210f9e15642a8
          </div>
          <div className={styles.hashText}>
            Transaction Block #5498821 · Timestamp: 2026-03-15 09:41 UTC · Immutably Anchored
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
