'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { usePathname } from 'next/navigation';
import { useLenis } from 'lenis/react';
import { gsap, DUR, EASE, prefersReducedMotion } from '@/lib/gsap';
import { site } from '@/content/site';
import { useIntro } from './IntroProvider';
import { useTransition } from './PageTransition';
import styles from './Nav.module.css';

const SCROLL_SECONDS = 1.4;

/**
 * Fixed top bar (wordmark left, "menu" right) and a full-height panel that
 * slides in from the right with numbered links (§3.1). Links smooth-scroll
 * with Lenis on the home page; from a detail page they route home through
 * the page transition first. The bar blends with the page so it reads on
 * both themes; the panel is always dark. Reduced motion: the panel fades.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const pathname = usePathname();
  const { navigate } = useTransition();
  const { phase } = useIntro();
  const bar = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Build the open/close timeline once.
  useEffect(() => {
    const p = panel.current;
    if (!p) return;
    const ctx = gsap.context(() => {
      const items = p.querySelectorAll('[data-nav-item]');
      const t = gsap.timeline({
        paused: true,
        onReverseComplete: () => gsap.set(p, { visibility: 'hidden' }),
      });
      if (prefersReducedMotion()) {
        t.fromTo(p, { autoAlpha: 0 }, { autoAlpha: 1, duration: DUR.fast, ease: 'none' });
      } else {
        t.set(p, { visibility: 'visible' })
          .fromTo(
            p,
            { xPercent: 100 },
            { xPercent: 0, duration: DUR.base, ease: EASE.inout },
            0,
          )
          .fromTo(
            items,
            { yPercent: 100 },
            { yPercent: 0, duration: DUR.base, ease: EASE.out, stagger: 0.06 },
            0.25,
          );
      }
      tl.current = t;
    }, p);
    return () => {
      ctx.revert();
      tl.current = null;
    };
  }, []);

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (open) t.play();
    else t.reverse();
  }, [open]);

  // While open: lock scroll, close on Escape, move focus into the panel.
  useEffect(() => {
    if (!open) return;
    const toggleEl = toggle.current;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const focus = gsap.delayedCall(0.15, () => {
      panel.current?.querySelector<HTMLElement>('a')?.focus();
    });
    return () => {
      window.removeEventListener('keydown', onKey);
      focus.kill();
      lenis?.start();
      toggleEl?.focus();
    };
  }, [open, lenis]);

  // Fade the bar in once the preloader hands over.
  useEffect(() => {
    if (phase !== 'reveal' || !bar.current) return;
    const t = gsap.to(bar.current, { autoAlpha: 1, duration: DUR.base, delay: 0.8, ease: EASE.out });
    return () => {
      t.kill();
    };
  }, [phase]);

  function go(e: MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    setOpen(false);
    if (pathname !== '/') {
      navigate(href === '#top' ? '/' : `/${href}`, { back: href === '#top' });
      return;
    }
    const immediate = prefersReducedMotion();
    // Next frame: the close effect has restarted Lenis by then.
    requestAnimationFrame(() => {
      if (lenis) {
        lenis.scrollTo(href === '#top' ? 0 : href, { duration: SCROLL_SECONDS, immediate, force: true });
      } else {
        document.querySelector(href)?.scrollIntoView();
      }
    });
  }

  return (
    <header className={styles.header}>
      <div ref={bar} className={styles.bar}>
        <a
          href="#top"
          className={`${styles.wordmark} u-underline`}
          data-transition="none"
          onClick={(e) => go(e, '#top')}
        >
          {site.name}
        </a>
        <button
          ref={toggle}
          type="button"
          className={`${styles.toggle} u-underline`}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'close' : 'menu'}
        </button>
      </div>

      <div className={styles.backdrop} hidden={!open} onClick={() => setOpen(false)} />

      <nav
        id="site-menu"
        ref={panel}
        className={styles.panel}
        aria-label="Site"
        data-theme="dark"
        inert={!open}
      >
        <ul className={styles.list}>
          {site.nav.map((item, i) => (
            <li key={item.href} className={styles.item}>
              <a
                href={item.href}
                className={styles.link}
                data-nav-item
                data-transition="none"
                onClick={(e) => go(e, item.href)}
              >
                <span className={`${styles.num} t-mono`}>{String(i + 1).padStart(2, '0')}</span>
                <span className={`${styles.label} u-underline`}>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className={`${styles.panelFooter} t-mono`}>
          <a href={`mailto:${site.email}`} className="u-underline">
            {site.email}
          </a>
        </div>
      </nav>
    </header>
  );
}
