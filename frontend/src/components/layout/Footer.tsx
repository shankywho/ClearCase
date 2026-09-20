import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Footer.module.css';

gsap.registerPlugin(ScrollTrigger);

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const giantLogoRef = useRef<HTMLDivElement>(null);
  const capsuleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Massive Wordmark scroll-linked parallax (bi-directional down & up)
      if (giantLogoRef.current) {
        gsap.fromTo(
          giantLogoRef.current,
          {
            y: 110,
            opacity: 0.75,
          },
          {
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 0.8,
            },
          }
        );
      }

      // 2. Frosted glass capsule 3D perspective fold-up/fold-down (seamless on scrolling down AND scrolling up)
      if (capsuleRef.current) {
        gsap.fromTo(
          capsuleRef.current,
          {
            opacity: 0.2,
            rotateX: 55,
            y: 140,
            scale: 0.94,
          },
          {
            opacity: 1,
            rotateX: 0,
            y: 0,
            scale: 1,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 0.8,
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className={styles.footer} aria-label="Footer">
      {/* Giant Full-Width "ClearCase" Wordmark (Towering Scale) */}
      <div ref={giantLogoRef} className={styles.giantLogoWrapper}>
        <img
          src="/images/clearcase-giant-footer.svg?v=2"
          alt="ClearCase"
          className={styles.giantLogo}
          loading="lazy"
        />
      </div>

      {/* Massive Frosted Glass Curved Scoop Capsule */}
      <div className={styles.capsuleWrapper}>
        <div ref={capsuleRef} className={styles.capsuleContainer}>
          <div className={styles.linksGrid}>
            {/* Col 1: Platform & Architecture */}
            <div className={styles.col}>
              <Link to="/" className={styles.footerLink}>Home</Link>
              <Link to="/work" className={styles.footerLink}>Dispute Cases</Link>
              <Link to="/approach" className={styles.footerLink}>Architecture</Link>
              <Link to="/about" className={styles.footerLink}>Mission</Link>
              <Link to="/contact" className={styles.footerLink}>Deploy Mesh</Link>
            </div>

            {/* Col 2: Legal & Infrastructure */}
            <div className={styles.col}>
              <Link to="/faq" className={styles.footerLink}>Legal FAQ</Link>
              <Link to="/approach" className={styles.footerLink}>Statutory RAG</Link>
              <Link to="/contact" className={styles.footerLink}>Panchayat Pilot</Link>
              <a
                href="https://amoy.polygonscan.com"
                target="_blank"
                rel="noreferrer"
                className={styles.footerLink}
              >
                Polygon Registry
              </a>
            </div>

            {/* Col 3: Contact & Project Ecosystem */}
            <div className={styles.col}>
              <a href="mailto:hi@clearcase.in" className={styles.footerLink}>
                hi@clearcase.in
              </a>
              <span className={styles.phoneText}>+91 7838430665</span>
              <a
                href="https://github.com/shankywho/ClearCase"
                target="_blank"
                rel="noreferrer"
                className={styles.footerLink}
              >
                GitHub Core
              </a>
              <span className={styles.phoneText} style={{ opacity: 0.7, fontSize: '0.85rem' }}>
                Bharat Builds 2026
              </span>
            </div>

            {/* Col 4: Action Button */}
            <div className={styles.colCta}>
              <Link to="/contact" className={styles.ctaBtn}>
                <span>Deploy for Panchayat</span>
                <span className={styles.ctaChevron} aria-hidden="true">&rsaquo;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
