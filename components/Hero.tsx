'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { site } from '@/content/site';
import {
  gsap,
  ScrollTrigger,
  SplitText,
  DUR,
  EASE,
  STAGGER,
  MOTION_OK,
  MOTION_REDUCED,
} from '@/lib/gsap';
import { useIntro } from './IntroProvider';
import Clock from './Clock';
import styles from './Hero.module.css';

/**
 * Hero (§3.2, billchien): two-line name, tagline, location · date · live
 * time row, full-height portrait. (The monogram tile was dropped.)
 *
 * Intro (plays when the preloader hands over): name letters slide up per
 * character, tagline lines follow, meta row fades up last, portrait wipes in
 * from the top while scaling 1.15 → 1. Scroll: portrait lags at 0.85×, name
 * leads at 1.05×, everything fades out by 60% of the section.
 * Reduced motion: content is simply shown; no scroll transforms.
 */
export default function Hero() {
  const { phase } = useIntro();
  const root = useRef<HTMLElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);
  const shouldPlay = useRef(false);

  // Build the intro once fonts are ready (SplitText needs final metrics).
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let cancelled = false;
    const ctx = gsap.context(() => {}, el);
    const q = gsap.utils.selector(el);

    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx.add(() => {
        const hidden = q('[data-hero-hide]');
        const mm = gsap.matchMedia();

        mm.add(MOTION_REDUCED, () => {
          gsap.set(hidden, { visibility: 'visible' });
        });

        mm.add(MOTION_OK, () => {
          const [line1, line2] = q<HTMLElement>('[data-hero-line]');
          const tagline = q<HTMLElement>('[data-hero-tagline]')[0];
          const splits = [
            SplitText.create(line1, { type: 'chars' }),
            SplitText.create(line2, { type: 'chars' }),
            SplitText.create(tagline, { type: 'lines', mask: 'lines' }),
          ];
          const [chars1, chars2, taglineSplit] = splits;

          const tl = gsap.timeline({
            paused: true,
            onComplete: () => {
              splits.forEach((s) => s.revert());
              ScrollTrigger.refresh();
            },
          });
          tl.set(hidden, { visibility: 'visible' }, 0)
            .from(chars1.chars, { yPercent: 110, duration: DUR.slow, ease: EASE.out, stagger: 0.04 }, 0)
            .from(chars2.chars, { yPercent: 110, duration: DUR.slow, ease: EASE.out, stagger: 0.04 }, 0.15)
            .from(
              taglineSplit.lines,
              { yPercent: 110, duration: DUR.base, ease: EASE.out, stagger: STAGGER },
              0.45,
            )
            .fromTo(
              q('[data-hero-portrait]'),
              { clipPath: 'inset(0 0 100% 0)' },
              { clipPath: 'inset(0 0 0% 0)', duration: DUR.slow, ease: EASE.out },
              0,
            )
            .fromTo(
              q('[data-hero-portrait-img]'),
              { scale: 1.15 },
              { scale: 1, duration: DUR.slow, ease: EASE.out },
              0,
            )
            .from(q('[data-hero-meta]'), { autoAlpha: 0, y: 12, duration: DUR.base, ease: EASE.out }, 0.9)
            .from(q('[data-hero-status]'), { autoAlpha: 0, y: 12, duration: DUR.base, ease: EASE.out }, 1);

          intro.current = tl;
          if (shouldPlay.current) tl.play();

          return () => {
            tl.kill();
            splits.forEach((s) => s.revert());
            intro.current = null;
          };
        });
      });
    });

    return () => {
      cancelled = true;
      ctx.revert();
      intro.current = null;
    };
  }, []);

  // Play when the preloader hands over (or immediately once built, if it already has).
  useEffect(() => {
    if (phase !== 'reveal') return;
    shouldPlay.current = true;
    intro.current?.play();
  }, [phase]);

  // Scroll-driven parallax + fade (§3.2).
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const height = () => el.offsetHeight;
      gsap
        .timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
        .to(q('[data-hero-portrait]'), { y: () => height() * 0.15, scale: 1.08, ease: 'none' }, 0)
        .to(q('[data-hero-name]'), { y: () => -height() * 0.05, ease: 'none' }, 0);
      gsap.to(q('[data-hero-inner]'), {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${height() * 0.6}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="top" className={styles.hero} data-theme="light">
      <div className={styles.inner} data-hero-inner>
        <div className={styles.text} data-hero-hide>
          <div className={styles.nameBlock} data-hero-name>
            <h1 className={`${styles.name} t-hero`}>
              <span className={`${styles.line} ${styles.line1}`} data-hero-line>
                {site.firstName}
              </span>
              <span className={`${styles.line} ${styles.line2}`} data-hero-line>
                {site.surname}
              </span>
            </h1>
            <p className={`${styles.tagline} t-body`} data-hero-tagline>
              {site.tagline}
            </p>
          </div>

          <div className={`${styles.meta} t-mono`} data-hero-meta>
            <span>{site.location}</span>
            <Clock />
          </div>
        </div>

        <div className={styles.portrait} data-hero-portrait data-hero-hide>
          <div className={styles.portraitImg} data-hero-portrait-img>
            <Image
              src={site.portrait}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 46vw"
              unoptimized={site.portrait.endsWith('.svg')}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>

        {site.status && (
          <p className={`${styles.status} t-mono`} data-hero-status data-hero-hide>
            <span className={styles.dot} aria-hidden="true" />
            {site.status}
          </p>
        )}
      </div>
    </section>
  );
}
