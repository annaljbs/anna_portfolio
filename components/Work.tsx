'use client';

import { useEffect, useRef } from 'react';
import { site } from '@/content/site';
import { projects } from '@/content/projects';
import { gsap, DUR, EASE, STAGGER, MOTION_OK } from '@/lib/gsap';
import WorkCard from './WorkCard';
import styles from './Work.module.css';

/**
 * (02) Featured Work (§3.4): header, then one full-width row per project.
 * Enter reveal per row (top 75%, once): media clip-path wipe from the top
 * with the inner image scaling 1.2 → 1, meta stagger, title mask-reveal,
 * then description + link. Hover effects are CSS (scale 1.04, title swap,
 * arrow nudge); the WebGL distortion is a later pass.
 */
export default function Work() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
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

      q<HTMLElement>('[data-row]').forEach((row) => {
        const r = gsap.utils.selector(row);
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: 'top 75%', once: true } })
          .fromTo(
            r('[data-media]'),
            { clipPath: 'inset(0 0 100% 0)' },
            { clipPath: 'inset(0 0 0% 0)', duration: DUR.slow, ease: EASE.out },
            0,
          )
          .fromTo(
            r('[data-media-inner]'),
            { scale: 1.2 },
            { scale: 1, duration: DUR.slow, ease: EASE.out },
            0,
          )
          .from(r('[data-meta]'), { autoAlpha: 0, y: 12, duration: DUR.base, ease: EASE.out, stagger: STAGGER }, 0.2)
          .from(r('[data-title]'), { yPercent: 100, duration: DUR.base, ease: EASE.out }, 0.35)
          .from(r('[data-text]'), { autoAlpha: 0, y: 12, duration: DUR.base, ease: EASE.out, stagger: STAGGER }, 0.5);
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="work" className={styles.work} data-section-theme="dark">
      <header className={styles.head}>
        <span className={`${styles.number} t-mono`} data-reveal>
          ({site.work.number})
        </span>
        <h2 className={`${styles.title} t-display`} data-reveal>
          {site.work.title}
        </h2>
        <span className={`${styles.hint} t-mono`} data-reveal>
          {site.work.hint}
        </span>
      </header>

      <ol className={styles.list}>
        {projects.map((project, i) => (
          <WorkCard key={project.slug} project={project} index={i + 1} />
        ))}
      </ol>
    </section>
  );
}
