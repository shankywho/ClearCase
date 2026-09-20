import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { getLenis } from '@/lib/lenis';
import styles from './Preloader.module.css';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [isDone, setIsDone] = useState(false);

  const containerRef = useRef<HTMLElement>(null);
  const counterWrapperRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // 1. Lock scroll via Lenis and window immediately
    const lenis = getLenis();
    lenis?.stop();
    lenis?.scrollTo(0, { immediate: true });
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const counterObj = { value: 0 };
      const tl = gsap.timeline();

      // Silky, uniform counter progression 0 -> 100
      let lastVal = -1;
      tl.to(counterObj, {
        value: 100,
        duration: 3.0,
        ease: 'power1.inOut',
        onUpdate: () => {
          const currentVal = Math.floor(counterObj.value);
          if (currentVal !== lastVal) {
            lastVal = currentVal;
            if (numberRef.current) {
              numberRef.current.textContent = String(currentVal);
            }
          }
        },
      });

      // Brief beat at 100%
      tl.to({}, { duration: 0.25 });

      // Smoothly fade & elevate counter away
      tl.to(
        counterWrapperRef.current,
        {
          opacity: 0,
          y: -30,
          duration: 0.45,
          ease: 'power2.inOut',
        }
      );

      // Ladder / Staircase reveal: 5 panels slide UP with smooth stagger from right to left
      const validPanels = panelsRef.current.filter(Boolean);
      tl.to(
        validPanels,
        {
          yPercent: -100,
          duration: 1.35,
          ease: 'power3.inOut',
          stagger: {
            each: 0.1,
            from: 'end', // Rightmost panel leads, producing the descending staircase
          },
          onComplete: () => {
            // Unlock Lenis smooth scroll
            const currentLenis = getLenis();
            currentLenis?.start();
            document.body.style.overflow = '';
            setIsDone(true);
            onComplete?.();
          },
        },
        '-=0.15'
      );
    }, containerRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
      getLenis()?.start();
    };
  }, [onComplete]);

  if (isDone) return null;

  return (
    <aside
      ref={containerRef}
      className={styles.preloader}
      aria-label="Site loading preloader"
      aria-live="polite"
    >
      {/* 5 Vertical Staggered Black Panels for the Ladder Reveal */}
      <div className={styles.panelsContainer} aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            ref={(el) => { panelsRef.current[i] = el; }}
            className={styles.panel}
            style={{ left: `${i * 20}%` }}
          />
        ))}
      </div>

      {/* Large Running Percentage Counter in Manuka Black (Bottom Right) */}
      <div ref={counterWrapperRef} className={styles.counterWrapper}>
        <span className={styles.percentNumber}>
          <span ref={numberRef}>0</span>
          <span className={styles.percentSymbol}>%</span>
        </span>
      </div>
    </aside>
  );
};
