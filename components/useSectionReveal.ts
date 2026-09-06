'use client';

import { useEffect, type RefObject } from 'react';
import { gsap, DUR, EASE, MOTION_OK } from '@/lib/gsap';

/**
 * Shared scroll reveals for a section (§3.6, §3.7):
 *  - [data-reveal] rises from below on enter (label, title), staggered.
 *  - [data-rule] is a 1px divider that draws in left → right (scaleX) once
 *    it reaches the lower part of the viewport.
 * Reduced motion: nothing runs; the elements are visible by default.
 */
export function useSectionReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const heads = q('[data-reveal]');
      if (heads.length) {
        gsap.from(heads, {
          y: 40,
          autoAlpha: 0,
          duration: DUR.base,
          ease: EASE.out,
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        });
      }
      q<HTMLElement>('[data-rule]').forEach((rule) => {
        gsap.from(rule, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: DUR.slow,
          ease: EASE.out,
          scrollTrigger: { trigger: rule, start: 'top 92%', once: true },
        });
      });
    });

    return () => mm.revert();
  }, [ref]);
}
