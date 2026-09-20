import React from 'react';
import { Link } from 'react-router-dom';
import styles from './WorkGrid.module.css';

export interface ProjectItem {
  slug: string;
  title: string;
  client: string;
  year: string;
  categories: string[];
  disciplines: string[];
  description: string;
  image: string;
}

export const ALL_PROJECTS: ProjectItem[] = [
  {
    slug: 'land-demarcation',
    title: 'Land Boundary Demarcation',
    client: 'Varanasi Gram Sabha',
    year: '2026',
    categories: ['Land & Demarcation'],
    disciplines: ['UP Revenue Code §24', 'Lekhpal Demarcation', 'Ridge Realignment'],
    description: 'Boundary ridge trimmed by 2 feet during wheat sowing. Demarcation conducted under Section 24 with mutual stone boundary placement.',
    image: '/images/mH1dZ5k3x7s6g2bF8.png',
  },
  {
    slug: 'harvest-wages',
    title: 'Agricultural Harvest Wages',
    client: 'Gorakhpur Tehsil',
    year: '2026',
    categories: ['Labor & Wages'],
    disciplines: ['Minimum Wages Act §20', 'Direct Wage Disbursement', 'Panchayat Conciliation'],
    description: 'Three harvesters unpaid after 14 days of wheat harvesting. Settled via Section 20 statutory minimums with verified electronic payout.',
    image: '/images/3bWTAYyjV4ZJTmkBRESfDTzRXc.png',
  },
  {
    slug: 'cart-track-obstruction',
    title: 'Village Cart-Track Obstruction',
    client: 'Sultanpur Panchayat',
    year: '2026',
    categories: ['Land & Demarcation', 'Water & Rights'],
    disciplines: ['CrPC Section 133', 'Indian Easements Act', 'Passage Restoration'],
    description: 'Field access blocked with thorn hedges preventing tractor movement. Clear passage restored with neutral Gram Pradhan oversight.',
    image: '/images/0xIKofBqUVt0AtuXzeJLHdfabM.png',
  },
  {
    slug: 'tubewell-watercourse',
    title: 'Tubewell Irrigation Water Sharing',
    client: 'Azamgarh Gram Panchayat',
    year: '2026',
    categories: ['Water & Rights'],
    disciplines: ['Easements Act §15', 'Rotational Hours', 'Shared Electricity'],
    description: 'Dispute over diesel pump hours during paddy transplantation. Structured weekly irrigation schedule agreed with shared electricity costs.',
    image: '/images/yapI2qAX7XKUS0mIvxWbKIZnuE4.png',
  },
  {
    slug: 'sharecropping-division',
    title: 'Sharecropping Crop-Share Accord',
    client: 'Mirzapur Tehsil',
    year: '2026',
    categories: ['Tenancy & Lease'],
    disciplines: ['Model Tenancy Code', 'Batai Split', 'Input Cost Settlement'],
    description: 'Contested 50:50 vs 60:40 grain split following unseasonal rain damage. Compromise accord framed based on verified fertilizer receipts.',
    image: '/images/ddgvUaFoQ769eVRNXfdbQEFnU.png',
  },
  {
    slug: 'commercial-shop-tenancy',
    title: 'Commercial Village Shop Tenancy',
    client: 'Jaunpur Market Committee',
    year: '2026',
    categories: ['Tenancy & Lease'],
    disciplines: ['Transfer of Property Act §106', '3-Year Lease', 'Eviction Shield'],
    description: 'Village stallholder faced arbitrary eviction threats. Formal 3-year tenancy accord drafted with indexed annual rent adjustments.',
    image: '/images/9d4TNGFKFnZL1yoQzXNrDNFc.png',
  },
  {
    slug: 'pasture-encroachment',
    title: 'Gram Sabha Pasture Encroachment',
    client: 'Ballia Gram Sabha',
    year: '2026',
    categories: ['Land & Demarcation', 'Water & Rights'],
    disciplines: ['UP Revenue Code §67', 'Common Grazing Rights', 'Voluntary Vacation'],
    description: 'Encroachment on communal livestock pasture by private fencing. Voluntary retreat formalized preventing police intervention and penal fines.',
    image: '/images/XJfLrvkcZ2tSJc3rEFULy4IfPdE.png',
  },
  {
    slug: 'usurious-debt-escalation',
    title: 'Predatory Usury & Bond Escalation',
    client: 'Ghazipur DLSA Panel',
    year: '2026',
    categories: ['Labor & Wages'],
    disciplines: ['Usurious Loans Act', 'Coercion Gate', 'DLSA Transfer'],
    description: 'Moneylender demanded 60% compound interest and withheld identity papers. Coercion safety gate halted mediation and escalated to Legal Aid.',
    image: '/images/cHIAn4C7y1kt8RvamESmM8uCk.png',
  },
];

interface WorkGridProps {
  filter: string;
}

export const WorkGrid: React.FC<WorkGridProps> = ({ filter }) => {
  const filteredProjects = ALL_PROJECTS.filter((project) => {
    if (filter === 'All') return true;
    return project.categories.includes(filter);
  });

  return (
    <section className={styles.section} aria-label="Portfolio projects">
      <div className="container">
        <div className={styles.grid}>
          {filteredProjects.length === 0 ? (
            <div className={styles.emptyState}>
              No case studies found for category &ldquo;{filter}&rdquo;.
            </div>
          ) : (
            filteredProjects.map((proj) => (
              <Link
                key={proj.slug}
                to={`/work/${proj.slug}`}
                className={styles.card}
              >
                <div className={styles.imageWrapper}>
                  <img
                    src={proj.image}
                    alt={`${proj.title} case study showcase`}
                    className={styles.image}
                    loading="lazy"
                  />
                </div>

                <div className={styles.content}>
                  <div className={styles.metaTop}>
                    <span>{proj.client}</span>
                    <span>{proj.year}</span>
                  </div>

                  <div className={styles.titleRow}>
                    <h2 className={styles.title}>{proj.title}</h2>
                    <span className={styles.arrow} aria-hidden="true">→</span>
                  </div>

                  <p className={styles.description}>{proj.description}</p>

                  <div className={styles.tagRow}>
                    {proj.disciplines.map((d, i) => (
                      <span key={i} className={styles.tag}>
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
