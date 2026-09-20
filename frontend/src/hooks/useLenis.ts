import { useEffect } from 'react';
import { initLenis, destroyLenis } from '@/lib/lenis';

export function useLenis() {
  useEffect(() => {
    initLenis();
    document.documentElement.classList.add('lenis', 'lenis-smooth');

    return () => {
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
      destroyLenis();
    };
  }, []);
}
