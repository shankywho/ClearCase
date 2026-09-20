import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './HeroSection.module.css';

export const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wordmark = wordmarkRef.current;
    const sparkle = sparkleRef.current;
    if (!wordmark) return;

    const ctx = gsap.context(() => {
      // Hero entrance animation
      gsap.fromTo(
        wordmark,
        {
          opacity: 0,
          y: 80,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
        }
      );

      // Subtle Hero Mouse Tracking Parallax
      if (section) {
        const onMouseMove = (e: MouseEvent) => {
          const rect = section.getBoundingClientRect();
          const normX = (e.clientX - rect.left) / rect.width - 0.5;
          const normY = (e.clientY - rect.top) / rect.height - 0.5;

          // Parallax depth on the giant logo
          gsap.to(wordmark, {
            x: normX * 18,
            y: normY * 10,
            duration: 0.6,
            ease: 'power2.out',
            overwrite: 'auto',
          });

          // Sparkle magnetic draw
          if (sparkle) {
            const sparkleRect = sparkle.getBoundingClientRect();
            const sX = sparkleRect.left + sparkleRect.width / 2;
            const sY = sparkleRect.top + sparkleRect.height / 2;
            const dist = Math.hypot(e.clientX - sX, e.clientY - sY);

            if (dist < 260) {
              const pull = (1 - dist / 260) * 24;
              const angle = Math.atan2(e.clientY - sY, e.clientX - sX);
              gsap.to(sparkle, {
                x: Math.cos(angle) * pull,
                y: Math.sin(angle) * pull,
                scale: 1.25,
                rotate: 45,
                duration: 0.3,
                ease: 'power2.out',
                overwrite: 'auto',
              });
            } else {
              gsap.to(sparkle, {
                x: 0,
                y: 0,
                scale: 1,
                rotate: 0,
                duration: 0.7,
                ease: 'elastic.out(1, 0.4)',
                overwrite: 'auto',
              });
            }
          }
        };

        const onMouseLeave = () => {
          gsap.to(wordmark, {
            x: 0,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            overwrite: 'auto',
          });

          if (sparkle) {
            gsap.to(sparkle, {
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0,
              duration: 0.7,
              ease: 'elastic.out(1, 0.4)',
              overwrite: 'auto',
            });
          }
        };

        section.addEventListener('mousemove', onMouseMove);
        section.addEventListener('mouseleave', onMouseLeave);

        return () => {
          section.removeEventListener('mousemove', onMouseMove);
          section.removeEventListener('mouseleave', onMouseLeave);
        };
      }
    }, section || undefined);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.hero} aria-label="ClearCase">
      {/* Center canvas with subtle floating star / sparkle */}
      <div className={styles.centerCanvas}>
        <span ref={sparkleRef} className={styles.sparkle} aria-hidden="true">✦</span>
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

