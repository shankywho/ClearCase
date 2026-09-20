import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import styles from './CaseStudy.module.css';

export const CommercialShopTenancy: React.FC = () => {
  const revealRef = useScrollReveal();

  return (
    <main className={`container ${styles.page}`}>
      <div ref={revealRef}>
        <Link to="/work" className={styles.backLink}>
          ← Back to All Dispute Accords
        </Link>

        <div className={styles.badgeRow}>
          <span className={`${styles.badge} ${styles.badgeCategory}`}>Tenancy & Lease</span>
          <span className={`${styles.badge} ${styles.badgeStatute}`}>Tenancy Act 2021 §8</span>
          <span className={`${styles.badge} ${styles.badgeDialect}`}>Bazaar Audio Intake</span>
          <span className={`${styles.badge} ${styles.badgeStatus}`}>Eviction Shielded</span>
        </div>

        <h1 className={styles.title}>
          Commercial Village Shop Tenancy Accord
        </h1>

        <p className={styles.subhead}>
          Arbitrary 75% rent escalation and summary eviction threat targeting a rural grocery stallholder in Pipraich Mandi. ClearCase matched statutory commercial rent ceiling guidelines, producing a signed three-year lease covenant.
        </p>

        <div className={styles.heroImageWrapper}>
          <img
            src="/images/proj-shop-tenancy.jpg"
            alt="Commercial Village Shop Tenancy Accord Case Study"
            className={styles.heroImage}
          />
        </div>

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Disputing Parties</span>
            <span className={styles.metaValue}>Dinesh Chandra Gupta vs. Kedarnath Tiwari (Landlord)</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Jurisdiction</span>
            <span className={styles.metaValue}>Pipraich Mandi, Gorakhpur, Uttar Pradesh</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Dialect & Intake</span>
            <span className={styles.metaValue}>Spoken Audio Testimony (95% Confidence)</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Statutory Forum</span>
            <span className={styles.metaValue}>Mandi Vyapar Mandal / Urban Tenancy Act</span>
          </div>
        </div>

        <div className={styles.gridTwoCol}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>The Rural Grievance</span>
              <span className={styles.confidencePill}>Intake Verified</span>
            </div>
            <div className={styles.quoteBox}>
              "I have been operating a grocery shop in the bazaar for five years. The owner is suddenly demanding a rent increase from 2,000 to 3,500 rupees, threatening to throw out my stock and lock the shop tomorrow morning if refused."
            </div>
            <p className={styles.bodyText}>
              Informal commercial tenants in rural market yards (mandis) are frequently exposed to unilateral lock-outs when land valuations rise, with no written contracts to show court injunctions.
            </p>
            <p className={styles.bodyText}>
              Facing imminent inventory destruction, the shopkeeper submitted recorded testimony through the local market committee's digital kiosk.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>Statutory Grounding & RAG Retrieval</span>
              <span className={styles.confidencePill}>0.88 Match</span>
            </div>
            <div className={styles.statuteBox}>
              <div className={styles.statuteName}>UP Regulation of Urban Premises Tenancy Act, 2021 — Section 8</div>
              <div className={styles.statuteSnippet}>
                "Prohibits unilateral or arbitrary rent escalation exceeding statutory limits (maximum 7% annual revision for commercial premises without substantial structural improvements)."
              </div>
            </div>
            <div className={styles.statuteBox}>
              <div className={styles.statuteName}>Premises Tenancy Act, 2021 — Section 21</div>
              <div className={styles.statuteSnippet}>
                "Prohibits summary or forceful eviction without due process and minimum thirty days' written notice."
              </div>
            </div>
            <p className={styles.bodyText}>
              ClearCase grounded both parties on legal limits, clarifying that summary lockout constitutes illegal dispossession while validating reasonable inflation adjustments.
            </p>
          </div>
        </div>

        <div className={styles.accordSection}>
          <h2 className={styles.cardTitle}>Three-Step Fair Commercial Tenancy Accord</h2>
          <p className={styles.bodyText}>
            Framed with Mandi Vyapar Mandal committee witness and recorded for electronic audit:
          </p>
          <div className={styles.accordSteps}>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Equitable 15% Rent Revision</div>
                <div className={styles.stepDesc}>
                  Both parties agree to revise the monthly rent from 2,000 to 2,300 rupees per month, reflecting statutory cost-of-living adjustments rather than speculative escalation.
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Eviction Shield & 30-Day Mandatory Notice</div>
                <div className={styles.stepDesc}>
                  The landlord undertakes not to disconnect power, block customer access, or execute summary lock-outs, agreeing to provide 30 days formal notice prior to any future tenancy changes.
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Timely Payment Undertaking</div>
                <div className={styles.stepDesc}>
                  The tenant undertakes to pay rent via UPI before the 7th of every calendar month with automated digital receipts lodged in the ClearCase ledger.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.blockchainCard}>
          <div className={styles.blockchainHeader}>
            <span className={styles.blockchainTag}>Polygon Amoy Proof of Settlement</span>
            <span className={styles.cedarStamp}>Cedar AuthZ: PERMIT_LEASE_ACCORD</span>
          </div>
          <div className={styles.hashText}>
            SHA-256 Hash: 0x6e834b92c109f5832a81907cb3e4912095f128c773a4b601e839201476d0124a
          </div>
          <div className={styles.hashText}>
            Transaction Block #5517890 · Timestamp: 2026-03-16 12:45 UTC · Immutably Anchored
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
