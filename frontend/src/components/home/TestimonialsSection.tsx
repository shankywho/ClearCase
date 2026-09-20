import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollTrigger';
import { ThreeDIcon, ThreeDIconName } from '@/components/common/ThreeDIcon';
import styles from './TestimonialsSection.module.css';

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  category: string;
  iconName: ThreeDIconName;
}

const TESTIMONIAL_COLUMNS: TestimonialItem[][] = [
  // Column 1
  [
    {
      quote:
        'In our village, boundary ridge arguments used to delay wheat sowing for months. ClearCase allowed both farmers to speak into one phone in their own dialect. The Revenue Inspector surveyed the line, and both signed a mutual accord in fifteen minutes.',
      author: 'Ramakant Tiwari',
      role: 'Gram Pradhan, Shivpur Gram Sabha (Varanasi)',
      category: 'Boundary Accord',
      iconName: 'user-pradhan',
    },
    {
      quote:
        'The vernacular audio playback is game-changing. Many smallholders cannot read formal legal notices. Hearing the accord clauses read aloud in their native dialect establishes immediate community confidence.',
      author: 'Mohan Lal Yadav',
      role: 'Para-Legal Volunteer, District Legal Services Authority',
      category: 'Voice Accessibility',
      iconName: 'user-paralegal',
    },
  ],
  // Column 2 (Middle Bento Column)
  [
    {
      quote:
        'Extracting Khasra plot numbers and citing Section 24 of the UP Revenue Code directly before both disputants eliminated all suspicion of partiality. It turns verbal shouting into structured statutory demarcations with zero court delay.',
      author: 'Dinesh Chandra Verma',
      role: 'Revenue Inspector (Lekhpal), Sadar Tehsil',
      category: 'Cadastre Demarcation',
      iconName: 'user-lekhpal',
    },
    {
      quote:
        'During peak tubewell water turns, disputes over field irrigation channels used to cause violent village confrontations. ClearCase instant precedent matching showed how similar Chak-Marg disputes were settled in neighboring blocks, leading to immediate consensus.',
      author: 'Chaudhary Bhupender Singh',
      role: 'Panchayat Samiti Representative, Sonipat, Haryana',
      category: 'Irrigation Precedent',
      iconName: 'user-farmer',
    },
  ],
  // Column 3
  [
    {
      quote:
        'By converting voluntary compromise accords into pre-litigation petitions under Section 20 of the Legal Services Authorities Act, ClearCase provides the legal finality of a civil court decree without years of costly litigation.',
      author: 'Adv. Sunita Agarwal',
      role: 'Panel Mediator, Taluk Legal Services Committee (TLSC)',
      category: 'Section 20 Accord',
      iconName: 'user-advocate',
    },
    {
      quote:
        'The immutable Polygon blockchain audit trail and Cedar authorization checks give state administrators tamper-proof confidence. In our test blocks, village boundary court dockets dropped by 72% within one harvest cycle.',
      author: 'Dr. Arvind Kumar Jha',
      role: 'Director, Rural Access to Justice Observatory',
      category: 'Cryptographic Audit',
      iconName: 'user-scholar',
    },
  ],
];

// Flat list internal reference
const TESTIMONIALS = TESTIMONIAL_COLUMNS.flat();
void TESTIMONIALS;

export const TestimonialsSection: React.FC = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className={styles.section} aria-label="Field validation from grassroots mediators">
      <div className="container">
        {/* Header Block */}
        <div ref={headerRef} className={styles.header}>
          <h2 className={styles.headline}>
            Field Validation From Grassroots Legal Mediators
          </h2>
          <p className={styles.subheadline}>
            Over 1,400 rural boundary and tenancy disputes mediated across Varanasi, Ayodhya, and Sonipat blocks without court escalation.
          </p>
        </div>

        {/* 3-Column Staggered Bento Masonry Grid */}
        <div className={styles.bentoContainer}>
          {TESTIMONIAL_COLUMNS.map((column, colIdx) => (
            <div key={colIdx} className={styles.bentoColumn}>
              {column.map((item, itemIdx) => (
                <article key={itemIdx} className={styles.bentoCard}>
                  <div className={styles.cardTopRow}>
                    <span className={styles.categoryTag}>{item.category}</span>
                    <span className={styles.starsRating} aria-label="5 out of 5 stars">
                      ★★★★★
                    </span>
                  </div>

                  <blockquote className={styles.quoteText}>
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>

                  <div className={styles.authorRow}>
                    <div className={styles.avatarFrame}>
                      <ThreeDIcon name={item.iconName} size={32} />
                    </div>
                    <div className={styles.authorMeta}>
                      <span className={styles.authorName}>{item.author}</span>
                      <span className={styles.authorRole}>{item.role}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
