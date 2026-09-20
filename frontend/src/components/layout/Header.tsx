import React, { useState, useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThreeDIcon, ThreeDIconName } from '@/components/common/ThreeDIcon';
import styles from './Header.module.css';

interface SubLinkItem {
  label: string;
  description: string;
  path: string;
  icon: ThreeDIconName;
}

interface NavLinkItem {
  label: string;
  path: string;
  isPlatform?: boolean;
}

const PLATFORM_ITEMS: SubLinkItem[] = [
  {
    label: 'Dispute Studio',
    description: 'Voice intake & statutory conciliation',
    path: '/resolve',
    icon: 'scales',
  },
  {
    label: 'Cadastre Records',
    description: 'Land parcel OCR & boundary geometry',
    path: '/land-records',
    icon: 'map',
  },
  {
    label: 'Mediator Console',
    description: 'Cedar-governed dispute signoff',
    path: '/mediator',
    icon: 'siren',
  },
  {
    label: 'Settlement Registry',
    description: 'Immutable blockchain audit trail',
    path: '/verify',
    icon: 'blockchain',
  },
];

const LINKS: NavLinkItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Platform', path: '/resolve', isPlatform: true },
  { label: 'Cases', path: '/work' },
  { label: 'Architecture', path: '/approach' },
  { label: 'Mission', path: '/about' },
  { label: 'Deploy', path: '/contact' },
];

export const Header: React.FC = () => {
  const location = useLocation();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });

  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  // Check if link matches current route
  const isLinkActive = useCallback(
    (link: NavLinkItem) => {
      if (link.isPlatform) {
        return ['/resolve', '/land-records', '/mediator', '/verify'].some((p) =>
          location.pathname.startsWith(p)
        );
      }
      if (link.path === '/') return location.pathname === '/';
      return location.pathname.startsWith(link.path);
    },
    [location.pathname]
  );

  const updateIndicator = useCallback(() => {
    if (!hoveredPath || !listRef.current) {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    const targetEl = itemRefs.current.get(hoveredPath);
    if (!targetEl) {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }

    const listRect = listRef.current.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    setIndicatorStyle({
      left: targetRect.left - listRect.left,
      width: targetRect.width,
      opacity: 1,
    });
  }, [hoveredPath]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  useEffect(() => {
    const handleResize = () => updateIndicator();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateIndicator]);

  const handlePlatformEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setHoveredPath('/resolve');
    setDropdownOpen(true);
  };

  const handlePlatformLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
      setHoveredPath(null);
    }, 160);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navContainer} aria-label="Main Navigation">
        {/* Single authentic scooped frosted-glass tab background */}
        <div className={styles.scoopBackdrop} aria-hidden="true" />

        {/* Navigation Links with animated sliding hover pill */}
        <ul
          ref={listRef}
          className={styles.linksList}
          onMouseLeave={() => {
            if (!dropdownOpen) setHoveredPath(null);
          }}
        >
          {/* Animated Magnetic Sliding Hover Pill */}
          <div
            className={styles.slidingPill}
            style={{
              transform: `translateX(${indicatorStyle.left}px)`,
              width: `${indicatorStyle.width}px`,
              opacity: indicatorStyle.opacity,
            }}
            aria-hidden="true"
          />

          {LINKS.map((link) => {
            const isActive = isLinkActive(link);
            const isHovered = link.path === hoveredPath;

            if (link.isPlatform) {
              return (
                <li
                  key={link.path}
                  className={styles.navItem}
                  onMouseEnter={handlePlatformEnter}
                  onMouseLeave={handlePlatformLeave}
                >
                  <Link
                    to={link.path}
                    ref={(el) => {
                      if (el) itemRefs.current.set(link.path, el);
                      else itemRefs.current.delete(link.path);
                    }}
                    className={`${styles.navLink} ${isActive ? styles.active : ''} ${
                      isHovered ? styles.hovered : ''
                    }`}
                  >
                    <span>{link.label}</span>
                    <span
                      className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ''}`}
                      aria-hidden="true"
                    >
                      ▾
                    </span>
                  </Link>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div
                      className={styles.dropdownCard}
                      onMouseEnter={handlePlatformEnter}
                      onMouseLeave={handlePlatformLeave}
                    >
                      <div className={styles.dropdownHeader}>
                        OPERATIONAL PLATFORM
                      </div>

                      {PLATFORM_ITEMS.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => {
                            setDropdownOpen(false);
                            setHoveredPath(null);
                          }}
                          className={styles.dropdownItem}
                        >
                          <div className={styles.dropdownIconWrapper}>
                            <ThreeDIcon name={item.icon} size={22} />
                          </div>
                          <div className={styles.dropdownItemText}>
                            <span className={styles.dropdownItemLabel}>
                              {item.label}
                            </span>
                            <span className={styles.dropdownItemDesc}>
                              {item.description}
                            </span>
                          </div>
                        </Link>
                      ))}

                      <Link
                        to="/faq"
                        onClick={() => {
                          setDropdownOpen(false);
                          setHoveredPath(null);
                        }}
                        className={styles.dropdownFooter}
                      >
                        <span>Statutory & Technical FAQ</span>
                        <span aria-hidden="true">&rsaquo;</span>
                      </Link>
                    </div>
                  )}
                </li>
              );
            }

            return (
              <li key={link.path} className={styles.navItem}>
                <Link
                  to={link.path}
                  ref={(el) => {
                    if (el) itemRefs.current.set(link.path, el);
                    else itemRefs.current.delete(link.path);
                  }}
                  onMouseEnter={() => setHoveredPath(link.path)}
                  className={`${styles.navLink} ${isActive ? styles.active : ''} ${
                    isHovered ? styles.hovered : ''
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};
