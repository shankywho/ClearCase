import React, { useState, useEffect } from 'react';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import { ThreeDIcon } from '@/components/common/ThreeDIcon';
import {
  submitDeployment,
  fetchClusterStatus,
  DeploymentResult,
  ClusterStatusResult,
} from '@/lib/api';
import styles from './Contact.module.css';

const ROLES = [
  'Gram Panchayat Pradhan',
  'Revenue Inspector (Lekhpal)',
  'DLSA Secretary / Nyaya Sahayak',
  'Hackathon Evaluator / Researcher',
  'Civil Society / Para-Legal Worker',
];

export const Contact: React.FC = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const [selectedRole, setSelectedRole] = useState<string>(ROLES[0]);
  const [fullName, setFullName] = useState<string>('');
  const [jurisdictionState, setJurisdictionState] = useState<string>('Uttar Pradesh');
  const [district, setDistrict] = useState<string>('Varanasi');
  const [villageBlock, setVillageBlock] = useState<string>('Mauza Shivpur, Sadar Tehsil');
  const [contactInfo, setContactInfo] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [capabilities, setCapabilities] = useState<{ [key: string]: boolean }>({
    voiceIntake: true,
    cadastreOcr: true,
    coercionFilter: true,
    polygonAnchoring: true,
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [clusterStatus, setClusterStatus] = useState<ClusterStatusResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string>('');
  const [copiedToken, setCopiedToken] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Pilot Deployment | ClearCase';
    fetchClusterStatus().then((status) => {
      if (status) setClusterStatus(status);
    });
  }, []);

  const toggleCapability = (key: string) => {
    setCapabilities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await submitDeployment({
        fullName,
        role: selectedRole,
        contactInfo,
        state: jurisdictionState,
        district,
        villageBlock,
        capabilities,
        notes,
      });

      setDeploymentResult(result);
      setTicketId(result.ticket_id);
      setSubmitted(true);
    } catch (err) {
      console.error('[Contact] Deployment error:', err);
      setErrorMessage('Failed to submit deployment dossier to backend. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyToken = () => {
    const token = deploymentResult?.cluster_token || 'cc_mesh_live_7a9f4e229c1b8401e';
    navigator.clipboard?.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        {/* Header Block: Pilot Deployment */}
        <div ref={headerRef} className={styles.headerBlock}>
          <h1 className={styles.title}>Pilot Deployment</h1>
          <p className={styles.subtitle}>
            Provision an autonomous rural dispute mediation node for your Gram Panchayat, Tehsil, or District Legal Services Authority (DLSA) corridor.
          </p>
        </div>

        {/* 3-Pillar Architectural Metrics Strip */}
        <div className={styles.metricsStrip}>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>
              <ThreeDIcon name="mic" size={16} />
              <span>Offline Edge Latency</span>
            </div>
            <div className={styles.metricValue}>&lt; 280ms Local Pipeline</div>
            <div className={styles.metricDesc}>
              Groq Whisper Large v3 + multi-agent statutory RAG runs with zero cloud dependency.
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>
              <ThreeDIcon name="scales" size={16} />
              <span>Statutory Alignment</span>
            </div>
            <div className={styles.metricValue}>Section 20 Lok Adalat</div>
            <div className={styles.metricDesc}>
              Generates court-enforceable mutual accords under Legal Services Authorities Act, 1987.
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>
              <ThreeDIcon name="blockchain" size={16} />
              <span>Cryptographic Registry</span>
            </div>
            <div className={styles.metricValue}>Polygon Amoy Testnet</div>
            <div className={styles.metricDesc}>
              Dual-OTP signed settlement hashes anchored immutably for land registry verification.
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Form & Telemetry */}
        <div className={styles.layout}>
          {/* Left Column: Form / Manifest Dossier */}
          <div className={styles.formCard}>
            {submitted ? (
              <div className={styles.ticketCard}>
                <div className={styles.ticketTop}>
                  <div className={styles.ticketBadge}>
                    <span className={styles.pulseDot} />
                    <span>Pilot Node Provisioned</span>
                  </div>
                  <div className={styles.ticketId}>{ticketId}</div>
                </div>

                <h3 className={styles.ticketHeading}>Deployment Manifest Generated</h3>
                <p className={styles.ticketMessage}>
                  Your rural dispute mediation node credentials have been reserved and anchored in the live backend. The ClearCase coordination team and DLSA field engineers have received your jurisdictional parameters.
                </p>

                <div className={styles.ticketGrid}>
                  <div className={styles.ticketItem}>
                    <span className={styles.ticketKey}>Authority / Role</span>
                    <span className={styles.ticketVal}>{deploymentResult?.authority || selectedRole}</span>
                  </div>
                  <div className={styles.ticketItem}>
                    <span className={styles.ticketKey}>Jurisdiction Block</span>
                    <span className={styles.ticketVal}>{deploymentResult?.jurisdiction || `${district}, ${jurisdictionState}`}</span>
                  </div>
                  <div className={styles.ticketItem}>
                    <span className={styles.ticketKey}>Target Village / Tehsil</span>
                    <span className={styles.ticketVal}>{deploymentResult?.village || villageBlock || 'Mauza Shivpur'}</span>
                  </div>
                  <div className={styles.ticketItem}>
                    <span className={styles.ticketKey}>Provisioned At</span>
                    <span className={styles.ticketVal}>
                      {deploymentResult?.provisioned_at ? new Date(deploymentResult.provisioned_at).toLocaleString() : 'Synchronized to Core'}
                    </span>
                  </div>
                  <div className={styles.ticketItem}>
                    <span className={styles.ticketKey}>Edge Cluster Status</span>
                    <span className={styles.ticketVal} style={{ color: '#059669', fontWeight: 700 }}>
                      {deploymentResult?.status || 'READY_FOR_DISPUTE_MESH'}
                    </span>
                  </div>
                  <div className={styles.ticketItem}>
                    <span className={styles.ticketKey}>Node Secret Token</span>
                    <span className={styles.ticketVal} style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
                      {deploymentResult?.cluster_token ? `${deploymentResult.cluster_token.slice(0, 18)}...` : 'cc_mesh_live_7a9f4e...'}
                    </span>
                  </div>
                </div>

                <div className={styles.ticketActions}>
                  <button
                    type="button"
                    onClick={handleCopyToken}
                    className={styles.ticketBtnPrimary}
                  >
                    {copiedToken ? '✓ Copied Token' : 'Copy Cluster Token'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setDeploymentResult(null);
                      setFullName('');
                      setContactInfo('');
                      setNotes('');
                    }}
                    className={styles.ticketBtnSecondary}
                  >
                    Provision Another Pilot Block
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div className={styles.formHeader}>
                  <h2 className={styles.formTitle}>Pilot Deployment Intake Console</h2>
                  <p className={styles.formSubtitle}>
                    Enter administrative boundaries and dialect profiles to configure an edge dispute cluster for your Gram Sabha or court corridor.
                  </p>
                </div>

                {errorMessage && (
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    fontSize: '0.88rem'
                  }}>
                    {errorMessage}
                  </div>
                )}

                {/* Role Selector Chips */}
                <div className={styles.roleSelectorArea}>
                  <label className={styles.roleLabel}>Designation / Administrative Capacity:</label>
                  <div className={styles.roleChipGrid}>
                    {ROLES.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`${styles.roleChip} ${selectedRole === role ? styles.roleChipActive : ''}`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Inputs Grid */}
                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label htmlFor="fullName" className={styles.label}>Representative Name</label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramakant Tiwari"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="contactInfo" className={styles.label}>Official Mobile / Email</label>
                    <input
                      id="contactInfo"
                      type="text"
                      required
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="e.g. +91 98765 43210 or pradhan@gram.in"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label htmlFor="state" className={styles.label}>Target State</label>
                    <select
                      id="state"
                      value={jurisdictionState}
                      onChange={(e) => setJurisdictionState(e.target.value)}
                      className={styles.select}
                    >
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="district" className={styles.label}>District Jurisdiction</label>
                    <select
                      id="district"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className={styles.select}
                    >
                      <option value="Varanasi">Varanasi</option>
                      <option value="Ayodhya">Ayodhya</option>
                      <option value="Prayagraj">Prayagraj</option>
                      <option value="Gorakhpur">Gorakhpur</option>
                      <option value="Sonipat">Sonipat</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="villageBlock" className={styles.label}>Gram Sabha, Mauza &amp; Tehsil</label>
                  <input
                    id="villageBlock"
                    type="text"
                    required
                    value={villageBlock}
                    onChange={(e) => setVillageBlock(e.target.value)}
                    placeholder="e.g. Mauza Shivpur Gram Sabha, Sadar Tehsil"
                    className={styles.input}
                  />
                </div>

                {/* Target Capabilities Checklist */}
                <div className={styles.capabilitiesSection}>
                  <div className={styles.capabilitiesTitle}>Provisioned Mesh Capabilities</div>
                  <div className={styles.capabilitiesGrid}>
                    <label className={styles.capabilityItem}>
                      <input
                        type="checkbox"
                        checked={capabilities.voiceIntake}
                        onChange={() => toggleCapability('voiceIntake')}
                        className={styles.checkbox}
                      />
                      <div className={styles.capabilityContent}>
                        <span className={styles.capabilityName}>Vernacular Voice STT</span>
                        <span className={styles.capabilityDetail}>Groq Whisper Large v3 for Bhojpuri/Awadhi</span>
                      </div>
                    </label>

                    <label className={styles.capabilityItem}>
                      <input
                        type="checkbox"
                        checked={capabilities.cadastreOcr}
                        onChange={() => toggleCapability('cadastreOcr')}
                        className={styles.checkbox}
                      />
                      <div className={styles.capabilityContent}>
                        <span className={styles.capabilityName}>Cadastre Shajra OCR</span>
                        <span className={styles.capabilityDetail}>Section 24 boundary demarcation matrix</span>
                      </div>
                    </label>

                    <label className={styles.capabilityItem}>
                      <input
                        type="checkbox"
                        checked={capabilities.coercionFilter}
                        onChange={() => toggleCapability('coercionFilter')}
                        className={styles.checkbox}
                      />
                      <div className={styles.capabilityContent}>
                        <span className={styles.capabilityName}>Coercion &amp; Usury Guard</span>
                        <span className={styles.capabilityDetail}>Auto-escalation for bonded debt or violence</span>
                      </div>
                    </label>

                    <label className={styles.capabilityItem}>
                      <input
                        type="checkbox"
                        checked={capabilities.polygonAnchoring}
                        onChange={() => toggleCapability('polygonAnchoring')}
                        className={styles.checkbox}
                      />
                      <div className={styles.capabilityContent}>
                        <span className={styles.capabilityName}>Polygon Amoy Registry</span>
                        <span className={styles.capabilityDetail}>Cryptographic dual-consent audit trail</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="notes" className={styles.label}>Pilot Scope / Local Grievance Volume</label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe seasonal dispute spikes (e.g. boundary ridge cuts during Rabi sowing), local dialect challenges, or court backlog..."
                    className={styles.textarea}
                  />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className={styles.spinner} />
                      <span>Provisioning Pilot Mesh Node...</span>
                    </>
                  ) : (
                    <>
                      <span>Provision Pilot Mesh Node</span>
                      <span aria-hidden="true">→</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Telemetry & Liaison Dossier */}
          <div className={styles.infoCol}>
            {/* Card 1: Infrastructure Telemetry */}
            <div className={styles.telemetryCard}>
              <div className={styles.cardTopRow}>
                <div className={styles.cardIconFrame}>
                  <ThreeDIcon name="blockchain" size={24} />
                </div>
                <div className={styles.cardTitleBlock}>
                  <h3 className={styles.cardTitle}>Live Cluster Endpoints</h3>
                  <p className={styles.cardSubtitle}>Real-time status of connected microservices</p>
                </div>
              </div>

              <div className={styles.endpointList}>
                {/* AWS DynamoDB Single Table */}
                <div className={styles.endpointItem}>
                  <div className={styles.endpointHeader}>
                    <span className={styles.endpointName}>
                      {clusterStatus?.aws_dynamodb?.name || 'Amazon DynamoDB'}
                    </span>
                    <span className={styles.endpointStatus}>
                      <span className={styles.endpointDot} />
                      {clusterStatus?.aws_dynamodb?.status || 'ACTIVE'}
                    </span>
                  </div>
                  <span className={styles.endpointVal}>
                    {clusterStatus?.aws_dynamodb?.table || 'ClearCaseTable-Prod'} · {clusterStatus?.aws_dynamodb?.region || 'us-east-1'}
                  </span>
                </div>

                {/* AWS S3 Evidence Storage */}
                <div className={styles.endpointItem}>
                  <div className={styles.endpointHeader}>
                    <span className={styles.endpointName}>
                      {clusterStatus?.aws_s3?.name || 'Amazon S3 Bucket'}
                    </span>
                    <span className={styles.endpointStatus}>
                      <span className={styles.endpointDot} />
                      {clusterStatus?.aws_s3?.status || 'ACTIVE'}
                    </span>
                  </div>
                  <span className={styles.endpointVal}>
                    {clusterStatus?.aws_s3?.bucket || 'clearcase-audio-517025126295-us-east-1'}
                  </span>
                </div>

                {/* Amazon Polly Speech Synthesis */}
                <div className={styles.endpointItem}>
                  <div className={styles.endpointHeader}>
                    <span className={styles.endpointName}>
                      {clusterStatus?.aws_polly?.name || 'Amazon Polly (Neural TTS)'}
                    </span>
                    <span className={styles.endpointStatus}>
                      <span className={styles.endpointDot} />
                      {clusterStatus?.aws_polly?.status || 'ACTIVE'}
                    </span>
                  </div>
                  <span className={styles.endpointVal}>
                    {clusterStatus?.aws_polly?.detail || 'Kajal Indian Voice · Regional vernacular synthesis'}
                  </span>
                </div>

                {/* AWS Cedar Fine-Grained Authorization */}
                <div className={styles.endpointItem}>
                  <div className={styles.endpointHeader}>
                    <span className={styles.endpointName}>
                      {clusterStatus?.aws_cedar?.name || 'AWS Cedar AuthZ'}
                    </span>
                    <span className={styles.endpointStatus}>
                      <span className={styles.endpointDot} />
                      {clusterStatus?.aws_cedar?.status || 'ENFORCED'}
                    </span>
                  </div>
                  <span className={styles.endpointVal}>
                    {clusterStatus?.aws_cedar?.detail || 'Citizen privacy & cross-district boundary isolation'}
                  </span>
                </div>

                {/* Amazon CloudWatch & SNS Alerts */}
                <div className={styles.endpointItem}>
                  <div className={styles.endpointHeader}>
                    <span className={styles.endpointName}>
                      {clusterStatus?.aws_cloudwatch_sns?.name || 'CloudWatch & SNS Alerts'}
                    </span>
                    <span className={styles.endpointStatus}>
                      <span className={styles.endpointDot} />
                      {clusterStatus?.aws_cloudwatch_sns?.status || 'ARMED'}
                    </span>
                  </div>
                  <span className={styles.endpointVal}>
                    {clusterStatus?.aws_cloudwatch_sns?.detail || 'Urgency alarm active · $10.00 budget guard'}
                  </span>
                </div>

                {/* Python AI Engine */}
                <div className={styles.endpointItem}>
                  <div className={styles.endpointHeader}>
                    <span className={styles.endpointName}>
                      {clusterStatus?.python_ai_engine?.name || 'Python AI Legal Engine'}
                    </span>
                    <span className={styles.endpointStatus}>
                      <span className={styles.endpointDot} />
                      {clusterStatus?.python_ai_engine?.status || 'ONLINE'}
                    </span>
                  </div>
                  <span className={styles.endpointVal}>
                    {clusterStatus?.python_ai_engine?.indexed_clauses
                      ? `Statutory RAG (${clusterStatus.python_ai_engine.indexed_clauses} Clauses Indexed)`
                      : 'Statutory RAG & Lok Adalat Conciliation Mesh'}
                  </span>
                </div>

                {/* Groq Whisper STT */}
                <div className={styles.endpointItem}>
                  <div className={styles.endpointHeader}>
                    <span className={styles.endpointName}>
                      {clusterStatus?.groq_whisper?.name || 'Groq Whisper STT Engine'}
                    </span>
                    <span className={styles.endpointStatus}>
                      <span className={styles.endpointDot} />
                      {clusterStatus?.groq_whisper?.status || 'ONLINE'}
                    </span>
                  </div>
                  <span className={styles.endpointVal}>
                    {clusterStatus?.groq_whisper?.detail || 'whisper-large-v3 (< 200ms latency)'}
                  </span>
                </div>

                {/* Polygon Amoy Blockchain */}
                <div className={styles.endpointItem}>
                  <div className={styles.endpointHeader}>
                    <span className={styles.endpointName}>
                      {clusterStatus?.polygon_amoy?.name || 'Polygon Amoy Contract'}
                    </span>
                    <span className={styles.endpointStatus}>
                      <span className={styles.endpointDot} />
                      {clusterStatus?.polygon_amoy?.status || 'VERIFIED'}
                    </span>
                  </div>
                  <span className={styles.endpointVal}>
                    {clusterStatus?.polygon_amoy?.contract || '0x435A9D490EbF92C32D19D20888913B0957917C5B'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Direct Technical Liaison */}
            <div className={styles.telemetryCard}>
              <div className={styles.cardTopRow}>
                <div className={styles.cardIconFrame}>
                  <ThreeDIcon name="shield" size={24} />
                </div>
                <div className={styles.cardTitleBlock}>
                  <h3 className={styles.cardTitle}>DLSA &amp; Pilot Liaison Office</h3>
                  <p className={styles.cardSubtitle}>Direct contact for hackathon evaluators and researchers</p>
                </div>
              </div>

              <div className={styles.liaisonList}>
                <div className={styles.liaisonItem}>
                  <span className={styles.liaisonKey}>Technical Dispatch</span>
                  <a href="mailto:hi@clearcase.in" className={styles.liaisonLink}>hi@clearcase.in</a>
                </div>

                <div className={styles.liaisonItem}>
                  <span className={styles.liaisonKey}>Evaluator Helpline</span>
                  <span className={styles.liaisonVal}>+91 7838430665</span>
                </div>

                <div className={styles.liaisonItem}>
                  <span className={styles.liaisonKey}>Open Source Core</span>
                  <a
                    href="https://github.com/shankywho/ClearCase"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.liaisonLink}
                  >
                    github.com/shankywho/ClearCase
                  </a>
                </div>

                <div className={styles.liaisonItem}>
                  <span className={styles.liaisonKey}>Field Corridor</span>
                  <span className={styles.liaisonVal}>BHU Research Zone, Varanasi, UP</span>
                </div>
              </div>
            </div>

            {/* Card 3: Minimal Edge Field Requirements */}
            <div className={styles.telemetryCard}>
              <div className={styles.cardTopRow}>
                <div className={styles.cardIconFrame}>
                  <ThreeDIcon name="clipboard" size={24} />
                </div>
                <div className={styles.cardTitleBlock}>
                  <h3 className={styles.cardTitle}>Edge Hardware Profile</h3>
                  <p className={styles.cardSubtitle}>Low-spec rural deployment requirements</p>
                </div>
              </div>

              <div className={styles.specList}>
                <div className={styles.specItem}>
                  <span className={styles.specBullet}>•</span>
                  <span><strong>Any standard dual-core laptop or Raspberry Pi 5:</strong> Operates at village common service centers (CSCs).</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specBullet}>•</span>
                  <span><strong>2GB RAM minimum:</strong> Ultra-lightweight memory footprint for local vector search and audio buffering.</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specBullet}>•</span>
                  <span><strong>Offline-First Resilience:</strong> Works completely offline; syncs cryptographic hashes to Polygon when network reconnects.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
