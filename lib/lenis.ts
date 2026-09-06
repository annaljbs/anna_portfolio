/**
 * Shared Lenis configuration (§2.3). autoRaf is off on purpose: GSAP's
 * ticker drives lenis.raf() in components/SmoothScroll.tsx so ScrollTrigger
 * and Lenis advance on the same frame.
 */
import type { LenisOptions } from 'lenis';

export const LENIS_OPTIONS: LenisOptions = {
  autoRaf: false,
  lerp: 0.1,
  smoothWheel: true,
  syncTouch: false,
  wheelMultiplier: 1,
};

/** Options used when the visitor prefers reduced motion: native scrolling. */
export const LENIS_OPTIONS_REDUCED: LenisOptions = {
  ...LENIS_OPTIONS,
  smoothWheel: false,
  syncTouch: false,
};

export { useLenis } from 'lenis/react';
