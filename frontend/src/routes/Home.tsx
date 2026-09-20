import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { IntroSection } from '@/components/home/IntroSection';
import { FeaturedProjectsSection } from '@/components/home/FeaturedProjectsSection';
import { PartnersSection } from '@/components/home/PartnersSection';
import { ThreeWaysSection } from '@/components/home/ThreeWaysSection';
import { AwardsSection } from '@/components/home/AwardsSection';
import { ReadinessSection } from '@/components/home/ReadinessSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ClosingCtaSection } from '@/components/home/ClosingCtaSection';

export const Home: React.FC = () => {
  return (
    <main>
      {/* 1. Full-height 100vh Hero with floating nav and "BE THE ONLY" anchored to the bottom */}
      <HeroSection />

      {/* 2. Intro Section: "Stop competing. Start owning." & "Let's make you the Only" */}
      <IntroSection />

      {/* 3. Featured Projects (8 horizontal rows) */}
      <FeaturedProjectsSection />

      {/* 4. Our Partners (Client brand logos) */}
      <PartnersSection />

      {/* 5. Three ways make you the Only */}
      <ThreeWaysSection />

      {/* 6. Awards & Recognition ticker */}
      <AwardsSection />

      {/* 7. You might be ready for ClearCase if */}
      <ReadinessSection />

      {/* 8. What leaders say about working with ClearCase */}
      <TestimonialsSection />

      {/* 9. Closing CTA banner */}
      <ClosingCtaSection />
    </main>
  );
};
