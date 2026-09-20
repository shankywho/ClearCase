import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import styles from './WorkHeader.module.css';

export interface WorkHeaderProps {
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
  filterCounts: Record<string, number>;
}

const FILTERS = ['All', 'Land & Demarcation', 'Labor & Wages', 'Tenancy & Lease', 'Water & Rights'];

export const WorkHeader: React.FC<WorkHeaderProps> = ({
  activeFilter,
  onSelectFilter,
  filterCounts,
}) => {
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className={styles.header}>
      <div className="container">
        <div ref={revealRef}>


          <h1 className={styles.title}>
            Documented rural dispute resolutions.
          </h1>

          <p className={styles.subhead}>
            Explore real agrarian, labor, and common resource disputes resolved through spoken dialect intake, statutory revenue code grounding, and mutual digital consent.
          </p>

          <div className={styles.filterBar} role="tablist" aria-label="Project categories">
            {FILTERS.map((cat) => {
              const count = filterCounts[cat] ?? 0;
              const isActive = activeFilter === cat;

              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.filterBtn} ${isActive ? styles.active : ''}`}
                  onClick={() => onSelectFilter(cat)}
                >
                  <span>{cat}</span>
                  <span className={styles.filterCount}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
