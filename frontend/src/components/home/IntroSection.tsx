import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './IntroSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export const IntroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const validWords = wordsRef.current.filter(Boolean);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          once: true,
        },
      });

      // Word-by-word spring reveal matching Framer effect:na
      tl.fromTo(
        validWords,
        {
          opacity: 0,
          y: 16,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.09,
          ease: 'power3.out',
        }
      )
        // Subhead paragraph reveal
        .fromTo(
          subheadRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.3'
        )
        // Glowing pill CTA reveal
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 16, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'back.out(1.4)' },
          '-=0.4'
        );

      // Magnetic hover interaction on CTA button
      const cta = ctaRef.current;
      if (cta) {
        const arrow = cta.querySelector(`.${styles.arrow}`);
        
        const onMouseMove = (e: MouseEvent) => {
          const rect = cta.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) * 0.35;
          const dy = (e.clientY - cy) * 0.35;

          gsap.to(cta, {
            x: dx,
            y: dy,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
          });

          if (arrow) {
            gsap.to(arrow, {
              x: dx * 0.6 + 4,
              y: dy * 0.6,
              duration: 0.3,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }
        };

        const onMouseLeave = () => {
          gsap.to(cta, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.4)',
            overwrite: 'auto',
          });

          if (arrow) {
            gsap.to(arrow, {
              x: 0,
              y: 0,
              duration: 0.6,
              ease: 'elastic.out(1, 0.4)',
              overwrite: 'auto',
            });
          }
        };

        cta.addEventListener('mousemove', onMouseMove);
        cta.addEventListener('mouseleave', onMouseLeave);

        return () => {
          cta.removeEventListener('mousemove', onMouseMove);
          cta.removeEventListener('mouseleave', onMouseLeave);
        };
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="ClearCase Agency Philosophy">
      <div className="container">
        <div className={styles.inner}>
          <h2 className={styles.headline}>
            <span
              ref={(el) => { wordsRef.current[0] = el; }}
              className={styles.word}
            >
              Spoken
            </span>{' '}
            <span
              ref={(el) => { wordsRef.current[1] = el; }}
              className={styles.word}
            >
              justice.
            </span>
            <br />
            <span
              ref={(el) => { wordsRef.current[2] = el; }}
              className={styles.word}
            >
              Verified
            </span>{' '}
            <span
              ref={(el) => { wordsRef.current[3] = el; }}
              className={styles.word}
            >
              accords.
            </span>
          </h2>

          <p ref={subheadRef} className={styles.subhead}>
            ClearCase bridges rural India&apos;s 4 crore justice chasm by transforming verbal village grievances into statutory compromise accords—grounded in official state revenue codes, verified via dual-party OTP, and permanently anchored on Polygon.
          </p>

          <Link ref={ctaRef} to="/approach" className={styles.ctaBtn}>
            <span>Explore Platform Architecture</span>
            <span className={styles.arrow} aria-hidden="true">
              <svg viewBox="0 0 14.879 32.733" width="12" height="22" fill="none">
                <path
                  d="M 1.5 1.5 L 13 16.367 L 1.5 31.233"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};
