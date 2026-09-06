'use client';

import { useEffect, useRef } from 'react';
import { site } from '@/content/site';
import { gsap, SplitText, MOTION_OK } from '@/lib/gsap';
import styles from './Manifesto.module.css';

const WORD_MIN_OPACITY = 0.15;

/**
 * Manifesto pull-quote (§3.5, russellnumo): one large centred quote. The
 * words are split and each fades from 0.15 to 1 as the paragraph travels
 * through the viewport centre (scrubbed "read-along"). Reduced motion:
 * plain, fully visible text.
 */
export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let cancelled = false;
    const ctx = gsap.context(() => {}, el);

    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx.add(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
          const quote = el.querySelector<HTMLElement>('[data-quote]');
          if (!quote) return;
          const split = SplitText.create(quote, { type: 'words' });
          gsap.fromTo(
            split.words,
            { opacity: WORD_MIN_OPACITY },
            {
              opacity: 1,
              ease: 'none',
              duration: 0.5,
              stagger: 0.1,
              scrollTrigger: { trigger: quote, start: 'top 80%', end: 'bottom 45%', scrub: true },
            },
          );
          return () => split.revert();
        });
      });
    });

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="manifesto" className={styles.manifesto} data-section-theme="light">
      <blockquote className={styles.quote}>
        <p className={styles.text} data-quote>
          “{site.manifesto.quote}”
        </p>
      </blockquote>
    </section>
  );
}
