import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import styles from './CaseStudy.module.css';

export const SharecroppingDivision: React.FC = () => {
  const revealRef = useScrollReveal();

  return (
    <main className={`container ${styles.page}`}>
      <div ref={revealRef}>
        <Link to="/work" className={styles.backLink}>
          ← Back to All Dispute Accords
        </Link>

        <div className={styles.badgeRow}>
          <span className={`${styles.badge} ${styles.badgeCategory}`}>Tenancy & Lease</span>
          <span className={`${styles.badge} ${styles.badgeStatute}`}>Model Tenancy Code §9</span>
          <span className={`${styles.badge} ${styles.badgeDialect}`}>Maithili Voice Intake</span>
          <span className={`${styles.badge} ${styles.badgeStatus}`}>Equitable Split Achieved</span>
        </div>

        <h1 className={styles.title}>
          Sharecropping Crop-Share Division Accord
        </h1>

        <p className={styles.subhead}>
          Contested 50:50 sharecropping crop division and unseasonal input deductions across five bighas of paddy. ClearCase formulated an audited input cost sharing model, restoring equitable tenant compensation.
        </p>

        <div className={styles.heroImageWrapper}>
          <img
            src="/images/proj-sharecropping.jpg"
            alt="Sharecropping Crop-Share Division Accord Case Study"
            className={styles.heroImage}
          />
        </div>

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Disputing Parties</span>
            <span className={styles.metaValue}>Laxman Mandal (Bataidar) vs. Janardan Jha (Landlord)</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Jurisdiction</span>
            <span className={styles.metaValue}>Kurhani Gram, Muzaffarpur, Bihar</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Dialect & Intake</span>
            <span className={styles.metaValue}>Spoken Maithili Audio (94% Confidence)</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Statutory Forum</span>
            <span className={styles.metaValue}>Gram Panchayat Adalat / Tenancy Code</span>
          </div>
        </div>

        <div className={styles.gridTwoCol}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>The Rural Grievance</span>
              <span className={styles.confidencePill}>Intake Verified</span>
            </div>
            <div className={styles.quoteBox}>
              "I cultivated paddy on five bighas of land under a 50-50 sharecropping agreement. After harvest, the landlord demands deducting the entire fertilizer and seed cost solely from my share and refuses to release my half."
            </div>
            <p className={styles.bodyText}>
              Batai (sharecropping) is rarely documented by written contract in eastern India, leaving informal tenant farmers vulnerable to post-harvest deductions when fertilizer prices spike.
            </p>
            <p className={styles.bodyText}>
              With 48 quintals of threshed grain locked at the village godown, the tenant faced imminent family debt. ClearCase recorded the spoken testimony at the local Panchayat kiosk.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>Statutory Grounding & RAG Retrieval</span>
              <span className={styles.confidencePill}>0.89 Match</span>
            </div>
            <div className={styles.statuteBox}>
              <div className={styles.statuteName}>Model Agricultural Land Leasing Act — Section 9</div>
              <div className={styles.statuteSnippet}>
                "Operational input costs are borne equally or as agreed; produce is divided net of certified joint expenses without unilateral penalties on the cultivator."
              </div>
            </div>
            <div className={styles.statuteBox}>
              <div className={styles.statuteName}>Bihar Tenancy Act — Section 32</div>
              <div className={styles.statuteSnippet}>
                "Produce division on shared cultivation mandates equitable accounting of certified variable inputs prior to final partition."
              </div>
            </div>
            <p className={styles.bodyText}>
              Clear statutory guidance on input apportionment removed subjective posturing, allowing both sides to audit genuine receipts without litigation.
            </p>
          </div>
        </div>

        <div className={styles.accordSection}>
          <h2 className={styles.cardTitle}>Three-Step Equitable Division Accord</h2>
          <p className={styles.bodyText}>
            Framed with neutral Panchayat witness and recorded for electronic audit:
          </p>
          <div className={styles.accordSteps}>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Verified Input Expenditure Equalization</div>
                <div className={styles.stepDesc}>
                  Both parties verify the total fertilizer and seed expenditure of 6,500 rupees, agreeing that this expense shall be shared equally (3,250 rupees each) from final crop sale proceeds.
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>50-50 Physical Partition of Harvest</div>
                <div className={styles.stepDesc}>
                  The 48 quintals of threshed paddy are partitioned equally (24 quintals each) at the village godown under the supervision of the Gram Panchayat.
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Written Future Tenancy Registration</div>
                <div className={styles.stepDesc}>
                  Both parties agree to execute a standard written lease terms agreement on ClearCase prior to the upcoming winter wheat sowing season.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.blockchainCard}>
          <div className={styles.blockchainHeader}>
            <span className={styles.blockchainTag}>Polygon Amoy Proof of Settlement</span>
            <span className={styles.cedarStamp}>Cedar AuthZ: PERMIT_SHARECROPPING_ACCORD</span>
          </div>
          <div className={styles.hashText}>
            SHA-256 Hash: 0x5a189f21e07b8cd34a179e8210bf9e348914b104928e1215ab74320146ff9c02
          </div>
          <div className={styles.hashText}>
            Transaction Block #5512004 · Timestamp: 2026-03-16 08:20 UTC · Immutably Anchored
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
