import React, { useState } from 'react';
import styles from './Verify.module.css';
import { ThreeDIcon } from '@/components/common/ThreeDIcon';

interface VerifiedRecord {
  caseId: string;
  title: string;
  district: string;
  status: string;
  settlementHash: string;
  txHash: string;
  blockNumber: number;
  anchoredAt: string;
  auditTrail: {
    eventType: string;
    actor: string;
    timestamp: string;
    description: string;
  }[];
}

const SAMPLE_VERIFIED: VerifiedRecord = {
  caseId: 'CASE-2026-VNS-001',
  title: 'Agricultural Boundary Demarcation Accord (Plot 412/1)',
  district: 'Varanasi',
  status: 'ANCHORED',
  settlementHash: '0x14eeec557249ec5feb62914a0c2d64acc029b2ed75daa5d816e4ea9d603c319a',
  txHash: '0xb5a66e6f47ffd6f7191af3f15e2a467b9fffac97a9e9aec947bb631fa265da02',
  blockNumber: 15426502,
  anchoredAt: '2026-09-20T12:38:51Z',
  auditTrail: [
    {
      eventType: 'CASE_CREATED',
      actor: 'CITIZEN (+919876543210)',
      timestamp: '2026-09-20 12:30:10 UTC',
      description: 'Dispute registered via vernacular voice recording in Bhojpuri dialect.',
    },
    {
      eventType: 'PARTY_JOINED',
      actor: 'PETITIONER (Ram Lakhan Yadav)',
      timestamp: '2026-09-20 12:30:12 UTC',
      description: 'Disputant 1 confirmed intake and received 6-digit verification code.',
    },
    {
      eventType: 'AI_ANALYSIS_COMPLETED',
      actor: 'BEDROCK_GROQ_PIPELINE',
      timestamp: '2026-09-20 12:30:18 UTC',
      description: 'Statutory match: Uttar Pradesh Revenue Code Section 24. Confidence: 88%.',
    },
    {
      eventType: 'PARTY_JOINED',
      actor: 'RESPONDENT (Harish Chandra Singh)',
      timestamp: '2026-09-20 12:31:05 UTC',
      description: 'Disputant 2 joined via Exotel/Twilio vernacular IVR voice alert.',
    },
    {
      eventType: 'CONSENT_ACHIEVED',
      actor: 'DUAL_OTP_ENGINE',
      timestamp: '2026-09-20 12:35:40 UTC',
      description: 'Both parties authenticated with OTPs. Mutual accord covenants accepted.',
    },
    {
      eventType: 'ANCHORED_ON_CHAIN',
      actor: 'POLYGON_REGISTRY_RELAY',
      timestamp: '2026-09-20 12:38:51 UTC',
      description: 'Canonical SHA-256 hash anchored in Polygon Amoy Testnet Block #15426502.',
    },
  ],
};

export const Verify: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('CASE-2026-VNS-001');
  const [record, setRecord] = useState<VerifiedRecord | null>(SAMPLE_VERIFIED);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setRecord(SAMPLE_VERIFIED);
    }
  };

  const copyHash = () => {
    if (record) {
      navigator.clipboard.writeText(record.settlementHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        <header className={styles.headerBlock}>
          <h1 className={styles.title}>Settlement Authenticity Registry</h1>
          <p className={styles.subtitle}>
            Verify tamper-proof legal dispute settlements anchored on the Polygon blockchain. Inspect cryptographic SHA-256 audit hashes and chronological dispute consent histories.
          </p>
        </header>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className={styles.searchBar}>
          <ThreeDIcon name="search" size={20} />
          <input
            type="text"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Case ID (e.g. CASE-2026-VNS-001) or Polygon TxHash..."
          />
          <button type="submit" className={styles.searchBtn}>
            Verify On-Chain →
          </button>
        </form>

        {record && (
          <div>
            {/* Blockchain Receipt Card */}
            <section className={styles.card} aria-label="Anchored Dispute Record">
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.metaLabel}>VERIFIED ACCORD: {record.caseId}</div>
                  <h2 className={styles.cardTitle}>{record.title}</h2>
                </div>
                <span className={styles.statusVerified}>
                  ✓ IMMUTABLE (ANCHORED)
                </span>
              </div>

              <div className={styles.metaLabel} style={{ marginTop: '16px' }}>
                Canonical Settlement Hash (SHA-256):
              </div>
              <div className={styles.hashBox}>
                {record.settlementHash}
              </div>

              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <div className={styles.metaLabel}>Network</div>
                  <div className={styles.metaVal}>Polygon Amoy Testnet (Chain ID: 80002)</div>
                </div>
                <div className={styles.metaItem}>
                  <div className={styles.metaLabel}>Block Height</div>
                  <div className={styles.metaVal}>Block #{record.blockNumber}</div>
                </div>
                <div className={styles.metaItem}>
                  <div className={styles.metaLabel}>Registry Contract</div>
                  <div className={styles.metaVal}>0x435A9D...17C5B</div>
                </div>
                <div className={styles.metaItem}>
                  <div className={styles.metaLabel}>Confirmation Timestamp</div>
                  <div className={styles.metaVal}>{record.anchoredAt}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button type="button" onClick={copyHash} className={styles.copyBtn}>
                  {copied ? '✓ Hash Copied' : (
                    <>
                      <ThreeDIcon name="clipboard" size={16} />
                      <span>Copy SHA-256 Hash</span>
                    </>
                  )}
                </button>
                <a
                  href={`https://amoy.polygonscan.com/tx/${record.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.explorerLinkBtn}
                >
                  <ThreeDIcon name="blockchain" size={16} />
                  <span>View on Polygonscan Explorer ↗</span>
                </a>
              </div>

              <div style={{ marginTop: '14px', fontSize: '0.78rem', color: '#78716c', background: '#f5f5f4', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e7e5e4' }}>
                <strong>Note on Block Explorer:</strong> This transaction hash was generated in resilient offline demonstration mode (<code>MOCK_BLOCKCHAIN=true</code>). Polygonscan will only find hashes after a live broadcast with a funded testnet private key in <code>backend/.env</code>.
              </div>
            </section>

            {/* Chronological Audit Timeline */}
            <section className={styles.card} aria-label="Cryptographic Audit Trail">
              <h3 className={styles.cardTitle} style={{ marginBottom: '8px' }}>
                Tamper-Proof Audit Trail (Cedar Fine-Grained Log)
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#78716c', margin: '0 0 24px', lineHeight: 1.55 }}>
                Every milestone in the dispute conciliation lifecycle is cryptographically chained, hashed, and verifiable.
              </p>

              <div className={styles.timeline}>
                {record.auditTrail.map((ev, idx) => (
                  <div key={idx} className={styles.timelineItem}>
                    <div className={styles.timelineDot} />
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineHeader}>
                        <span>{ev.eventType}</span>
                        <span style={{ fontSize: '0.74rem', color: '#78716c', fontWeight: 500 }}>
                          {ev.timestamp}
                        </span>
                      </div>
                      <div className={styles.timelineActor}>Actor: {ev.actor}</div>
                      <div className={styles.timelineText}>{ev.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
};
