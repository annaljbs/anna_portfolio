'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { site } from '@/content/site';
import { gsap, ScrollTrigger, SplitText, DUR, EASE, STAGGER, MOTION_OK } from '@/lib/gsap';
import Clock from './Clock';
import styles from './Footer.module.css';

const COPIED_MS = 1600;

/**
 * (03) Contact / footer (§3.8, russellnumo): lead line, huge "Get in touch",
 * the email as a large link (underline draw-in; click copies it and shows
 * "Email copied"), optional phone, local time, and a mono bottom bar with
 * copyright, socials and credit.
 *
 * Curtain reveal: the footer is position: sticky; bottom: 0 under the Q&A
 * curtain (see app/page.tsx), so it is uncovered bottom-up as Q&A lifts
 * away. A sticky box is a poor ScrollTrigger target, so each element's
 * entrance is triggered from the curtain's bottom edge, firing as that
 * element is half uncovered. Reduced motion: shown as-is.
 */
export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

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
          const title = q<HTMLElement>('[data-title]')[0];
          const split = SplitText.create(title, { type: 'lines', mask: 'lines' });
          const curtain = el.parentElement?.querySelector<HTMLElement>('[data-curtain]') ?? null;

          // Viewport y of the pinned footer's top, then of a child's midpoint;
          // the trigger fires when the curtain's bottom edge scrolls above it.
          const footerTop = () => Math.max(0, window.innerHeight - el.offsetHeight);
          const trigger = (target: HTMLElement): ScrollTrigger.Vars =>
            curtain
              ? {
                  trigger: curtain,
                  start: () => `bottom ${footerTop() + target.offsetTop + target.offsetHeight / 2}px`,
                  once: true,
                  invalidateOnRefresh: true,
                }
              : { trigger: target, start: 'top 85%', once: true };

          q<HTMLElement>('[data-reveal]').forEach((target) => {
            gsap.from(target, { y: 30, autoAlpha: 0, duration: DUR.base, ease: EASE.out, scrollTrigger: trigger(target) });
          });
          q<HTMLElement>('[data-rule]').forEach((target) => {
            gsap.from(target, {
              scaleX: 0,
              transformOrigin: 'left center',
              duration: DUR.slow,
              ease: EASE.out,
              scrollTrigger: trigger(target),
            });
          });
          gsap.from(split.lines, {
            yPercent: 110,
            duration: DUR.slow,
            ease: EASE.out,
            stagger: STAGGER,
            scrollTrigger: trigger(title),
            onComplete: () => split.revert(),
          });

          return () => split.revert();
        });
      });
    });

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  function copyEmail(e: MouseEvent<HTMLAnchorElement>) {
    if (!navigator.clipboard) return; // let the mailto: link do its job
    e.preventDefault();
    navigator.clipboard
      .writeText(site.email)
      .then(() => {
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), COPIED_MS);
      })
      .catch(() => {
        window.location.href = `mailto:${site.email}`;
      });
  }

  const { contact } = site;
  const year = new Date().getFullYear();

  return (
    <footer ref={root} className={styles.footer} data-section-theme="dark" aria-labelledby="contact-title">
      <div className={styles.top}>
        <p className={`${styles.number} t-mono`} data-reveal>
          ({contact.number})
        </p>
        <p className={`${styles.lead} t-body-lg`} data-reveal>
          {contact.lead}
        </p>
        <h2 id="contact-title" className={`${styles.title} t-display`} data-title>
          {contact.title}
        </h2>

        <div className={styles.links} data-reveal>
          <a
            href={`mailto:${site.email}`}
            className={`${styles.email} u-underline`}
            onClick={copyEmail}
            data-copied={copied || undefined}
          >
            {site.email}
            <span className={`${styles.copied} t-mono`} aria-hidden="true">
              {contact.copied}
            </span>
          </a>
          <span className="sr-only" role="status" aria-live="polite">
            {copied ? contact.copied : ''}
          </span>
          {contact.phone && (
            <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className={`${styles.phone} u-underline`}>
              {contact.phone}
            </a>
          )}
          <p className={`${styles.time} t-mono`}>
            {contact.timeLabel} <Clock show="time" />
          </p>
        </div>
      </div>

      <div className={styles.bottom}>
        <span className={styles.rule} data-rule aria-hidden="true" />
        <div className={`${styles.bar} t-mono`} data-reveal>
          <span suppressHydrationWarning>
            ©{year} {site.name}
          </span>
          <ul className={styles.socials} aria-label="Social links">
            {contact.socials.map((s) => (
              <li key={s.label}>
                <a className="u-underline" href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <span className={styles.credit}>
            {contact.credit} {site.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
