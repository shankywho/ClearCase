import React, { useState, useMemo } from 'react';
import { WorkHeader } from '@/components/work/WorkHeader';
import { WorkGrid, ALL_PROJECTS } from '@/components/work/WorkGrid';
import { ClosingCtaSection } from '@/components/home/ClosingCtaSection';

export const Work: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: ALL_PROJECTS.length,
      'Land & Demarcation': 0,
      'Labor & Wages': 0,
      'Tenancy & Lease': 0,
      'Water & Rights': 0,
    };

    ALL_PROJECTS.forEach((p) => {
      p.categories.forEach((cat) => {
        if (counts[cat] !== undefined) {
          counts[cat]++;
        }
      });
    });

    return counts;
  }, []);

  return (
    <main>
      <WorkHeader
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
        filterCounts={filterCounts}
      />
      <WorkGrid filter={activeFilter} />
      <ClosingCtaSection />
    </main>
  );
};
