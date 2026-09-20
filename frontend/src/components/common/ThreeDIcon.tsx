import React from 'react';

export type ThreeDIconName =
  | 'scales'
  | 'map'
  | 'compass'
  | 'ruler'
  | 'siren'
  | 'search'
  | 'clipboard'
  | 'blockchain'
  | 'petition'
  | 'speaker'
  | 'mic'
  | 'bulb'
  | 'printer'
  | 'shield'
  | 'user'
  | 'user-pradhan'
  | 'user-lekhpal'
  | 'user-advocate'
  | 'user-paralegal'
  | 'user-farmer'
  | 'user-scholar';

interface ThreeDIconProps {
  name: ThreeDIconName;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ThreeDIcon: React.FC<ThreeDIconProps> = ({
  name,
  size = 24,
  className = '',
  style = {},
}) => {
  const s = size;

  switch (name) {
    case 'scales':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 4px 8px rgba(217, 119, 6, 0.25))', ...style }}
        >
          <defs>
            <linearGradient id="goldBeam" x1="0" y1="0" x2="64" y2="10" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="30%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="goldPillar" x1="28" y1="10" x2="36" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
            <linearGradient id="panGrad" x1="0" y1="0" x2="20" y2="10" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="60%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <radialGradient id="sphereLight" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#92400e" />
            </radialGradient>
            <filter id="glow3d" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.25" />
            </filter>
          </defs>
          {/* Base pedestal */}
          <ellipse cx="32" cy="56" rx="20" ry="5" fill="#451a03" opacity="0.4" />
          <path d="M18 55 C18 52, 46 52, 46 55 L44 58 L20 58 Z" fill="url(#goldBeam)" filter="url(#glow3d)" />
          {/* Central Pillar */}
          <rect x="30" y="14" width="4" height="42" rx="2" fill="url(#goldPillar)" filter="url(#glow3d)" />
          {/* Top Sphere finial */}
          <circle cx="32" cy="13" r="5" fill="url(#sphereLight)" filter="url(#glow3d)" />
          {/* Balance crossbeam */}
          <rect x="8" y="18" width="48" height="4.5" rx="2.25" fill="url(#goldBeam)" filter="url(#glow3d)" />
          {/* Left Strings */}
          <line x1="14" y1="21" x2="6" y2="35" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="14" y1="21" x2="22" y2="35" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
          {/* Left Pan */}
          <path d="M5 35 Q14 44 23 35 Z" fill="url(#panGrad)" filter="url(#glow3d)" />
          <ellipse cx="14" cy="35" rx="9" ry="2.5" fill="#fde68a" opacity="0.6" />
          {/* Right Strings */}
          <line x1="50" y1="21" x2="42" y2="35" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="50" y1="21" x2="58" y2="35" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
          {/* Right Pan */}
          <path d="M41 35 Q50 44 59 35 Z" fill="url(#panGrad)" filter="url(#glow3d)" />
          <ellipse cx="50" cy="35" rx="9" ry="2.5" fill="#fde68a" opacity="0.6" />
        </svg>
      );

