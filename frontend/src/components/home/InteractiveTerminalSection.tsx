import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './InteractiveTerminalSection.module.css';
import { analyzeDispute, BENCHMARK_SCENARIOS, type AnalyzeResponse } from '@/lib/api';
import { ThreeDIcon } from '@/components/common/ThreeDIcon';

export const InteractiveTerminalSection: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [disputeText, setDisputeText] = useState(BENCHMARK_SCENARIOS[0].englishTranslation);
  const [dialect, setDialect] = useState(BENCHMARK_SCENARIOS[0].dialect);
  const [district, setDistrict] = useState(BENCHMARK_SCENARIOS[0].district);
  const [state, setState] = useState(BENCHMARK_SCENARIOS[0].state);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  const handleSelectScenario = (idx: number) => {
    const sc = BENCHMARK_SCENARIOS[idx];
    setSelectedIdx(idx);
    setDisputeText(sc.englishTranslation);
    setDialect(sc.dialect);
    setDistrict(sc.district);
    setState(sc.state);
    setResult(null);
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const res = await analyzeDispute({
        grievanceText: disputeText,
        dialect,
        state,
        district,
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const primarySection = result?.applicable_sections?.[0];

  return (
    <section className={styles.section} id="demo-terminal" aria-label="Interactive Dispute Resolution Engine">
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>Real-Time Statutory Resolution</h2>
          <p className={styles.subtitle}>
            Select a verified benchmark case or input rural boundary disputes. The Python AI pipeline evaluates statutory citations, precedent memory, and compromise terms.
          </p>
        </div>

        <div className={styles.terminalCard}>
          <div className={styles.presetRow}>
            {BENCHMARK_SCENARIOS.map((sc, i) => (
              <button
                key={sc.title}
                type="button"
                className={`${styles.presetChip} ${selectedIdx === i ? styles.presetChipActive : ''}`}
                onClick={() => handleSelectScenario(i)}
              >
                {sc.title}
              </button>
            ))}
          </div>

          <div className={styles.terminalBody}>
            <div className={styles.pane}>
              <div className={styles.paneHeader}>
                <span className={styles.paneTitle}>Case Narration</span>
                <span className={styles.dialectBadge}>{dialect} · {district}, {state}</span>
              </div>
              <textarea
                className={styles.textarea}
                value={disputeText}
                onChange={(e) => setDisputeText(e.target.value)}
                placeholder="Narrate boundary, water rights, or wage dispute..."
                rows={5}
              />
              <button
                type="button"
                className={styles.actionBtn}
                onClick={handleRunAnalysis}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.btnSpinner} />
                    <span>Evaluating Statutes & Precedents...</span>
                  </>
                ) : (
                  <>
                    <span>Run Statutory Analysis</span>
                    <span className={styles.btnArrow}>→</span>
                  </>
                )}
              </button>
            </div>

            <div className={styles.pane}>
              <div className={styles.paneHeader}>
                <span className={styles.paneTitle}>Resolution & Statutory Alignment</span>
                {result && <span className={styles.statusBadgeLive}>Analyzed</span>}
              </div>
              <div className={styles.outputBox}>
                {result ? (
                  <div className={styles.resultContainer}>
                    {primarySection && (
                      <div className={styles.statuteHeader}>
                        <span className={styles.statuteAct}>{primarySection.act}</span>
                        <h3 className={styles.statuteSection}>{primarySection.section}</h3>
                      </div>
                    )}
                    <div className={styles.accordBox}>
                      <span className={styles.accordLabel}>Drafted Compromise Accord Terms</span>
                      <p className={styles.accordExcerpt}>{result.settlement_draft}</p>
                    </div>
                    <div className={styles.metaTagsRow}>
                      <span className={styles.metaPill}>
                        <span className={styles.confidenceDot} />
                        Confidence: {(result.confidence_score * 100).toFixed(0)}%
                      </span>
                      <span className={styles.metaPill}>
                        Forum: Lok Adalat Pre-Litigation
                      </span>
                      <span className={styles.metaPillSuccess}>
                        ✓ Enforceable Accord
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIconCircle}>
                      <ThreeDIcon name="scales" size={30} />
                    </div>
                    <h4 className={styles.emptyTitle}>Ready for Evaluation</h4>
                    <p className={styles.emptyDesc}>
                      Select a rural dispute benchmark above or edit the narrative, then click <strong>Run Statutory Analysis</strong> to extract citations, precedents, and drafted terms.
                    </p>
                    <div className={styles.previewSpecs}>
                      <span className={styles.specItem}>UP Revenue Code §24</span>
                      <span className={styles.specItem}>Section 89 CPC Compromise</span>
                      <span className={styles.specItem}>Panchayat Adalat Ready</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.portalLinkRow}>
            <span className={styles.portalNote}>
              Need deep voice synthesis, formal court petitions, or drone parcel demarcation?
            </span>
            <Link to="/resolve" className={styles.portalLink}>
              <span>Open Full Resolution Workspace</span>
              <span className={styles.linkArrow}>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
