import React, { useState } from 'react';
import styles from './Mediator.module.css';
import { ThreeDIcon } from '@/components/common/ThreeDIcon';

interface EscalatedDispute {
  id: string;
  title: string;
  district: string;
  village: string;
  intakeDate: string;
  status: string;
  triggerReason: string;
  petitioner: string;
  respondent: string;
  aiSuggestedDraft: string;
  mediatorNotes: string;
}

const INITIAL_QUEUE: EscalatedDispute[] = [
  {
    id: 'CASE-2026-VNS-701',
    title: 'Disputed Hereditary Title & Unregistered Partition',
    district: 'Varanasi',
    village: 'Mauza Shivpur',
    intakeDate: '2026-09-20',
    status: 'ESCALATED',
    triggerReason:
      'Statutory confidence score 0.52 is below 0.60 threshold. Dispute involves contested hereditary title, testamentary validity, and allegations of document forgery requiring spot verification.',
    petitioner: 'Ram Lakhan Yadav',
    respondent: 'Kailash Nath Yadav',
    aiSuggestedDraft:
      '1. Both family branches submit original 1998 family partition memorandum to the Gram Panchayat.\n2. Revenue Lekhpal inspects ancestral khatauni entry 142.\n3. Mutation of contested 0.45 Hectare is stayed pending verification.',
    mediatorNotes: '',
  },
  {
    id: 'CASE-2026-VNS-889',
    title: 'Predatory Usury & Land Document Withholding',
    district: 'Varanasi',
    village: 'Pindra Khurd',
    intakeDate: '2026-09-20',
    status: 'ESCALATED',
    triggerReason:
      'Exploitation Alert: Predatory loan interest exceeding 36% compound monthly rate and withholding of registry papers detected by AI safety gate.',
    petitioner: 'Deena Nath Verma',
    respondent: 'Seth Babulal (Moneylender)',
    aiSuggestedDraft:
      '1. Moneylender immediately returns original registration deeds.\n2. Principal loan of ₹5,000 to be settled with statutory simple interest capped at 12% per annum under Usurious Loans Act.\n3. Disbursal witnessed by DLSA paralegal.',
    mediatorNotes: '',
  },
  {
    id: 'CASE-2026-SNP-304',
    title: 'Tubewell Watercourse Blockade & Threat of Grievous Hurt',
    district: 'Sonipat',
    village: 'Gohana',
    intakeDate: '2026-09-19',
    status: 'ESCALATED',
    triggerReason:
      'Criminal violence alert: Non-compoundable bodily altercation threat requires human conciliator and police liaison under Legal Services Authorities Act Section 19.',
    petitioner: 'Sukhbir Singh',
    respondent: 'Balraj Malik',
    aiSuggestedDraft:
      '1. Both parties refrain from altercations over tubewell channel.\n2. Irrigation water schedule rotated alternately on 3-day shifts under Sarpanch supervision.',
    mediatorNotes: '',
  },
];

