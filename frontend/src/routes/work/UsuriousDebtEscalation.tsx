import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import { ThreeDIcon } from '@/components/common/ThreeDIcon';
import styles from './CaseStudy.module.css';

export const UsuriousDebtEscalation: React.FC = () => {
  const revealRef = useScrollReveal();

  return (
    <main className={`container ${styles.page}`}>
      <div ref={revealRef}>
        <Link to="/work" className={styles.backLink}>
          ← Back to All Dispute Accords
        </Link>

        <div className={styles.badgeRow}>
          <span className={`${styles.badge} ${styles.badgeCategory}`}>Statutory Safety</span>
          <span className={`${styles.badge} ${styles.badgeStatute}`}>Money Lending Act §12</span>
          <span className={`${styles.badge} ${styles.badgeDialect}`}>Bhojpuri Voice Intake</span>
          <span className={`${styles.badge} ${styles.badgeEscalated}`}>Safety Gate: Escalated to DLSA</span>
        </div>

        <h1 className={styles.title}>
          Predatory Usury & Bond Escalation Case
        </h1>

        <p className={styles.subhead}>
          An informal medical loan of 20,000 rupees compounded to 100,000 rupees with unlawful seizure of government identity and land title documents. ClearCase coercion safety gate halted automated mediation and transferred the file to Legal Aid authorities.
        </p>

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Complainant & Respondent</span>
            <span className={styles.metaValue}>Ram Das Kol vs. Lala Murlidhar (Moneylender)</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Jurisdiction</span>
            <span className={styles.metaValue}>Chunar Tehsil, Mirzapur, Uttar Pradesh</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Dialect & Intake</span>
            <span className={styles.metaValue}>Spoken Bhojpuri Audio (95% Confidence)</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Action Taken</span>
            <span className={styles.metaValue}>Mediation Barred · DLSA Advocate Assigned</span>
          </div>
        </div>

        {/* Safety Gate Warning Box */}
        <div className={styles.escalationBox}>
          <div className={styles.escalationTitle}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <ThreeDIcon name="shield" size={22} /> Statutory Coercion Safety Gate Triggered
            </span>
          </div>
          <p className={styles.escalationDesc}>
            <strong>Exploitation Alert:</strong> Unlawful compounding interest of 60% per annum combined with coercive physical retention of citizen Aadhaar and Khatauni land deed documents violates Section 12 of the UP Regulation of Money Lending Act and Section 384 of the Indian Penal Code.
          </p>
          <p className={styles.escalationDesc} style={{ marginTop: '8px' }}>
            In accordance with the ClearCase zero-exploitation mandate, automated compromise formulation was immediately aborted. The case docket was securely dispatched to the District Legal Services Authority (DLSA) Mirzapur for pro-bono defense and penal recovery.
          </p>
        </div>

        <div className={styles.gridTwoCol}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>The Rural Grievance</span>
              <span className={styles.confidencePill}>Voice Intake</span>
            </div>
            <div className={styles.quoteBox}>
              "I borrowed 20,000 rupees from the local moneylender for my son's medical treatment. At 5% compounding monthly interest he now demands 100,000 rupees and refuses to return my land deed and Aadhaar card held hostage."
            </div>
            <p className={styles.bodyText}>
              Predatory moneylenders in rural belts frequently use informal debt spirals to trap smallholders and daily-wage laborers into generational bonded labor or coerced distress land sales.
            </p>
            <p className={styles.bodyText}>
              By confiscating original identity records, the lender rendered the petitioner incapable of accessing state welfare schemes or formal bank credit.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>Statutory Analysis & Prohibition Triggers</span>
              <span className={styles.confidencePill}>Critical Alert</span>
            </div>
            <div className={styles.statuteBox}>
              <div className={styles.statuteName}>UP Regulation of Money Lending Act, 1976 — Section 12</div>
              <div className={styles.statuteSnippet}>
                "Restricts maximum statutory interest on informal loans and strictly prohibits compounding; unlawful retention of identity documents is a cognizable statutory offense."
              </div>
            </div>
            <div className={styles.statuteBox}>
              <div className={styles.statuteName}>Legal Services Authorities Act, 1987 — Section 12</div>
              <div className={styles.statuteSnippet}>
                "Entitles marginalized citizens, agricultural laborers, and victims of extortion to free legal counsel and institutional representation."
              </div>
            </div>
            <p className={styles.bodyText}>
              ClearCase's Cedar authorization policies explicitly forbid mutual compromise generation when non-negotiable human rights violations or usury thresholds are crossed.
            </p>
          </div>
        </div>

        <div className={styles.accordSection}>
          <h2 className={styles.cardTitle}>Institutional Escalation & Protection Protocol</h2>
          <p className={styles.bodyText}>
            Instead of forcing an unjust financial compromise, ClearCase activated the four-stage emergency protection protocol:
          </p>
          <div className={styles.accordSteps}>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Immediate Automated Freeze</div>
                <div className={styles.stepDesc}>
                  All automated settlement draft generation on the ClearCase engine was disabled, preventing any coercive or predatory accord from receiving a cryptographic timestamp.
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Direct DLSA Legal Aid Transfer</div>
                <div className={styles.stepDesc}>
                  The complete vernacular audio log and statutory violation index were forwarded to the Mirzapur District Legal Services Authority Secretary with urgent priority status.
                </div>
              </div>
            </div>
            <div className={styles.stepRow}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Sub-Divisional Magistrate Notice for Document Recovery</div>
                <div className={styles.stepDesc}>
                  An automated statutory notification was transmitted to the Tehsildar and Sub-Divisional Magistrate to mandate the immediate return of the citizen's Aadhaar and land deed.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.blockchainCard}>
          <div className={styles.blockchainHeader}>
            <span className={styles.blockchainTag}>Polygon Amoy Audit Trail</span>
            <span className={styles.cedarStamp}>Cedar AuthZ: DENY_SETTLEMENT · ESCALATE_DLSA</span>
          </div>
          <div className={styles.hashText}>
            Escalation Incident Hash: 0x3d82f7109be4a819c902b45178da091564789012345bc78190246a819234bb72
          </div>
          <div className={styles.hashText}>
            Docket #DLSA-MZP-2026-0891 · Escalation Logged Immutably for Judicial Protection
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
