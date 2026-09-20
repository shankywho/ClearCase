import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from './SparkleCursor.module.css';

interface Particle {
  id: string;
  x: number;
  y: number;
  size: number;
  driftX: number;
  driftY: number;
  opacity: number;
  startRotate: number;
  midRotate: number;
  endRotate: number;
  symbol: string;
}

const TRAIL_SYMBOLS = ['✦', '✧', '⋆', '˚', '₊', '⊹', '✺'];

export const SparkleCursor: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const cursorRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isMouseDownRef = useRef(false);
  const isEnabledRef = useRef(false);

  const spacing = 70; // ms between trail particles (exact Framer specification)
  const duration = 900; // ms lifetime (exact Framer specification)
  const maxParticles = 24;

  const updateCursorTransform = useCallback(() => {
    if (!cursorRef.current) return;
    const isHovered = isHoveredRef.current;
    const isMouseDown = isMouseDownRef.current;

    const scale = isMouseDown ? 1.2 : isHovered ? 1.5 : 1;
    const rotation = isMouseDown ? 10 : isHovered ? -20 : 0;

    cursorRef.current.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }
    isEnabledRef.current = true;

    // Check if target is interactive (a, button, role=button, pointer cursor)
    const checkInteractive = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof Element)) return false;
      const el = target.closest('a, button, input, textarea, select, [role="button"], [role="link"], [data-cursor-hover]');
      if (el) return true;

      try {
        const computed = window.getComputedStyle(target);
        if (computed.cursor === 'pointer') return true;
      } catch {
        // ignore style read error
      }
      return false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Direct high-performance tracking of primary cursor
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
        cursorRef.current.style.opacity = '1';
      }

      // Check hover state
      const isInteractive = checkInteractive(e.target);
      if (isInteractive !== isHoveredRef.current) {
        isHoveredRef.current = isInteractive;
        updateCursorTransform();
      }

      // Trail generation throttle
      const now = Date.now();
      if (now - lastTimeRef.current < spacing) return;
      lastTimeRef.current = now;

      const pId = `${now}-${Math.random().toString(36).slice(2, 6)}`;
      const symbol = TRAIL_SYMBOLS[Math.floor(Math.random() * TRAIL_SYMBOLS.length)];
      const startR = Math.random() * 120 - 60;
      const midR = startR + Math.random() * 180;
      const endR = startR + Math.random() * 360;

      // Drift in legacy Framer is up to 140px
      const driftDist = (Math.random() * 0.8 + 0.2) * 70;
      const driftAngle = Math.random() * Math.PI * 2;

      const newParticle: Particle = {
        id: pId,
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 12 + 10, // 10px - 22px
        driftX: Math.cos(driftAngle) * driftDist,
        driftY: Math.sin(driftAngle) * driftDist,
        opacity: 0.9,
        startRotate: startR,
        midRotate: midR,
        endRotate: endR,
        symbol,
      };

      setParticles((prev) => [...prev.slice(-maxParticles), newParticle]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== pId));
      }, duration);
    };

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDownRef.current = true;
      updateCursorTransform();

      // Spawn click burst (8-10 particles exploding radially)
      const now = Date.now();
      const burstCount = 10;
      const burstParticles: Particle[] = [];

      for (let i = 0; i < burstCount; i++) {
        const pId = `burst-${now}-${i}`;
        const angle = (i / burstCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const dist = Math.random() * 70 + 40;
        const startR = Math.random() * 120 - 60;

        burstParticles.push({
          id: pId,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 10 + 12,
          driftX: Math.cos(angle) * dist,
          driftY: Math.sin(angle) * dist,
          opacity: 0.95,
          startRotate: startR,
          midRotate: startR + 180,
          endRotate: startR + 360,
          symbol: TRAIL_SYMBOLS[i % TRAIL_SYMBOLS.length],
        });
      }

      setParticles((prev) => [...prev.slice(-maxParticles), ...burstParticles]);

      setTimeout(() => {
        const burstIds = new Set(burstParticles.map((b) => b.id));
        setParticles((prev) => prev.filter((p) => !burstIds.has(p.id)));
      }, duration);
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
      updateCursorTransform();
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0';
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [updateCursorTransform]);

  return (
    <div className={styles.cursorCanvas} aria-hidden="true">
      {/* Primary pointer-locked star cursor */}
      <div
        ref={cursorRef}
        className={styles.mainCursor}
      >
        ✦
      </div>

      {/* Trailing sparkle particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className={styles.particle}
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            // Custom properties for keyframe framerCursorPopAway
            ['--x' as string]: p.driftX,
            ['--y' as string]: p.driftY,
            ['--start-rotate' as string]: `${p.startRotate}deg`,
            ['--mid-rotate' as string]: `${p.midRotate}deg`,
            ['--end-rotate' as string]: `${p.endRotate}deg`,
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
};
