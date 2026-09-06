/**
 * GSAP entry point. Import gsap and plugins from here — never from 'gsap'
 * directly — so plugins are registered exactly once and every animation
 * shares the same eases/durations as the CSS tokens in styles/tokens.css.
 *
 * Reduced motion: wrap scroll/entrance animations in
 *   gsap.matchMedia().add(MOTION_OK, () => { ... })
 * so they never run when the user prefers reduced motion. Elements must be
 * visible in their resting state without JS, so the reduced-motion path is
 * simply "no animation" (or a plain opacity fade where the brief asks for it).
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';

/** Media-query strings for gsap.matchMedia() conditions. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const MOTION_REDUCED = '(prefers-reduced-motion: reduce)';

/** Named eases — identical curves to --ease-out / --ease-inout. */
export const EASE = {
  out: 'uiOut',
  inout: 'uiInOut',
} as const;

/** Durations in seconds — identical to --dur-fast / --dur-base / --dur-slow. */
export const DUR = {
  fast: 0.35,
  base: 0.8,
  slow: 1.2,
} as const;

/** Sibling stagger in seconds — identical to --stagger. */
export const STAGGER = 0.07;

let registered = false;

if (typeof window !== 'undefined' && !registered) {
  registered = true;
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
  CustomEase.create(EASE.out, '0.22, 1, 0.36, 1');
  CustomEase.create(EASE.inout, '0.76, 0, 0.24, 1');
  gsap.defaults({ ease: EASE.out, duration: DUR.base });
}

/** True when the visitor has asked for reduced motion (false during SSR). */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(MOTION_REDUCED).matches;
}

export { gsap, ScrollTrigger, SplitText, CustomEase };
