import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface MagneticOptions {
  strength?: number;
  innerStrength?: number;
  innerSelector?: string;
}

/**
 * Hook to apply an authentic high-end magnetic hover effect to buttons/interactive targets.
 * Smoothly pulls the element toward the cursor within its bounding area with elastic spring recovery.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(options?: MagneticOptions) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const strength = options?.strength ?? 0.35;
    const innerStrength = options?.innerStrength ?? 0.5;
    const innerSelector = options?.innerSelector;
    const innerEl = innerSelector ? el.querySelector<HTMLElement>(innerSelector) : null;

    const ctx = gsap.context(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        gsap.to(el, {
          x: deltaX * strength,
          y: deltaY * strength,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });

        if (innerEl) {
          gsap.to(innerEl, {
            x: deltaX * innerStrength,
            y: deltaY * innerStrength,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      };

      const handleMouseLeave = () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.4)',
          overwrite: 'auto',
        });

        if (innerEl) {
          gsap.to(innerEl, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.4)',
            overwrite: 'auto',
          });
        }
      };

      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, el);

    return () => ctx.revert();
  }, [options?.strength, options?.innerStrength, options?.innerSelector]);

  return ref;
}

interface Tilt3DOptions {
  maxRotation?: number;
  perspective?: number;
  liftY?: number;
  scale?: number;
  subSelector?: string;
}

/**
 * Hook to apply a luxury 3D tilt hover effect to cards with dynamic perspective.
 */
export function useTilt3D<T extends HTMLElement = HTMLElement>(options?: Tilt3DOptions) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const maxRot = options?.maxRotation ?? 8;
    const perspective = options?.perspective ?? 900;
    const liftY = options?.liftY ?? -8;
    const scale = options?.scale ?? 1.02;
    const subSelector = options?.subSelector;
    const subEl = subSelector ? el.querySelector<HTMLElement>(subSelector) : null;

    const ctx = gsap.context(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        const rotateY = normX * maxRot * 2;
        const rotateX = -normY * maxRot * 2;

        gsap.to(el, {
          rotateX,
          rotateY,
          y: liftY,
          scale,
          transformPerspective: perspective,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        });

        if (subEl) {
          gsap.to(subEl, {
            x: normX * 12,
            y: normY * 12,
            scale: 1.08,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      };

      const handleMouseLeave = () => {
        gsap.to(el, {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: 'auto',
        });

        if (subEl) {
          gsap.to(subEl, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        }
      };

      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, el);

    return () => ctx.revert();
  }, [options?.maxRotation, options?.perspective, options?.liftY, options?.scale, options?.subSelector]);

  return ref;
}
