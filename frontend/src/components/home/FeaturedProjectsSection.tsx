import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import styles from './FeaturedProjectsSection.module.css';

interface FeaturedProject {
  slug: string;
  title: string;
  description: string;
  category: string;
  location: string;
  image: string;
}

const PROJECTS: FeaturedProject[] = [
  {
    slug: 'land-demarcation',
    title: 'Land Boundary Demarcation',
    description: 'Boundary ridge trimmed during wheat sowing. Resolved via Section 24 UP Revenue Code demarcation with joint boundary stone placement.',
    category: 'Land & Revenue',
    location: 'Varanasi, UP',
    image: '/images/proj-land-demarcation.jpg',
  },
  {
    slug: 'harvest-wages',
    title: 'Agricultural Harvest Wages',
    description: 'Harvesters unpaid after 14 days of paddy cutting. Settled via Section 20 Minimum Wages Act with verified direct wage disbursement.',
    category: 'Labor & Wages',
    location: 'Gorakhpur, UP',
    image: '/images/proj-harvest-wages.jpg',
  },
  {
    slug: 'cart-track-obstruction',
    title: 'Village Cart-Track Obstruction',
    description: 'Tractor access blocked with fencing. Neutral accord drafted under CrPC Section 133 and Easements Act restoring 8-foot clear passage.',
    category: 'Right of Way',
    location: 'Sultanpur, UP',
    image: '/images/proj-cart-track.jpg',
  },
  {
    slug: 'tubewell-watercourse',
    title: 'Tubewell Irrigation Sharing',
    description: 'Canal water cut off during critical summer sowing. Structured time-sharing schedule established under Indian Easements Act Section 15.',
    category: 'Water Rights',
    location: 'Azamgarh, UP',
    image: '/images/proj-tubewell-sharing.jpg',
  },
  {
    slug: 'sharecropping-division',
    title: 'Sharecropping Crop-Share Accord',
    description: 'Disputed 50:50 grain split following unseasonal rain damage. Compromise accord framed under Model Tenancy Code with village consensus.',
    category: 'Tenancy & Lease',
    location: 'Mirzapur, UP',
    image: '/images/proj-sharecropping.jpg',
  },
  {
    slug: 'commercial-shop-tenancy',
    title: 'Commercial Village Shop Tenancy',
    description: 'Market stallholder threatened with arbitrary eviction. 3-year fair lease formulated under Transfer of Property Act Section 106.',
    category: 'Commercial Lease',
    location: 'Jaunpur, UP',
    image: '/images/proj-shop-tenancy.jpg',
  },
  {
    slug: 'pasture-encroachment',
    title: 'Gram Sabha Pasture Encroachment',
    description: 'Unauthorized livestock fencing on communal grazing land. Peaceful voluntary boundary retreat drafted under UP Revenue Code Section 67.',
    category: 'Common Property',
    location: 'Ballia, UP',
    image: '/images/proj-pasture-encroachment.jpg',
  },
  {
    slug: 'usurious-debt-escalation',
    title: 'Predatory Usury & Bond Escalation',
    description: 'Moneylender demanded 60% compound interest and withheld ration cards. Coercion Gate halted auto-mediation and escalated to District Legal Aid.',
    category: 'Coercion Gate',
    location: 'Ghazipur, UP',
    image: '/images/proj-usury-coercion.jpg',
  },
];

const ProjectRowItem: React.FC<{ proj: FeaturedProject }> = ({ proj }) => {
  const rowRef = useRef<HTMLAnchorElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const ctx = gsap.context(() => {
      const onMouseMove = (e: MouseEvent) => {
        const rect = row.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        if (imageRef.current) {
          gsap.to(imageRef.current, {
            x: normX * 24,
            y: normY * 18,
            scale: 1.06,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
        if (titleRef.current) {
          gsap.to(titleRef.current, {
            x: 10,
            color: '#71efe4',
            duration: 0.28,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
        if (arrowRef.current) {
          gsap.to(arrowRef.current, {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.3,
            ease: 'back.out(2)',
            overwrite: 'auto',
          });
        }
        if (tagsRef.current) {
          gsap.to(tagsRef.current, {
            x: 6,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      };

      const onMouseLeave = () => {
        if (imageRef.current) {
          gsap.to(imageRef.current, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.65,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        }
        if (titleRef.current) {
          gsap.to(titleRef.current, {
            x: 0,
            color: '',
            duration: 0.45,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        }
        if (arrowRef.current) {
          gsap.to(arrowRef.current, {
            opacity: 0,
            x: -8,
            scale: 0.85,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
        if (tagsRef.current) {
          gsap.to(tagsRef.current, {
            x: 0,
            duration: 0.4,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        }
      };

      row.addEventListener('mousemove', onMouseMove);
      row.addEventListener('mouseleave', onMouseLeave);

      return () => {
        row.removeEventListener('mousemove', onMouseMove);
        row.removeEventListener('mouseleave', onMouseLeave);
      };
    }, row);

    return () => ctx.revert();
  }, []);

  return (
    <Link ref={rowRef} to={`/work/${proj.slug}`} className={styles.projectRow}>
      <div className={styles.infoCol}>
        <div className={styles.titleRow}>
          <h2 ref={titleRef} className={styles.title}>{proj.title}</h2>
          <span ref={arrowRef} className={styles.arrowIcon} aria-hidden="true">→</span>
        </div>
        <p className={styles.description}>{proj.description}</p>
        <div ref={tagsRef} className={styles.tags}>
          <span>{proj.category}</span>
          <span className={styles.dot}>,</span>
          <span>{proj.location}</span>
        </div>
      </div>

      <div className={styles.mediaCol}>
        <img
          ref={imageRef}
          src={proj.image}
          alt={`${proj.title} Showcase`}
          className={styles.image}
          loading="lazy"
        />
      </div>
    </Link>
  );
};

export const FeaturedProjectsSection: React.FC = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className={styles.section} aria-label="Featured Projects">
      <div className="container">
        <div ref={headerRef} className={styles.label}>
          Featured Projects
        </div>

        <div className={styles.list}>
          {PROJECTS.map((proj) => (
            <ProjectRowItem key={proj.slug} proj={proj} />
          ))}
        </div>
      </div>
    </section>
  );
};

