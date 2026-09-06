'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useLenis } from 'lenis/react';
import { gsap, MOTION_OK } from '@/lib/gsap';
import styles from './Marquee.module.css';

const MAX_BOOST = 4;

type Props = {
  /** One repeat unit; rendered 2 × `repeat` times so the -50% loop is seamless. */
  children: ReactNode;
  /** Seconds for one half-track cycle. */
  duration?: number;
  repeat?: number;
  pauseOnHover?: boolean;
  /** Speed the loop up with Lenis scroll velocity. */
  scrollBoost?: boolean;
  className?: string;
  itemClassName?: string;
};

/**
 * Generic infinite horizontal loop: xPercent 0 → -50, linear, repeat -1.
 * Skins live with the caller (currently the roles row in About).
 * Reduced motion: static. Decorative — hidden from assistive tech.
 */
export default function Marquee({
  children,
  duration = 20,
  repeat = 3,
  pauseOnHover = false,
  scrollBoost = false,
  className = '',
  itemClassName = '',
}: Props) {
  const track = useRef<HTMLDivElement>(null);
  const loop = useRef<gsap.core.Tween | null>(null);
  const setSpeed = useRef<((value: number) => void) | null>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const tween = gsap.to(el, { xPercent: -50, ease: 'none', duration, repeat: -1 });
      loop.current = tween;
      if (scrollBoost) {
        setSpeed.current = gsap.quickTo(tween, 'timeScale', { duration: 0.6, ease: 'power2.out' });
      }
      return () => {
        loop.current = null;
        setSpeed.current = null;
      };
    });
    return () => mm.revert();
  }, [duration, scrollBoost]);

  useLenis((lenis) => {
    setSpeed.current?.(1 + Math.min(Math.abs(lenis.velocity) / 30, MAX_BOOST));
  });

  const pause = () => {
    if (pauseOnHover) loop.current?.pause();
  };
  const resume = () => {
    if (pauseOnHover) loop.current?.play();
  };

  return (
    <div
      className={`${styles.marquee} ${className}`}
      aria-hidden="true"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div ref={track} className={styles.track}>
        {Array.from({ length: repeat * 2 }, (_, i) => (
          <span key={i} className={`${styles.item} ${itemClassName}`}>
            {children}
          </span>
        ))}
      </div>
    </div>
  );
}
