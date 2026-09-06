'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { site } from '@/content/site';
import type { Project, ProjectMedia } from '@/content/projects';
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
import ProjectVideo from './ProjectVideo';
import ThemeController from './ThemeController';
import styles from './ProjectPage.module.css';

type Props = {
  project: Project;
  /** 1-based position in the featured list, shown as (0n). */
  index: number;
  next: Project | null;
};

/**
 * /work/[slug] (§3.9): title, mono meta row, full-width cover with the
 * clip-path wipe, intro, alternating text/media blocks, Challenge / Solution,
 * a gallery and a "Next project →" card. Dark theme throughout.
 *
 * Intro plays when the preloader or page transition hands over
 * (IntroProvider phase === 'reveal'); the hero stays hidden until then via
 * html[data-intro]. Body blocks reveal on scroll. WIP projects render the
 * same template with an "In progress" banner and placeholder media.
 * Reduced motion: shown as-is.
 */
export default function ProjectPage({ project, index, next }: Props) {
  const { phase } = useIntro();
  const root = useRef<HTMLElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);
  const shouldPlay = useRef(false);
  const wip = project.status === 'wip';

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
          const title = q<HTMLElement>('[data-hero-title]')[0];
          const split = SplitText.create(title, { type: 'lines', mask: 'lines' });
          const tl = gsap.timeline({
            paused: true,
            onComplete: () => {
              split.revert();
              ScrollTrigger.refresh();
            },
          });
          tl.set(hidden, { visibility: 'visible' }, 0)
            .from(split.lines, { yPercent: 110, duration: DUR.slow, ease: EASE.out, stagger: STAGGER }, 0)
            .from(q('[data-hero-fade]'), { autoAlpha: 0, y: 12, duration: DUR.base, ease: EASE.out, stagger: 0.06 }, 0.3)
            .fromTo(
              q('[data-hero-cover]'),
              { clipPath: 'inset(0 0 100% 0)' },
              { clipPath: 'inset(0 0 0% 0)', duration: DUR.slow, ease: EASE.out },
              0.2,
            )
            .fromTo(
              q('[data-hero-cover-inner]'),
              { scale: 1.15 },
              { scale: 1, duration: DUR.slow, ease: EASE.out },
              0.2,
            );
          intro.current = tl;
          if (shouldPlay.current) tl.play();

          // Body: each text block rises, each media box wipes open, on enter.
          q<HTMLElement>('[data-reveal]').forEach((target) => {
            gsap.from(target, {
              y: 30,
              autoAlpha: 0,
              duration: DUR.base,
              ease: EASE.out,
              scrollTrigger: { trigger: target, start: 'top 85%', once: true },
            });
          });
          q<HTMLElement>('[data-media]').forEach((box) => {
            gsap
              .timeline({ scrollTrigger: { trigger: box, start: 'top 80%', once: true } })
              .fromTo(box, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: DUR.slow, ease: EASE.out }, 0)
              .fromTo(
                box.querySelector('[data-media-inner]'),
                { scale: 1.2 },
                { scale: 1, duration: DUR.slow, ease: EASE.out },
                0,
              );
          });

          return () => {
            tl.kill();
            split.revert();
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

  useEffect(() => {
    if (phase !== 'reveal') return;
    shouldPlay.current = true;
    intro.current?.play();
  }, [phase]);

  const labels = site.project;
  const number = `(${String(index).padStart(2, '0')})`;

  return (
    <>
      <ThemeController />
      <article ref={root} className={styles.page} data-section-theme="dark" data-status={project.status}>
        <header className={styles.hero}>
          <div className={`${styles.topRow} t-mono`} data-hero-hide data-hero-fade>
            <Link href="/#work" className={`${styles.back} u-underline`} data-transition="back">
              ← {labels.back}
            </Link>
            <span>{number}</span>
          </div>

          {wip && (
            <div className={styles.banner} data-hero-hide data-hero-fade role="note">
              <span className={`${styles.pill} t-mono`}>{site.work.wipPill}</span>
              <span className="t-body">{labels.wipBanner}</span>
            </div>
          )}

          <h1 className={`${styles.title} t-display`} data-hero-title data-hero-hide>
            {project.title}
          </h1>

          <dl className={`${styles.meta} t-mono`} data-hero-hide>
            <div data-hero-fade>
              <dt>{labels.meta.category}</dt>
              <dd>{project.category}</dd>
            </div>
            <div data-hero-fade>
              <dt>{labels.meta.year}</dt>
              <dd>{project.year}</dd>
            </div>
            <div data-hero-fade>
              <dt>{labels.meta.role}</dt>
              <dd>{project.role}</dd>
            </div>
            <div data-hero-fade>
              <dt>{labels.meta.stack}</dt>
              <dd>{project.stack.join(' · ')}</dd>
            </div>
          </dl>

          <div className={styles.cover} data-hero-cover data-hero-hide>
            <div className={styles.coverInner} data-hero-cover-inner>
              <Image
                src={project.cover}
                alt=""
                fill
                priority
                sizes="100vw"
                className={styles.asset}
                unoptimized={project.cover.endsWith('.svg')}
              />
              {!wip && project.video && (
                <ProjectVideo video={project.video} poster={project.cover} className={`${styles.asset} ${styles.video}`} />
              )}
            </div>
          </div>
        </header>

        <section className={styles.intro}>
          <p className="t-body-lg" data-reveal>
            {project.intro}
          </p>
        </section>

        {project.blocks.map((block, i) => (
          <section key={block.heading + i} className={styles.block} data-flip={i % 2 === 1 || undefined}>
            <div className={styles.blockText}>
              <h2 className={styles.blockHeading} data-reveal>
                {block.heading}
              </h2>
              <p className="t-body" data-reveal>
                {block.text}
              </p>
            </div>
            <MediaBox media={block.media} sizes="(max-width: 768px) 100vw, 60vw" />
          </section>
        ))}

        <section className={styles.split}>
          <div data-reveal>
            <h2 className={`${styles.splitLabel} t-mono`}>{labels.challenge}</h2>
            <p className="t-body-lg">{project.challenge}</p>
          </div>
          <div data-reveal>
            <h2 className={`${styles.splitLabel} t-mono`}>{labels.solution}</h2>
            <p className="t-body-lg">{project.solution}</p>
          </div>
        </section>

        <section className={styles.gallery} aria-label="Gallery">
          {project.gallery.slice(0, 4).map((media, i) => (
            <MediaBox key={media.src + i} media={media} sizes="(max-width: 768px) 100vw, 50vw" />
          ))}
        </section>

        {next && (
          <section className={styles.next}>
            <p className="t-mono" data-reveal>
              {labels.next}
            </p>
            <Link href={`/work/${next.slug}`} className={styles.nextCard} data-cursor="view">
              <MediaBox media={{ src: next.cover, alt: '' }} sizes="100vw" />
              <span className={styles.nextTitle}>
                {next.title}
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </span>
            </Link>
          </section>
        )}
      </article>
    </>
  );
}

function MediaBox({ media, sizes }: { media: ProjectMedia; sizes: string }) {
  return (
    <div className={styles.media} data-media>
      <div className={styles.mediaInner} data-media-inner>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes={sizes}
          className={styles.asset}
          unoptimized={media.src.endsWith('.svg')}
        />
      </div>
    </div>
  );
}
