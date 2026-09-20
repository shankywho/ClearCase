import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const lenisOptions = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical' as const,
  gestureOrientation: 'vertical' as const,
  smoothWheel: true,
  syncTouch: false,
  syncTouchLerp: 0.075,
  touchInertiaMultiplier: 35,
  touchMultiplier: 1,
  wheelMultiplier: 1,
  lerp: 0.1,
  infinite: false,
  autoResize: true,
};

let lenisInstance: Lenis | null = null;
let tickerListener: ((time: number) => void) | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function initLenis(): Lenis {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis(lenisOptions);

  // Synchronize Lenis scroll updates with GSAP ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update);

  // Single authoritative ticker drive via GSAP ticker
  tickerListener = (time: number) => {
    lenisInstance?.raf(time * 1000);
  };
  gsap.ticker.add(tickerListener);
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function destroyLenis() {
  if (lenisInstance) {
    if (tickerListener) {
      gsap.ticker.remove(tickerListener);
      tickerListener = null;
    }
    lenisInstance.destroy();
    lenisInstance = null;
  }
}
