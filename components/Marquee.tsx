'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';
import { gsap, MOTION_OK } from '@/lib/gsap';
import { site } from '@/content/site';
import styles from './Marquee.module.css';

const LOOP_SECONDS = 20;
const REPEATS_PER_HALF = 3;
const MAX_BOOST = 4;

/**
 * Full-width name marquee below the hero (§3.2, charly): a monogram badge
 * between repeats, xPercent 0 → -50 on a linear loop, sped up by scroll
 * velocity. Reduced motion: static.
 */
export default function Marquee() {
  const track = useRef<HTMLDivElement>(null);
  const setSpeed = useRef<((value: number) => void) | null>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const loop = gsap.to(el, { xPercent: -50, ease: 'none', duration: LOOP_SECONDS, repeat: -1 });
      setSpeed.current = gsap.quickTo(loop, 'timeScale', { duration: 0.6, ease: 'power2.out' });
      return () => {
        setSpeed.current = null;
      };
    });
    return () => mm.revert();
  }, []);

  useLenis((lenis) => {
    setSpeed.current?.(1 + Math.min(Math.abs(lenis.velocity) / 30, MAX_BOOST));
  });

  const items = Array.from({ length: REPEATS_PER_HALF * 2 }, (_, i) => i);

  return (
    <div className={styles.marquee} aria-hidden="true">
      <div ref={track} className={styles.track}>
        {items.map((i) => (
          <span key={i} className={styles.item}>
            <span className="t-marquee">{site.name}</span>
            <span className={styles.badge}>{site.initials}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
