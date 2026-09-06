'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { gsap, ScrollTrigger, DUR, EASE, prefersReducedMotion } from '@/lib/gsap';

/**
 * Height-auto open/close for accordion panels (§3.6, §3.7). The panel starts
 * closed via CSS (height: 0; overflow: hidden). Opening tweens to the
 * natural height and staggers [data-stagger] children in; closing tweens
 * back to 0. The page height changes, so ScrollTrigger refreshes after.
 * Reduced motion: instant.
 */
export function useExpandable(ref: RefObject<HTMLElement | null>, open: boolean) {
  const mounted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Skip the initial closed render; CSS already has the panel at 0.
    if (!mounted.current) {
      mounted.current = true;
      if (!open) return;
    }
    const instant = prefersReducedMotion();
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-stagger]'));
    gsap.killTweensOf([el, ...items]);

    if (open) {
      gsap.to(el, {
        height: 'auto',
        duration: instant ? 0 : DUR.base,
        ease: EASE.out,
        onComplete: () => {
          gsap.set(el, { height: 'auto' });
          ScrollTrigger.refresh();
        },
      });
      if (items.length) {
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 8 },
          {
            autoAlpha: 1,
            y: 0,
            duration: instant ? 0 : DUR.base,
            ease: EASE.out,
            stagger: instant ? 0 : 0.05,
            delay: instant ? 0 : 0.1,
          },
        );
      }
    } else {
      gsap.to(el, {
        height: 0,
        duration: instant ? 0 : DUR.fast,
        ease: EASE.inout,
        onComplete: () => ScrollTrigger.refresh(),
      });
    }
  }, [ref, open]);
}
