'use client';

import { useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';
import { gsap, DUR, EASE, prefersReducedMotion } from '@/lib/gsap';
import { INTRO_STORAGE_KEY } from '@/lib/intro';
import { introAlreadySeen, useIntro } from './IntroProvider';
import styles from './Preloader.module.css';

/** Counter duration in seconds (§3.0). */
const COUNT_SECONDS = 1.6;

/**
 * Full-screen ink overlay with a 0% → 100% counter, then an upward wipe.
 * Hands over to the hero at the wipe's midpoint. Shown once per session;
 * repeat visits skip straight to the hero. Reduced motion: counter jumps to
 * 100% and the overlay fades out.
 */
export default function Preloader() {
  const { reveal } = useIntro();
  const lenis = useLenis();
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Repeat visit: the overlay is already display:none via CSS — just hand over.
    if (introAlreadySeen()) {
      reveal();
      return;
    }
    const el = root.current;
    const num = counter.current;
    if (!el || !num) return;

    const finish = () => {
      try {
        sessionStorage.setItem(INTRO_STORAGE_KEY, '1');
      } catch {
        /* private mode: the preloader simply runs again next load */
      }
      setDone(true);
    };

    if (prefersReducedMotion()) {
      num.textContent = '100%';
      const fade = gsap.to(el, {
        autoAlpha: 0,
        duration: DUR.fast,
        delay: 0.2,
        ease: 'none',
        onStart: reveal,
        onComplete: finish,
      });
      return () => {
        fade.kill();
      };
    }

    window.scrollTo(0, 0);
    const count = { value: 0 };
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(count, {
      value: 100,
      duration: COUNT_SECONDS,
      ease: 'power2.inOut',
      onUpdate: () => {
        num.textContent = `${Math.round(count.value)}%`;
      },
    });
    tl.to(el, { yPercent: -100, duration: DUR.slow, ease: EASE.inout }, 'wipe');
    tl.call(reveal, undefined, `wipe+=${DUR.slow / 2}`);

    return () => {
      tl.kill();
    };
  }, [reveal]);

  // Lock scrolling while the overlay is up.
  useEffect(() => {
    if (!lenis || done || introAlreadySeen()) return;
    lenis.stop();
    return () => {
      lenis.start();
    };
  }, [lenis, done]);

  if (done) return null;

  return (
    <div ref={root} className={styles.root} aria-hidden="true">
      <span ref={counter} className={`${styles.counter} t-mono`}>
        0%
      </span>
    </div>
  );
}
