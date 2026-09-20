import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import styles from './FeaturedWorkGridSection.module.css';

export const FeaturedWorkGridSection: React.FC = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();

  const featured = [
    {
      slug: 'land-demarcation',
      title: 'Land Boundary Demarcation',
      client: 'Varanasi Gram Sabha',
      discipline: 'UP Revenue Code 2006 · Section 24',
      year: '2026',
      image: '/images/3bWTAYyjV4ZJTmkBRESfDTzRXc.png',
      aspect: 'large',
    },
    {
      slug: 'harvest-wages',
      title: 'Unpaid Harvest Labor Wages',
      client: 'Gorakhpur Tehsil',
      discipline: 'Minimum Wages Act 1948 · Section 20',
      year: '2026',
      image: '/images/9d4TNGFKFnZL1yoQzXNrDNFc.png',
      aspect: 'standard',
    },
    {
      slug: 'tubewell-watercourse',
      title: 'Tubewell Irrigation Water Sharing',
      client: 'Azamgarh Gram Panchayat',
      discipline: 'Indian Easements Act 1882 · Section 15',
      year: '2026',
      image: '/images/ddgvUaFoQ769eVRNXfdbQEFnU.png',
      aspect: 'standard',
    },
    {
      slug: 'sharecropping-division',
      title: 'Sharecropping Crop-Share Split',
      client: 'Mirzapur Panchayat',
      discipline: 'Model Tenancy Code · Customary Accord',
      year: '2026',
      image: '/images/XJfLrvkcZ2tSJc3rEFULy4IfPdE.png',
      aspect: 'large',
    },
  ];

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div ref={headerRef} className={styles.header}>
          <div>
            <span className="badge-tag">Resolved Dispute Accords</span>
            <h2 className="text-h1" style={{ marginBlock: 'var(--space-md)' }}>
              Village disputes resolved with statutory clarity.
            </h2>
          </div>
          <Link to="/work" className="btn-secondary">
            <span>View All Dispute Accords (8)</span>
          </Link>
        </div>

        <div className={styles.grid}>
          {featured.map((project) => (
            <Link
              key={project.slug}
              to={`/work/${project.slug}`}
              className={styles.card}
            >
              <div className={styles.imageContainer}>
                <img
                  src={project.image}
                  alt={project.title}
                  className={styles.image}
                  loading="lazy"
                />
              </div>

              <div className={styles.meta}>
                <div className={styles.topRow}>
                  <h3 className={styles.title}>{project.title}</h3>
                  <span className={styles.year}>{project.year}</span>
                </div>
                <p className={styles.discipline}>{project.discipline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