    case 'map':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 6px 12px rgba(16, 185, 129, 0.2))', ...style }}
        >
          <defs>
            <linearGradient id="mapFold1" x1="8" y1="14" x2="24" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="mapFold2" x1="24" y1="8" x2="40" y2="46" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="mapFold3" x1="40" y1="14" x2="56" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#d1fae5" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <radialGradient id="pinHead" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fca5a5" />
              <stop offset="60%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </radialGradient>
          </defs>
          {/* Shadow */}
          <ellipse cx="32" cy="57" rx="22" ry="4" fill="#000000" opacity="0.15" />
          {/* Fold 1 (Left) */}
          <path d="M8 16 L24 10 L24 48 L8 54 Z" fill="url(#mapFold1)" />
          {/* Fold 2 (Center) */}
          <path d="M24 10 L40 16 L40 54 L24 48 Z" fill="url(#mapFold2)" />
          {/* Fold 3 (Right) */}
          <path d="M40 16 L56 10 L56 48 L40 54 Z" fill="url(#mapFold3)" />
          {/* Grid lines & Cadastral boundaries */}
          <path d="M12 28 Q18 24 24 29 T40 26 T52 22" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeDasharray="3 2" fill="none" />
          <path d="M14 42 Q20 37 24 40 T40 38 T50 34" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeDasharray="3 2" fill="none" />
          {/* 3D Map Pin */}
          <path d="M32 38 L32 28" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="22" r="6" fill="url(#pinHead)" />
          <ellipse cx="30" cy="20" rx="2" ry="1.2" fill="#ffffff" opacity="0.8" />
        </svg>
      );

    case 'compass':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))', ...style }}
        >
          <defs>
            <linearGradient id="compassRing" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#f59e0b" />
              <stop offset="80%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
            <linearGradient id="needleNorth" x1="32" y1="12" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
            <linearGradient id="needleSouth" x1="32" y1="32" x2="32" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>
          <ellipse cx="32" cy="58" rx="22" ry="4" fill="#000000" opacity="0.12" />
          {/* Outer Bezel */}
          <circle cx="32" cy="32" r="26" fill="url(#compassRing)" />
          {/* Inner Dial Face */}
          <circle cx="32" cy="32" r="21" fill="#0f172a" />
          <circle cx="32" cy="32" r="19.5" fill="#1e293b" />
          {/* Cardinal Ticks */}
          <line x1="32" y1="15" x2="32" y2="18" stroke="#ffffff" strokeWidth="1.8" />
          <line x1="32" y1="46" x2="32" y2="49" stroke="#ffffff" strokeWidth="1.8" />
          <line x1="15" y1="32" x2="18" y2="32" stroke="#ffffff" strokeWidth="1.8" />
          <line x1="46" y1="32" x2="49" y2="32" stroke="#ffffff" strokeWidth="1.8" />
          {/* 3D Faceted Needle North */}
          <path d="M32 12 L36 32 L32 30 Z" fill="#f87171" />
          <path d="M32 12 L28 32 L32 30 Z" fill="url(#needleNorth)" />
          {/* 3D Faceted Needle South */}
          <path d="M32 52 L36 32 L32 34 Z" fill="#94a3b8" />
          <path d="M32 52 L28 32 L32 34 Z" fill="url(#needleSouth)" />
          {/* Center Pivot */}
          <circle cx="32" cy="32" r="3.5" fill="#fbbf24" />
          <circle cx="31" cy="31" r="1" fill="#ffffff" />
        </svg>
      );

    case 'ruler':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 4px 10px rgba(217, 119, 6, 0.2))', ...style }}
        >
          <defs>
            <linearGradient id="rulerGrad" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
          <ellipse cx="32" cy="56" rx="22" ry="4" fill="#000000" opacity="0.12" />
          {/* 3D Drafting Triangle */}
          <path d="M10 52 L54 52 L10 8 Z" fill="url(#rulerGrad)" />
          <path d="M18 46 L42 46 L18 22 Z" fill="#ffffff" opacity="0.9" />
          {/* Ticks on hypotenuse & base */}
          <line x1="14" y1="52" x2="14" y2="48" stroke="#451a03" strokeWidth="1.5" />
          <line x1="20" y1="52" x2="20" y2="49" stroke="#451a03" strokeWidth="1" />
          <line x1="26" y1="52" x2="26" y2="48" stroke="#451a03" strokeWidth="1.5" />
          <line x1="32" y1="52" x2="32" y2="49" stroke="#451a03" strokeWidth="1" />
          <line x1="38" y1="52" x2="38" y2="48" stroke="#451a03" strokeWidth="1.5" />
          <line x1="44" y1="52" x2="44" y2="49" stroke="#451a03" strokeWidth="1" />
          <line x1="50" y1="52" x2="50" y2="48" stroke="#451a03" strokeWidth="1.5" />
        </svg>
      );

    case 'siren':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 4px 12px rgba(220, 38, 38, 0.35))', ...style }}
        >
          <defs>
            <linearGradient id="sirenDome" x1="16" y1="12" x2="48" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fca5a5" />
              <stop offset="30%" stopColor="#ef4444" />
              <stop offset="80%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>
            <linearGradient id="chromeBase" x1="12" y1="42" x2="52" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
          </defs>
          <ellipse cx="32" cy="56" rx="20" ry="4" fill="#000000" opacity="0.2" />
          {/* Base */}
          <rect x="14" y="44" width="36" height="10" rx="3" fill="url(#chromeBase)" />
          {/* Dome Light */}
          <path d="M18 44 C18 20, 46 20, 46 44 Z" fill="url(#sirenDome)" />
          {/* Specular Highlight */}
          <path d="M22 40 C22 26, 32 24, 34 24 C31 28, 30 36, 30 40 Z" fill="#ffffff" opacity="0.6" />
          {/* Glow Ray */}
          <circle cx="32" cy="30" r="18" fill="rgba(239, 68, 68, 0.15)" />
        </svg>
      );

    case 'search':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))', ...style }}
        >
          <defs>
            <linearGradient id="lensRing" x1="12" y1="12" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
            <linearGradient id="handleGrad" x1="36" y1="36" x2="56" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#d4d4d8" />
              <stop offset="40%" stopColor="#71717a" />
              <stop offset="100%" stopColor="#27272a" />
            </linearGradient>
            <radialGradient id="glassReflection" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
              <stop offset="60%" stopColor="rgba(191,219,254,0.3)" />
              <stop offset="100%" stopColor="rgba(96,165,250,0.1)" />
            </radialGradient>
          </defs>
          {/* Handle */}
          <line x1="38" y1="38" x2="54" y2="54" stroke="url(#handleGrad)" strokeWidth="7" strokeLinecap="round" />
          {/* Outer Ring */}
          <circle cx="26" cy="26" r="16" fill="url(#glassReflection)" stroke="url(#lensRing)" strokeWidth="4.5" />
          {/* Crescent Specular Glint */}
          <path d="M18 20 A 10 10 0 0 1 30 18" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'clipboard':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12))', ...style }}
        >
          <defs>
            <linearGradient id="clipBoardBase" x1="14" y1="10" x2="50" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="silverClip" x1="24" y1="6" x2="40" y2="16" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>
          <ellipse cx="32" cy="57" rx="18" ry="4" fill="#000000" opacity="0.15" />
          {/* Board */}
          <rect x="14" y="10" width="36" height="46" rx="5" fill="url(#clipBoardBase)" />
          {/* Paper Sheet */}
          <rect x="18" y="14" width="28" height="38" rx="2" fill="#ffffff" />
          {/* Text lines */}
          <line x1="22" y1="24" x2="38" y2="24" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="30" x2="42" y2="30" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="36" x2="36" y2="36" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
          {/* Checkmark in emerald */}
          <path d="M22 44 L26 48 L36 38" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Metallic Clip at Top */}
          <rect x="24" y="7" width="16" height="8" rx="3" fill="url(#silverClip)" />
          <circle cx="32" cy="11" r="2" fill="#1e293b" />
        </svg>
      );

    case 'blockchain':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 4px 10px rgba(16, 185, 129, 0.25))', ...style }}
        >
          <defs>
            <linearGradient id="cubeTop" x1="16" y1="16" x2="48" y2="16" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="cubeLeft" x1="16" y1="28" x2="32" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="cubeRight" x1="32" y1="28" x2="48" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#065f46" />
              <stop offset="100%" stopColor="#022c22" />
            </linearGradient>
          </defs>
          <ellipse cx="32" cy="56" rx="18" ry="4" fill="#000000" opacity="0.2" />
          {/* 3D Isometric Cube */}
          {/* Top Face */}
          <path d="M32 12 L48 21 L32 30 L16 21 Z" fill="url(#cubeTop)" />
          {/* Left Face */}
          <path d="M16 21 L32 30 L32 48 L16 39 Z" fill="url(#cubeLeft)" />
          {/* Right Face */}
          <path d="M32 30 L48 21 L48 39 L32 48 Z" fill="url(#cubeRight)" />
          {/* Internal Glowing Core Nodes */}
          <circle cx="32" cy="21" r="2.5" fill="#ecfdf5" />
          <path d="M32 21 L32 30" stroke="#a7f3d0" strokeWidth="1.5" />
        </svg>
      );

    case 'petition':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12))', ...style }}
        >
          <defs>
            <linearGradient id="docParchment" x1="14" y1="8" x2="50" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <linearGradient id="waxSeal" x1="36" y1="40" x2="48" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="50%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>
          </defs>
          <ellipse cx="32" cy="58" rx="18" ry="3.5" fill="#000000" opacity="0.12" />
          {/* Document Body with folded corner */}
          <path d="M16 8 L40 8 L50 18 L50 54 C50 56, 48 57, 46 57 L16 57 C14 57, 12 56, 12 54 L12 11 C12 9, 14 8, 16 8 Z" fill="url(#docParchment)" />
          {/* Folded Corner */}
          <path d="M40 8 L40 18 L50 18 Z" fill="#cbd5e1" />
          {/* Legal Document Lines */}
          <line x1="18" y1="20" x2="34" y2="20" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="26" x2="44" y2="26" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="32" x2="42" y2="32" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="38" x2="32" y2="38" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          {/* Official Red Wax Seal */}
          <circle cx="42" cy="46" r="6" fill="url(#waxSeal)" />
          <path d="M39 52 L42 58 L45 52" fill="#b91c1c" />
        </svg>
      );

    case 'speaker':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.15))', ...style }}
        >
          <defs>
            <linearGradient id="speakerCone" x1="10" y1="24" x2="34" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
          <path d="M12 25 L22 25 L34 15 L34 49 L22 39 L12 39 Z" fill="url(#speakerCone)" />
          {/* 3D Sound Waves */}
          <path d="M40 22 C44 26, 44 38, 40 42" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
          <path d="M47 16 C53 22, 53 42, 47 48" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'mic':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 4px 10px rgba(239, 68, 68, 0.3))', ...style }}
        >
          <defs>
            <linearGradient id="micBody" x1="22" y1="10" x2="42" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="50%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <linearGradient id="micStem" x1="28" y1="36" x2="36" y2="54" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>
          {/* Capsule */}
          <rect x="24" y="10" width="16" height="26" rx="8" fill="url(#micBody)" />
          {/* Mesh Texture */}
          <line x1="26" y1="17" x2="38" y2="17" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
          <line x1="26" y1="21" x2="38" y2="21" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
          {/* U-Cradle */}
          <path d="M19 26 C19 36, 45 36, 45 26" stroke="#475569" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          {/* Stand */}
          <line x1="32" y1="38" x2="32" y2="50" stroke="url(#micStem)" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="32" cy="52" rx="12" ry="3" fill="#334155" />
        </svg>
      );

    case 'bulb':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 4px 10px rgba(245, 158, 11, 0.3))', ...style }}
        >
          <defs>
            <linearGradient id="bulbGlow" x1="16" y1="8" x2="48" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          <path d="M22 38 C16 33, 14 24, 18 17 C22 10, 32 8, 39 12 C46 16, 48 26, 44 33 C42 36, 40 37, 39 40 L25 40 C24 39, 23 38, 22 38 Z" fill="url(#bulbGlow)" />
          {/* Filament */}
          <path d="M28 26 Q32 20 36 26" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Screw Base */}
          <rect x="26" y="42" width="12" height="4" rx="1.5" fill="#94a3b8" />
          <rect x="27" y="47" width="10" height="3" rx="1" fill="#64748b" />
          <ellipse cx="32" cy="51" rx="3.5" ry="1.5" fill="#334155" />
        </svg>
      );

    case 'printer':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))', ...style }}
        >
          <defs>
            <linearGradient id="printerBody" x1="12" y1="20" x2="52" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="paperSheet" x1="20" y1="6" x2="44" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f8fafc" />
            </linearGradient>
          </defs>
          {/* Paper input from top */}
          <rect x="20" y="8" width="24" height="18" rx="2" fill="url(#paperSheet)" stroke="#e2e8f0" strokeWidth="1" />
          <line x1="24" y1="14" x2="38" y2="14" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="24" y1="18" x2="34" y2="18" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
          {/* Main Printer Chassis */}
          <rect x="10" y="24" width="44" height="24" rx="4" fill="url(#printerBody)" />
          {/* Top Bevel Highlight */}
          <rect x="11" y="25" width="42" height="2" rx="1" fill="#ffffff" opacity="0.6" />
          {/* Front Output Slot */}
          <rect x="16" y="34" width="32" height="6" rx="1.5" fill="#1e293b" />
          {/* Paper Out from Slot */}
          <path d="M18 36 L46 36 L44 54 L20 54 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
          <line x1="22" y1="42" x2="40" y2="42" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="22" y1="46" x2="36" y2="46" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="22" y1="50" x2="32" y2="50" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
          {/* Status LED */}
          <circle cx="48" cy="29" r="2" fill="#10b981" />
        </svg>
      );

    case 'shield':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 4px 10px rgba(16, 185, 129, 0.25))', ...style }}
        >
          <defs>
            <linearGradient id="shieldRim" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="40%" stopColor="#059669" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
            <linearGradient id="shieldFace" x1="16" y1="12" x2="48" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="60%" stopColor="#047857" />
              <stop offset="100%" stopColor="#022c22" />
            </linearGradient>
          </defs>
          {/* Shield Outer Rim */}
          <path d="M32 6 L52 14 C52 34, 43 49, 32 58 C21 49, 12 34, 12 14 Z" fill="url(#shieldRim)" />
          {/* Shield Inner Face */}
          <path d="M32 10 L48 17 C48 33, 40 45, 32 53 C24 45, 16 33, 16 17 Z" fill="url(#shieldFace)" />
          {/* Specular Highlight on Left */}
          <path d="M32 10 L20 18 C19 32, 25 43, 32 50 Z" fill="#ffffff" opacity="0.12" />
          {/* Center Check / Emblem */}
          <path d="M26 31 L30 35 L38 25" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'user':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 4px 10px rgba(15, 23, 42, 0.15))', ...style }}
        >
          <defs>
            <linearGradient id="userFaceGrad" x1="20" y1="12" x2="44" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="70%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
            <linearGradient id="userBodyGrad" x1="14" y1="42" x2="50" y2="62" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="userHairGrad" x1="20" y1="10" x2="44" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          {/* 3D Shoulders & Torso */}
          <path d="M12 56 C12 43, 20 38, 32 38 C44 38, 52 43, 52 56 C52 58, 48 60, 32 60 C16 60, 12 58, 12 56 Z" fill="url(#userBodyGrad)" />
          {/* Neck with cast shadow */}
          <path d="M28 34 L36 34 L36 41 L28 41 Z" fill="#ea580c" opacity="0.6" />
          <path d="M28 32 L36 32 L36 38 L28 38 Z" fill="#fb923c" />
          {/* 3D Head */}
          <ellipse cx="32" cy="24" rx="12" ry="14" fill="url(#userFaceGrad)" />
          {/* Hair */}
          <path d="M20 22 C20 12, 25 9, 32 9 C39 9, 44 12, 44 22 C41 18, 38 16, 32 16 C26 16, 23 18, 20 22 Z" fill="url(#userHairGrad)" />
          {/* Collar detail */}
          <path d="M28 40 L32 46 L36 40" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'user-pradhan':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 4px 10px rgba(217, 119, 6, 0.25))', ...style }}
        >
          <defs>
            <linearGradient id="pradhanTurban" x1="16" y1="6" x2="48" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="25%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <linearGradient id="pradhanKurta" x1="12" y1="40" x2="52" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#f5f5f4" />
              <stop offset="100%" stopColor="#d6d3d1" />
            </linearGradient>
            <linearGradient id="pradhanFace" x1="20" y1="16" x2="44" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="60%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
          </defs>
          {/* White Khadi Kurta Torso */}
          <path d="M12 56 C12 43, 20 38, 32 38 C44 38, 52 43, 52 56 C52 58, 48 60, 32 60 C16 60, 12 58, 12 56 Z" fill="url(#pradhanKurta)" />
          {/* Kurta Placket & Gold Button */}
          <path d="M32 40 L32 54" stroke="#e7e5e4" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="45" r="1.5" fill="#f59e0b" />
          <circle cx="32" cy="50" r="1.5" fill="#f59e0b" />
          {/* Neck */}
          <path d="M28 32 L36 32 L36 40 L28 40 Z" fill="#ea580c" />
          {/* Head */}
          <ellipse cx="32" cy="26" rx="11" ry="13" fill="url(#pradhanFace)" />
          {/* Traditional 3D Turban with folds */}
          <path d="M18 19 C18 11, 23 6, 32 6 C41 6, 46 11, 46 19 C42 16, 36 15, 32 15 C27 15, 22 16, 18 19 Z" fill="url(#pradhanTurban)" />
          <path d="M17 17 C22 12, 28 10, 35 11 C42 12, 47 16, 47 19" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          <circle cx="32" cy="11" r="2.5" fill="#fef08a" />
          {/* Traditional Mustache */}
          <path d="M25 32 C27 30, 30 31, 32 33 C34 31, 37 30, 39 32 C38 34, 34 35, 32 34 C30 35, 26 34, 25 32 Z" fill="#1c1917" />
        </svg>
      );

    case 'user-lekhpal':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 4px 10px rgba(71, 85, 105, 0.25))', ...style }}
        >
          <defs>
            <linearGradient id="lekhpalJacket" x1="12" y1="40" x2="52" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a3a3a3" />
              <stop offset="50%" stopColor="#737373" />
              <stop offset="100%" stopColor="#404040" />
            </linearGradient>
            <linearGradient id="lekhpalFace" x1="20" y1="16" x2="44" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffedd5" />
              <stop offset="60%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
          </defs>
          {/* Government Safari Jacket */}
          <path d="M12 56 C12 43, 20 38, 32 38 C44 38, 52 43, 52 56 C52 58, 48 60, 32 60 C16 60, 12 58, 12 56 Z" fill="url(#lekhpalJacket)" />
          {/* Pocket & Pen Detail */}
          <rect x="37" y="45" width="8" height="9" rx="1.5" fill="#525252" />
          <line x1="41" y1="43" x2="41" y2="47" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
          {/* Inner Shirt Collar */}
          <path d="M28 38 L32 44 L36 38" fill="#ffffff" />
          {/* Neck */}
          <path d="M28 32 L36 32 L36 39 L28 39 Z" fill="#ea580c" />
          {/* Head */}
          <ellipse cx="32" cy="24" rx="11" ry="13" fill="url(#lekhpalFace)" />
          {/* Neat Parted Hair */}
          <path d="M20 22 C20 11, 26 9, 34 9 C41 9, 44 12, 44 20 C42 17, 36 15, 30 15 C24 15, 21 18, 20 22 Z" fill="#1e293b" />
          {/* Rectangular Glasses */}
          <rect x="23" y="21" width="7" height="5" rx="1.5" stroke="#0f172a" strokeWidth="1.5" fill="rgba(56, 189, 248, 0.2)" />
          <rect x="34" y="21" width="7" height="5" rx="1.5" stroke="#0f172a" strokeWidth="1.5" fill="rgba(56, 189, 248, 0.2)" />
          <line x1="30" y1="23.5" x2="34" y2="23.5" stroke="#0f172a" strokeWidth="1.5" />
        </svg>
      );

    case 'user-advocate':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 4px 10px rgba(15, 23, 42, 0.3))', ...style }}
        >
          <defs>
            <linearGradient id="advocateRobe" x1="12" y1="40" x2="52" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#090d16" />
            </linearGradient>
            <linearGradient id="advocateFace" x1="20" y1="16" x2="44" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="60%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
            <linearGradient id="advocateHair" x1="18" y1="8" x2="46" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          {/* Black Judicial Advocate Robe */}
          <path d="M12 56 C12 43, 20 38, 32 38 C44 38, 52 43, 52 56 C52 58, 48 60, 32 60 C16 60, 12 58, 12 56 Z" fill="url(#advocateRobe)" />
          {/* White Advocate Bands (Legal Collar) */}
          <path d="M29 41 L29 52 L31.5 50 L31.5 41 Z" fill="#ffffff" />
          <path d="M32.5 41 L32.5 50 L35 52 L35 41 Z" fill="#ffffff" />
          <rect x="28" y="38" width="8" height="3" rx="0.5" fill="#f8fafc" />
          {/* Neck */}
          <path d="M28 32 L36 32 L36 38 L28 38 Z" fill="#ea580c" />
          {/* Head */}
          <ellipse cx="32" cy="24" rx="10.5" ry="12.5" fill="url(#advocateFace)" />
          {/* Professional Sleek Hair / Bob */}
          <path d="M19 24 C19 12, 24 8, 32 8 C40 8, 45 12, 45 24 C45 28, 43 30, 41 28 C41 20, 38 15, 32 15 C26 15, 23 20, 23 28 C21 30, 19 28, 19 24 Z" fill="url(#advocateHair)" />
        </svg>
      );

    case 'user-paralegal':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 4px 10px rgba(5, 150, 105, 0.25))', ...style }}
        >
          <defs>
            <linearGradient id="paraVest" x1="12" y1="40" x2="52" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="paraFace" x1="20" y1="16" x2="44" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffedd5" />
              <stop offset="60%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
          </defs>
          {/* Emerald DLSA Volunteer Polo / Vest */}
          <path d="M12 56 C12 43, 20 38, 32 38 C44 38, 52 43, 52 56 C52 58, 48 60, 32 60 C16 60, 12 58, 12 56 Z" fill="url(#paraVest)" />
          {/* Volunteer Badge Pin */}
          <circle cx="39" cy="46" r="3" fill="#ffffff" />
          <circle cx="39" cy="46" r="1.8" fill="#059669" />
          {/* Inner White Tee */}
          <path d="M29 38 L32 43 L35 38" fill="#ffffff" />
          {/* Neck */}
          <path d="M28 32 L36 32 L36 39 L28 39 Z" fill="#ea580c" />
          {/* Head */}
          <ellipse cx="32" cy="24" rx="11" ry="13" fill="url(#paraFace)" />
          {/* Youthful Modern Crop Hair */}
          <path d="M20 21 C20 12, 25 8, 32 8 C39 8, 44 12, 44 21 C41 17, 36 15, 32 15 C28 15, 23 17, 20 21 Z" fill="#1e293b" />
          <path d="M30 8 L32 5 L34 8" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'user-farmer':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 4px 10px rgba(220, 38, 38, 0.2))', ...style }}
        >
          <defs>
            <linearGradient id="farmerGamcha" x1="16" y1="36" x2="48" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="50%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <linearGradient id="farmerFace" x1="20" y1="16" x2="44" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fdba74" />
              <stop offset="60%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#9a3412" />
            </linearGradient>
          </defs>
          {/* Cotton Shirt Torso */}
          <path d="M12 56 C12 43, 20 38, 32 38 C44 38, 52 43, 52 56 C52 58, 48 60, 32 60 C16 60, 12 58, 12 56 Z" fill="#f5f5f4" />
          {/* Traditional Checkered Gamcha Scarf Draped Around Neck */}
          <path d="M22 36 C22 46, 25 54, 27 58 C28 58, 30 54, 29 44 C31 46, 33 46, 35 44 C34 54, 36 58, 37 58 C39 54, 42 46, 42 36 C37 40, 27 40, 22 36 Z" fill="url(#farmerGamcha)" />
          {/* Gamcha Texture Lines */}
          <line x1="24" y1="46" x2="28" y2="46" stroke="#ffffff" strokeWidth="1" strokeDasharray="1 1" />
          <line x1="36" y1="46" x2="40" y2="46" stroke="#ffffff" strokeWidth="1" strokeDasharray="1 1" />
          {/* Neck */}
          <path d="M28 32 L36 32 L36 38 L28 38 Z" fill="#c2410c" />
          {/* Head */}
          <ellipse cx="32" cy="24" rx="11" ry="13" fill="url(#farmerFace)" />
          {/* Salt & Pepper Hair */}
          <path d="M20 22 C20 12, 25 9, 32 9 C39 9, 44 12, 44 22 C41 18, 37 16, 32 16 C27 16, 23 18, 20 22 Z" fill="#334155" />
          <path d="M28 10 L30 14" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M34 10 L33 14" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    case 'user-scholar':
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 4px 10px rgba(30, 58, 138, 0.25))', ...style }}
        >
          <defs>
            <linearGradient id="scholarBlazer" x1="12" y1="40" x2="52" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="50%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#172554" />
            </linearGradient>
            <linearGradient id="scholarFace" x1="20" y1="16" x2="44" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffedd5" />
              <stop offset="60%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
          </defs>
          {/* Navy Academic Tweed Blazer */}
          <path d="M12 56 C12 43, 20 38, 32 38 C44 38, 52 43, 52 56 C52 58, 48 60, 32 60 C16 60, 12 58, 12 56 Z" fill="url(#scholarBlazer)" />
          {/* Light Blue Oxford Shirt Collar & Tie */}
          <path d="M28 38 L32 44 L36 38" fill="#e0f2fe" />
          <path d="M31 43 L33 43 L32.5 52 L31.5 52 Z" fill="#991b1b" />
          {/* Neck */}
          <path d="M28 32 L36 32 L36 39 L28 39 Z" fill="#ea580c" />
          {/* Head */}
          <ellipse cx="32" cy="24" rx="11" ry="13" fill="url(#scholarFace)" />
          {/* Silver Streaked Hair */}
          <path d="M20 22 C20 11, 26 9, 34 9 C41 9, 44 12, 44 20 C42 17, 36 15, 30 15 C24 15, 21 18, 20 22 Z" fill="#334155" />
          <path d="M27 10 L28 15" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />
          {/* Circular Horn-Rimmed Glasses */}
          <circle cx="27" cy="23" r="3.8" stroke="#1e293b" strokeWidth="1.5" fill="rgba(224, 242, 254, 0.2)" />
          <circle cx="37" cy="23" r="3.8" stroke="#1e293b" strokeWidth="1.5" fill="rgba(224, 242, 254, 0.2)" />
          <line x1="30.8" y1="23" x2="33.2" y2="23" stroke="#1e293b" strokeWidth="1.5" />
        </svg>
      );

    default:
      return null;
  }
};
