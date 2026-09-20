import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import { useMagnetic } from '@/hooks/useGsapHover';
import styles from './ThreeWaysSection.module.css';

interface PillarBlockProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  tags: string[];
  reverse?: boolean;
}

const PillarBlock: React.FC<PillarBlockProps> = ({
  imageSrc,
  imageAlt,
  title,
  tags,
  reverse,
}) => {
  const blockRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const mediaEl = mediaRef.current;
    const imgEl = imgRef.current;
    const blockEl = blockRef.current;
    if (!mediaEl || !imgEl || !blockEl) return;

    const ctx = gsap.context(() => {
      // 2.5D Image Parallax on Media Hover
      const onMediaMouseMove = (e: MouseEvent) => {
        const rect = mediaEl.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(imgEl, {
          scale: 1.06,
          x: normX * 18,
          y: normY * 18,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      const onMediaMouseLeave = () => {
        gsap.to(imgEl, {
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      };

      mediaEl.addEventListener('mousemove', onMediaMouseMove);
      mediaEl.addEventListener('mouseleave', onMediaMouseLeave);

      // GSAP Tag Hover Glow & Spring
      const tagEls = blockEl.querySelectorAll<HTMLElement>(`.${styles.tag}`);
      tagEls.forEach((tag) => {
        const onTagEnter = () => {
          gsap.to(tag, {
            scale: 1.07,
            y: -2,
            borderColor: '#71efe4',
            color: '#71efe4',
            backgroundColor: 'rgba(113, 239, 228, 0.08)',
            duration: 0.25,
            ease: 'back.out(1.8)',
            overwrite: 'auto',
          });
        };

        const onTagLeave = () => {
          gsap.to(tag, {
            scale: 1,
            y: 0,
            borderColor: '',
            color: '',
            backgroundColor: '',
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        };

        tag.addEventListener('mouseenter', onTagEnter);
        tag.addEventListener('mouseleave', onTagLeave);
      });

      return () => {
        mediaEl.removeEventListener('mousemove', onMediaMouseMove);
        mediaEl.removeEventListener('mouseleave', onMediaMouseLeave);
      };
    }, blockEl);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={blockRef}
      className={`${styles.block} ${reverse ? styles.reverse : ''}`}
    >
      <div ref={mediaRef} className={styles.mediaCol}>
        <img
          ref={imgRef}
          src={imageSrc}
          alt={imageAlt}
          className={styles.image}
          loading="lazy"
        />
      </div>
      <div className={styles.contentCol}>
        <h3 className={styles.blockTitle}>{title}</h3>
        <div className={styles.tagGrid}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ThreeWaysSection: React.FC = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const ctaRef = useMagnetic<HTMLAnchorElement>({
    strength: 0.32,
    innerStrength: 0.55,
    innerSelector: 'span:last-child',
  });

  return (
    <section className={styles.section} aria-label="Three pillars of statutory village mediation">
      <div className="container">
        <div ref={headerRef} className={styles.header}>
          <h2 className={styles.mainTitle}>Three pillars</h2>
          <p className={styles.subtitle}>of statutory village mediation</p>
        </div>

        <div className={styles.blocks}>
          <PillarBlock
            imageSrc="/images/pillar-vernacular-intake.jpg"
            imageAlt="Vernacular Dialect Audio Intake"
            title="Vernacular dialect intake that understands real village speech."
            tags={[
              'Bhojpuri Speech',
              'Awadhi Grammar',
              'Maithili Dialect',
              'Audio Waveforms',
              'Whisper Normalizer',
              'Acoustic Confidence',
              'Zero Literacy Prerequisite',
              'Oral Grievance Statements',
            ]}
          />

          <PillarBlock
            imageSrc="/images/pillar-statutory-grounding.jpg"
            imageAlt="Statutory Grounding & Revenue Codes"
            title="Statutory grounding that anchors every clause in State Acts."
            tags={[
              'UP Revenue Code 2006',
              'Section 24 Demarcation',
              'Minimum Wages Act 1948',
              'CrPC Section 133',
              'Indian Easements Act',
              'Model Tenancy Code',
              'Zero Hallucination Gate',
              'Official State Gazettes',
            ]}
            reverse
          />

          <PillarBlock
            imageSrc="/images/pillar-cryptographic-accord.jpg"
            imageAlt="Cryptographic Consensus & Lok Adalat Enforceability"
            title="Cryptographic consensus and formal Lok Adalat conversion."
            tags={[
              'Section 89 CPC',
              'Section 20 LSAA 1987',
              'Dual-Party OTP Consent',
              'Polygon Amoy Smart Contract',
              'SHA-256 Audit Trail',
              'Court-Enforceable Decrees',
              'Panchayat Registry',
              'Permanent Dispute Closure',
            ]}
          />
        </div>

        <div className={styles.ctaWrapper}>
          <Link ref={ctaRef} to="/approach" className={styles.ctaBtn}>
            <span>Explore The Architecture</span>
            <span style={{ display: 'inline-block' }}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
