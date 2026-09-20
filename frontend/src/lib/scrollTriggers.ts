import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initLenis } from './lenis';

gsap.registerPlugin(ScrollTrigger);

export function initScrollTriggers() {
  if (typeof window === 'undefined') return;
  initLenis();
  ScrollTrigger.refresh();
}
