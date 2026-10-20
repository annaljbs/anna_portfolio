'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLenis } from 'lenis/react';
import { gsap, ScrollTrigger, DUR, EASE, prefersReducedMotion } from '@/lib/gsap';
import { useIntro } from './IntroProvider';
import styles from './PageTransition.module.css';

const COLUMNS = 12;
const COLUMN_STAGGER = 0.04;
const SAFETY_SECONDS = 6;

type NavigateOptions = { back?: boolean };
type TransitionValue = { navigate: (href: string, options?: NavigateOptions) => void };

const TransitionContext = createContext<TransitionValue>({ navigate: () => {} });

/** Route with the column transition; `back: true` reverses the stagger. */
export function useTransition(): TransitionValue {
  return useContext(TransitionContext);
}

/**
 * Page transition (§3.9, russellnumo): a fixed overlay of 12 columns. On an
 * internal link click the columns grow from the top with a left → right
 * stagger, the route swaps while covered, then the columns shrink towards the
 * bottom with the same stagger. The intro is held during the swap and
 * released as the last column starts to leave, so the new page's hero starts
 * right then. Browser back/forward and links marked data-transition="back"
 * run the stagger right → left.
 *
 * Scroll restoration is done here, not by the browser: each page's scroll
 * position is remembered, and browser back/forward put the page back exactly
 * there while it is still covered. (Left to the browser, Lenis kept the
 * previous page's position and overrode it, landing somewhere else.)
 *
 * Internal links are intercepted in the capture phase so existing <Link>s
 * (work cards, next-project card) need no changes; add
 * data-transition="none" to opt a link out (the nav routes itself).
 * Reduced motion: a plain fade.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const { hold, reveal } = useIntro();
  const overlay = useRef<HTMLDivElement>(null);
  const pending = useRef<{ back: boolean; target: string } | null>(null);
  const safety = useRef<gsap.core.Tween | null>(null);
  const lenisRef = useRef(lenis);
  const pathRef = useRef(pathname);
  /** Last scroll position per pathname, for browser back/forward. */
  const positions = useRef(new Map<string, number>());
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);
  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  const columns = () => Array.from(overlay.current?.children ?? []) as HTMLElement[];

  const cover = useCallback(
    (back: boolean) =>
      new Promise<void>((resolve) => {
        const el = overlay.current;
        if (!el) return resolve();
        gsap.set(el, { autoAlpha: 1 });
        if (prefersReducedMotion()) {
          gsap.set(columns(), { scaleY: 1, transformOrigin: 'top center' });
          return resolve();
        }
        gsap.fromTo(
          columns(),
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            duration: DUR.base,
            ease: EASE.inout,
            stagger: { each: COLUMN_STAGGER, from: back ? 'end' : 'start' },
            onComplete: resolve,
          },
        );
      }),
    [],
  );

  /** Jump (no animation) to `y`, keeping Lenis and the window in sync. */
  const restoreScroll = useCallback((y: number) => {
    const lenis = lenisRef.current;
    lenis?.resize();
    window.scrollTo(0, y);
    lenis?.scrollTo(y, { immediate: true, force: true });
  }, []);

  const uncover = useCallback(
    (back: boolean, restoreY?: number) => {
      const el = overlay.current;
      if (!el) return;
      lenisRef.current?.start();
      if (restoreY !== undefined) restoreScroll(restoreY);
      ScrollTrigger.refresh();
      // Pinned/spaced triggers can shift the page during refresh; settle again.
      if (restoreY !== undefined) restoreScroll(restoreY);
      if (prefersReducedMotion()) {
        gsap.to(el, { autoAlpha: 0, duration: DUR.fast, onStart: reveal });
        return;
      }
      gsap.fromTo(
        columns(),
        { scaleY: 1, transformOrigin: 'bottom center' },
        {
          scaleY: 0,
          duration: DUR.base,
          ease: EASE.inout,
          stagger: { each: COLUMN_STAGGER, from: back ? 'end' : 'start' },
          onComplete: () => gsap.set(el, { autoAlpha: 0 }),
        },
      );
      // The hero starts as the last column begins to leave.
      gsap.delayedCall(COLUMN_STAGGER * (COLUMNS - 1), reveal);
    },
    [reveal, restoreScroll],
  );

  const navigate = useCallback(
    async (href: string, { back = false }: NavigateOptions = {}) => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        router.push(href);
        return;
      }
      if (pending.current) return;
      positions.current.set(window.location.pathname, window.scrollY);
      pending.current = { back, target: url.pathname };
      hold();
      lenisRef.current?.stop();
      safety.current?.kill();
      safety.current = gsap.delayedCall(SAFETY_SECONDS, () => {
        if (pending.current) {
          pending.current = null;
          uncover(back);
        }
      });
      await cover(back);
      router.push(href);
    },
    [cover, hold, router, uncover],
  );

  // The new route has rendered (this effect runs after the page's own mount effects).
  useEffect(() => {
    const p = pending.current;
    if (!p || (p.target !== '*' && p.target !== pathname)) return;
    pending.current = null;
    safety.current?.kill();
    // Browser back/forward ('*'): return to where this page was left.
    uncover(p.back, p.target === '*' ? positions.current.get(pathname) ?? 0 : undefined);
  }, [pathname, uncover]);

  // Remember the scroll position of the current page (not while a transition
  // is swapping pages, when the URL and the content don't match yet).
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const onScroll = () => {
      if (!pending.current) positions.current.set(window.location.pathname, window.scrollY);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Browser back/forward: cover instantly (the URL has already changed), then
  // uncover right → left once the route has rendered.
  useEffect(() => {
    const onPop = () => {
      if (pending.current || window.location.pathname === pathRef.current) return;
      positions.current.set(pathRef.current, window.scrollY);
      pending.current = { back: true, target: '*' };
      hold();
      // Start the incoming page at the top (it is covered): its ScrollTriggers
      // must be created there. Created while still scrolled to the previous
      // page's position, one-time reveals fire and kill themselves mid-setup
      // and ScrollTrigger crashes. The saved position is restored on uncover.
      window.scrollTo(0, 0);
      lenisRef.current?.scrollTo(0, { immediate: true, force: true });
      lenisRef.current?.stop();
      gsap.set(overlay.current, { autoAlpha: 1 });
      gsap.set(columns(), { scaleY: 1, transformOrigin: 'bottom center' });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [hold]);

  // Intercept internal links before React/Next handle them.
  useEffect(() => {
    const onClick = (e: globalThis.MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      if (anchor.dataset.transition === 'none') return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      e.preventDefault();
      e.stopPropagation();
      navigate(url.pathname + url.search + url.hash, { back: anchor.dataset.transition === 'back' });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [navigate]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      <div ref={overlay} className={styles.overlay} aria-hidden="true">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <span key={i} className={styles.column} />
        ))}
      </div>
      {children}
    </TransitionContext.Provider>
  );
}
