'use client';

/**
 * Hands the page from the preloader to the hero (§3.0 → §3.2).
 *  - Preloader calls reveal() at the midpoint of its wipe (or immediately on
 *    repeat visits); Hero and Nav play their entrance when phase === 'reveal'.
 *  - The inline script in app/layout.tsx stamps html[data-intro="first|seen"]
 *    before hydration (key in lib/intro.ts) so the preloader never flashes on
 *    repeat visits and the hero can stay hidden until its animation starts.
 *  - A safety timer reveals anyway if the preloader never reports back.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type IntroPhase = 'pending' | 'reveal';

const SAFETY_MS = 6000;

type IntroValue = { phase: IntroPhase; reveal: () => void };

const IntroContext = createContext<IntroValue>({ phase: 'pending', reveal: () => {} });

/** True when the inline script found the session flag (preloader skipped). */
export function introAlreadySeen(): boolean {
  return typeof document !== 'undefined' && document.documentElement.dataset.intro === 'seen';
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>('pending');
  const reveal = useCallback(() => setPhase('reveal'), []);

  useEffect(() => {
    const id = window.setTimeout(reveal, SAFETY_MS);
    return () => window.clearTimeout(id);
  }, [reveal]);

  const value = useMemo(() => ({ phase, reveal }), [phase, reveal]);
  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro(): IntroValue {
  return useContext(IntroContext);
}
