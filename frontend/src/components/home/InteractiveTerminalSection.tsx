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
          <div className={styles.eyebrow}>
            <span className={styles.pulseDot} />
            <span>Statutory Neural Engine</span>
          </div>
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
              <div className={styles.paneTitle}>
                Case Narration ({dialect.toUpperCase()} · {district}, {state})
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
                {loading ? 'Evaluating Precedents & Statutes...' : 'Run Neural Statutory Resolution →'}
              </button>
            </div>

            <div className={styles.pane}>
              <div className={styles.paneTitle}>Resolution & Statutory Alignment</div>
              <div className={styles.outputBox}>
                {result ? (
                  <div>
                    {primarySection && (
                      <>
                        <span className={styles.statuteTag}>{primarySection.act}</span>
                        <h3 className={styles.statuteTitle}>{primarySection.section}</h3>
                      </>
                    )}
                    <p className={styles.accordExcerpt}>{result.settlement_draft}</p>
                    <div className={styles.metaTagsRow}>
                      <span className={styles.metaPill}>
                        Confidence: {(result.confidence_score * 100).toFixed(0)}%
                      </span>
                      <span className={styles.metaPill}>
                        Forum: Lok Adalat Pre-Litigation
                      </span>
                      <span className={styles.metaPillSuccess}>
                        ✓ Panchayat Ready
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                      <ThreeDIcon name="scales" size={36} />
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#44403c' }}>Awaiting Execution</div>
                    <div style={{ fontSize: '0.78rem', marginTop: '4px', maxWidth: '320px' }}>
                      Click "Run Neural Statutory Resolution" to evaluate statutes, precedent memory, and compromise terms.
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
              Open Full Resolution Workspace →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