export const Mediator: React.FC = () => {
  const [activePersona, setActivePersona] = useState<'varanasi' | 'sonipat'>('varanasi');
  const [queue, setQueue] = useState<EscalatedDispute[]>(INITIAL_QUEUE);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(INITIAL_QUEUE[0].id);
  const [revisedDraft, setRevisedDraft] = useState<string>(INITIAL_QUEUE[0].aiSuggestedDraft);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedCase = queue.find((c) => c.id === selectedCaseId) || queue[0];

  // Cedar Authorization Evaluation
  const isAuthorized =
    (activePersona === 'varanasi' && selectedCase.district === 'Varanasi') ||
    (activePersona === 'sonipat' && selectedCase.district === 'Sonipat');

  const handleSelectCase = (c: EscalatedDispute) => {
    setSelectedCaseId(c.id);
    setRevisedDraft(c.aiSuggestedDraft);
    setSuccessMessage(null);
  };

  const handleApproveCase = () => {
    if (!isAuthorized) return;
    setQueue((prev) =>
      prev.map((item) =>
        item.id === selectedCaseId
          ? { ...item, status: 'MEDIATOR_APPROVED', aiSuggestedDraft: revisedDraft }
          : item
      )
    );
    setSuccessMessage(`Case ${selectedCaseId} successfully approved and transitioned to MEDIATOR_APPROVED!`);
  };

  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        <header className={styles.headerBlock}>
          <h1 className={styles.title}>Mediator Queue & Cedar AuthZ Portal</h1>
          <p className={styles.subtitle}>
            Review disputes flagged by AI safety escalation gates (contested titles, criminal violence, usurious debt). Evaluate fine-grained Cedar jurisdiction policies and issue binding conciliation revisions.
          </p>
        </header>

        {/* Cedar AuthZ Simulation Bar */}
        <section className={styles.authzBar} aria-label="Cedar ABAC Policy Evaluation">
          <div className={styles.authzPersonaGroup}>
            <span className={styles.authzLabel}>Active Mediator Persona:</span>
            <button
              type="button"
              onClick={() => setActivePersona('varanasi')}
              className={`${styles.personaBtn} ${activePersona === 'varanasi' ? styles.personaBtnActive : ''}`}
            >
              mediator-varanasi-01 (Varanasi, UP)
            </button>
            <button
              type="button"
              onClick={() => setActivePersona('sonipat')}
              className={`${styles.personaBtn} ${activePersona === 'sonipat' ? styles.personaBtnActive : ''}`}
            >
              mediator-sonipat-01 (Sonipat, Haryana)
            </button>
          </div>

          <div>
            {isAuthorized ? (
              <span className={styles.decisionPillPermit}>
                ✓ Cedar Decision: PERMIT (In-Jurisdiction Authorized)
              </span>
            ) : (
              <span className={styles.decisionPillDeny}>
                ✕ Cedar Decision: DENY (Cross-District Forbidden - HTTP 403)
              </span>
            )}
          </div>
        </section>

        {/* Queue Grid */}
        <div className={styles.queueGrid}>
          {/* Left Column: Escalated Cases Queue */}
          <aside className={styles.caseListCard} aria-label="Escalated Cases List">
            <div className={styles.listHeader}>
              Escalated Disputes Queue ({queue.length})
            </div>

            {queue.map((c) => {
              const isSelected = c.id === selectedCaseId;
              return (
                <div
                  key={c.id}
                  onClick={() => handleSelectCase(c)}
                  role="button"
                  tabIndex={0}
                  className={`${styles.caseItem} ${isSelected ? styles.caseItemActive : ''}`}
                >
                  <div className={styles.caseItemTitle}>{c.title}</div>
                  <div className={styles.caseItemMeta}>
                    <span>{c.district} ({c.village})</span>
                    <span className={styles.statusPill}>{c.status}</span>
                  </div>
                </div>
              );
            })}
          </aside>

          {/* Right Column: Case Review & Override Desk */}
          <section className={styles.detailCard} aria-label="Case Conciliation Desk">
            <div className={styles.detailHeader}>
              <div>
                <span className={styles.detailCaseId}>CASE ID: {selectedCase.id}</span>
                <h2 className={styles.detailTitle}>{selectedCase.title}</h2>
              </div>
              <span className={styles.statusPill}>{selectedCase.status}</span>
            </div>

            <div className={styles.partyRow}>
              <div className={styles.partyBox}>
                <div className={styles.partyLabel}>Petitioner</div>
                <strong>{selectedCase.petitioner}</strong>
              </div>
              <div className={styles.partyBox}>
                <div className={styles.partyLabel}>Respondent</div>
                <strong>{selectedCase.respondent}</strong>
              </div>
            </div>

            {/* Escalation Trigger Alert */}
            <div className={styles.escalationAlert}>
              <div className={styles.escalationAlertTitle}>
                <ThreeDIcon name="siren" size={18} />
                <span>AI Safety Gate Trigger Reason</span>
              </div>
              <p className={styles.escalationAlertText}>{selectedCase.triggerReason}</p>
            </div>

            {/* Editable Settlement Proposal */}
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="mediator-draft" className={styles.textareaLabel}>
                Mediator Accord Draft (Review & Amend):
              </label>
              <textarea
                id="mediator-draft"
                value={revisedDraft}
                disabled={!isAuthorized}
                onChange={(e) => setRevisedDraft(e.target.value)}
                className={styles.textarea}
                rows={5}
              />
            </div>

            {successMessage && (
              <div className={styles.successBox}>
                ✓ {successMessage}
              </div>
            )}

            <div className={styles.authStatusRow}>
              <span
                className={styles.authStatusText}
                style={{ color: isAuthorized ? '#059669' : '#dc2626' }}
              >
                {isAuthorized
                  ? '✓ Authorized to review and approve dispute accord'
                  : '✕ Access Denied: You cannot modify cases outside your jurisdiction'}
              </span>

              <button
                type="button"
                onClick={handleApproveCase}
                disabled={!isAuthorized || selectedCase.status === 'MEDIATOR_APPROVED'}
                className={styles.approveBtn}
              >
                {selectedCase.status === 'MEDIATOR_APPROVED'
                  ? '✓ Accord Approved'
                  : 'Approve Revised Settlement Draft →'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
