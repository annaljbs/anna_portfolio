'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import styles from './ScrollProgress.module.css';

/**
 * 4px bar pinned to the bottom of the page frame that fills left→right with
 * scroll (§2.3). It is state, not motion, so it also runs under
 * prefers-reduced-motion. Blended with the page (see the CSS module) so it
 * stays visible on both themes, and below the frame in z-order so the frame's
 * rounded corners mask its ends.
 */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: true },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return <div ref={ref} className={styles.bar} aria-hidden="true" />;
}
