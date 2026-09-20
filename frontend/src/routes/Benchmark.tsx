import React from 'react';
import { InteractiveTerminalSection } from '@/components/home/InteractiveTerminalSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ClosingCtaSection } from '@/components/home/ClosingCtaSection';

export const Benchmark: React.FC = () => {
  return (
    <main style={{ paddingTop: 'clamp(60px, 8vw, 100px)' }}>
      <InteractiveTerminalSection />
      <TestimonialsSection />
      <ClosingCtaSection />
    </main>
  );
};
