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
  PLAY_ONCE,
} from '@/lib/gsap';
import { toEmbedUrl } from '@/lib/embed';
import { useIntro } from './IntroProvider';
import ProjectEmbed from './ProjectEmbed';
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
  const embed = wip ? null : toEmbedUrl(project.embed);
  const caseStudy = project.caseStudy?.length ? project.caseStudy : null;

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
              scrollTrigger: { trigger: target, start: 'top 85%', ...PLAY_ONCE },
            });
          });
          q<HTMLElement>('[data-media]').forEach((box) => {
            gsap
              .timeline({ scrollTrigger: { trigger: box, start: 'top 80%', ...PLAY_ONCE } })
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

          <div
            className={styles.cover}
            data-hero-cover
            data-hero-hide
            data-embed={embed ? '' : undefined}
            data-case-study={caseStudy ? '' : undefined}
          >
            <div className={styles.coverInner} data-hero-cover-inner>
              {caseStudy ? (
                caseStudy.map((slice, i) => (
                  <Image
                    key={slice.src}
                    src={slice.src}
                    alt={slice.alt}
                    width={slice.width ?? 0}
                    height={slice.height ?? 0}
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, 95vw"
                    className={styles.caseSlice}
                    unoptimized={slice.src.endsWith('.svg')}
                  />
                ))
              ) : embed ? (
                <ProjectEmbed src={embed} title={project.title} className={styles.embed} />
              ) : (
                <>
                  <Image
                    src={project.pageCover ?? project.cover}
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className={styles.asset}
                    unoptimized={(project.pageCover ?? project.cover).endsWith('.svg')}
                  />
                  {!wip && project.video && project.videoOnPage !== false && (
                    <ProjectVideo
                      video={project.video}
                      poster={project.cover}
                      className={`${styles.asset} ${styles.video}`}
                      hover={project.videoPlay === 'hover'}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </header>

        {project.intro && (
          <section className={styles.intro}>
            <p className="t-body-lg" data-reveal>
              {project.intro}
            </p>
          </section>
        )}

        {project.blocks.map((block, i) => (
          <section
            key={block.heading + i}
            className={styles.block}
            data-flip={i % 2 === 1 || undefined}
            data-text-only={!block.media || undefined}
          >
            <div className={styles.blockText}>
              <h2 className={styles.blockHeading} data-reveal>
                {block.heading}
              </h2>
              <p className="t-body" data-reveal>
                {block.text}
              </p>
            </div>
            {block.media && <MediaBox media={block.media} sizes="(max-width: 768px) 100vw, 60vw" />}
          </section>
        ))}

        {(project.challenge || project.solution) && (
          <section className={styles.split}>
            {project.challenge && (
              <div data-reveal>
                <h2 className={`${styles.splitLabel} t-mono`}>{labels.challenge}</h2>
                <p className="t-body-lg">{project.challenge}</p>
              </div>
            )}
            {project.solution && (
              <div data-reveal>
                <h2 className={`${styles.splitLabel} t-mono`}>{labels.solution}</h2>
                <p className="t-body-lg">{project.solution}</p>
              </div>
            )}
          </section>
        )}

        {project.rows && project.rows.length > 0 && (
          <div className={styles.rows}>
            {project.rows.map((row, r) => (
              <section
                key={r}
                className={styles.row}
                data-layout={row.layout}
                data-reveal
                aria-label={row.layout === 'screens' ? 'Screens' : 'Interface elements'}
              >
                {row.media.map((media) => (
                  <Image
                    key={media.src}
                    src={media.src}
                    alt={media.alt}
                    width={media.width ?? 0}
                    height={media.height ?? 0}
                    sizes={row.layout === 'screens' ? '(max-width: 600px) 100vw, 33vw' : '25vw'}
                    className={styles.rowItem}
                    style={
                      row.layout === 'elements' && media.width && media.height
                        ? { aspectRatio: `${media.width} / ${media.height}` }
                        : undefined
                    }
                    unoptimized={media.src.endsWith('.svg')}
                  />
                ))}
              </section>
            ))}
          </div>
        )}

        {project.gallery.length > 0 && (
          <section
            className={styles.gallery}
            aria-label="Gallery"
            data-layout={project.gallery.some((m) => m.video) ? 'row' : undefined}
          >
            {/* EDIT: the gallery shows at most 4 pictures; the 3rd spans the full width.
                With clips, all items sit in one row at equal size. */}
            {project.gallery.slice(0, 4).map((media, i) => (
              <MediaBox key={media.src + i} media={media} sizes="(max-width: 768px) 100vw, 50vw" />
            ))}
          </section>
        )}

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
    <div
      className={styles.media}
      data-media
      style={media.video && media.width && media.height ? { aspectRatio: `${media.width} / ${media.height}` } : undefined}
    >
      <div className={styles.mediaInner} data-media-inner>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes={sizes}
          className={styles.asset}
          unoptimized={media.src.endsWith('.svg')}
        />
        {media.video && (
          <ProjectVideo video={media.video} poster={media.src} className={`${styles.asset} ${styles.video}`} />
        )}
      </div>
    </div>
  );
}
