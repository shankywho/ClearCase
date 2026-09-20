import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MobileNav.module.css';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  links: Array<{ label: string; path: string }>;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, links }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} data-lenis-prevent>
      <div className={styles.menuContent}>
        <nav className={styles.nav}>
          <ul className={styles.list}>
            {links.map((link) => (
              <li key={link.path} className={styles.item}>
                <Link to={link.path} onClick={onClose} className={styles.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.footerActions}>
          <Link to="/pilot" onClick={onClose} className="btn-primary" style={{ width: '100%' }}>
            Deploy Pilot Mesh
          </Link>
          <div className={styles.locations}>
            <span>Varanasi</span> ✦ <span>DLSA Corridor</span>
          </div>
        </div>
      </div>
    </div>
  );
};
