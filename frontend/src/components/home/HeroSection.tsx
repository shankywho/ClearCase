import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './HeroSection.module.css';

export const HeroSection: React.FC = () => {
  const wordmarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wordmarkRef.current) return;

    gsap.fromTo(
      wordmarkRef.current,
      {
        opacity: 0,
        y: 100,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
      }
    );
  }, []);

  return (
    <section className={styles.hero} aria-label="ClearCase">
      {/* Center canvas with subtle floating star / sparkle */}
      <div className={styles.centerCanvas}>
        <span className={styles.sparkle} aria-hidden="true">✦</span>
      </div>



      {/* Giant Edge-to-Edge "ClearCase" Wordmark in authentic Manuka Black */}
      <div ref={wordmarkRef} className={styles.giantLogoWrapper}>
        <img
          src="/images/clearcase-giant-hero.svg?v=7"
          alt="ClearCase"
          className={styles.giantLogo}
          loading="eager"
        />
      </div>
    </section>
  );
};

