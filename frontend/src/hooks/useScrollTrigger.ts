import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  start?: string;
  yOffset?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  staggerChildren?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(options?: ScrollRevealOptions) {
  const ref = useRef<T>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const opts = optionsRef.current;
    const yOffset = opts?.yOffset ?? 32;
    const duration = opts?.duration ?? 0.85;
    const start = opts?.start ?? 'top 88%';
    const delay = opts?.delay ?? 0;
    const stagger = opts?.stagger ?? 0.08;

    const ctx = gsap.context(() => {
      // If the container has marked children, reveal them staggered; otherwise reveal container
      const targets = el.querySelectorAll('[data-reveal]');
      const animateTargets = targets.length > 0 ? targets : el;

      gsap.fromTo(
        animateTargets,
        {
          opacity: 0,
          y: yOffset,
        },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger: targets.length > 0 ? stagger : 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return ref;
}
