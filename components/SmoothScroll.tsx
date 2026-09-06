'use client';

/**
 * Lenis smooth scroll wired to GSAP (§1, §2.3).
 *  - ReactLenis with `root` scrolls the window itself (no wrapper divs), so
 *    ScrollTrigger keeps reading native scroll positions.
 *  - autoRaf is off; GSAP's ticker calls lenis.raf() so both libraries step
 *    on the same frame, and every Lenis scroll event updates ScrollTrigger.
 *  - Reduced motion: Lenis stays mounted (so useLenis()/scrollTo keep
 *    working) but wheel/touch smoothing is disabled → native scrolling.
 */
import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect, useMemo, type ReactNode } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import { LENIS_OPTIONS, LENIS_OPTIONS_REDUCED } from '@/lib/lenis';

function GsapSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const onScroll = () => ScrollTrigger.update();
    const tick = (time: number) => lenis.raf(time * 1000);

    lenis.on('scroll', onScroll);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(tick);
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  // Evaluated on the client at mount; on the server the default is used and
  // nothing rendered depends on it, so there is no hydration mismatch.
  const options = useMemo(
    () => (prefersReducedMotion() ? LENIS_OPTIONS_REDUCED : LENIS_OPTIONS),
    [],
  );

  return (
    <ReactLenis root options={options}>
      <GsapSync />
      {children}
    </ReactLenis>
  );
}
