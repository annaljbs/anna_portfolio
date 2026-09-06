'use client';

import { useEffect, useRef } from 'react';
import { site } from '@/content/site';
import { gsap, ScrollTrigger, SplitText, DUR, EASE, MOTION_OK } from '@/lib/gsap';
import Marquee from './Marquee';
import styles from './About.module.css';

const LINE_STAGGER = 0.05;

/**
 * (01) About (§3.3, russellnumo): label + title left, two paragraphs right
 * (the first larger), then a roles marquee that pauses on hover.
 * Reveal: label and title rise on enter (top 80%), paragraphs split by line
 * and rise with a 0.05 s stagger. Reduced motion: shown as-is.
 */
export default function About() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let cancelled = false;
    const ctx = gsap.context(() => {}, el);
    const q = gsap.utils.selector(el);

    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx.add(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
          gsap.from(q('[data-reveal]'), {
            y: 40,
            autoAlpha: 0,
            duration: DUR.base,
            ease: EASE.out,
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: 'top 80%', once: true },
          });

          const paragraphs = q<HTMLElement>('[data-lines]');
          const splits = paragraphs.map((p) => SplitText.create(p, { type: 'lines', mask: 'lines' }));
          gsap.from(
            splits.flatMap((s) => s.lines),
            {
              yPercent: 110,
              duration: DUR.base,
              ease: EASE.out,
              stagger: LINE_STAGGER,
              scrollTrigger: { trigger: paragraphs[0], start: 'top 80%', once: true },
              onComplete: () => {
                splits.forEach((s) => s.revert());
                ScrollTrigger.refresh();
              },
            },
          );
          return () => splits.forEach((s) => s.revert());
        });
      });
    });

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="about" className={styles.about} data-section-theme="light">
      <div className={styles.grid}>
        <div className={styles.head}>
          <span className={`${styles.number} t-mono`} data-reveal>
            ({site.about.number})
          </span>
          <h2 className={`${styles.title} t-display`} data-reveal>
            {site.about.title}
          </h2>
        </div>
        <div className={styles.copy}>
          <p className={`${styles.lead} t-body-lg`} data-lines>
            {site.about.lead}
          </p>
          <p className="t-body" data-lines>
            {site.about.body}
          </p>
        </div>
      </div>

      <ul className="sr-only">
        {site.about.roles.map((role) => (
          <li key={role}>{role}</li>
        ))}
      </ul>
      <Marquee duration={18} pauseOnHover className={styles.roles} itemClassName={styles.roleItem}>
        {site.about.roles.map((role) => (
          <span key={role} className={styles.role}>
            {role}
            <span className={styles.dot}>·</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
