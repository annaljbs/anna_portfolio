'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger, DUR, EASE, prefersReducedMotion } from '@/lib/gsap';
import { THEME_BG, isTheme, type Theme } from '@/lib/theme';

/**
 * Body-background tween at every theme boundary (§2.1). Reads the top-level
 * sections in <main> that declare a theme (data-section-theme, or the
 * hero's data-theme); when a section whose theme differs from the one
 * before it crosses the viewport middle, the body background fades to that
 * theme's colour (and back on leave-back) and html[data-theme] flips so
 * text colours follow via the tokens (styles/globals.css fades them in
 * step). Sections keep transparent backgrounds and must not carry
 * data-theme themselves, or their text would ignore the tween.
 * Reduced motion: the switch is instant.
 */
export default function ThemeController() {
  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>('main > [data-section-theme], main > [data-theme]');
    if (sections.length === 0) return;
    const themeOf = (el: HTMLElement) => el.dataset.sectionTheme ?? el.dataset.theme;

    const apply = (theme: Theme, immediate = false) => {
      document.documentElement.dataset.theme = theme;
      gsap.to(document.body, {
        backgroundColor: THEME_BG[theme],
        duration: immediate || prefersReducedMotion() ? 0 : DUR.base,
        ease: EASE.out,
        overwrite: 'auto',
      });
    };

    const ctx = gsap.context(() => {
      sections.forEach((section, i) => {
        if (i === 0) return;
        const theme = themeOf(section);
        const previous = themeOf(sections[i - 1]);
        if (!isTheme(theme) || !isTheme(previous) || theme === previous) return;
        ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          onEnter: () => apply(theme),
          onLeaveBack: () => apply(previous),
        });
      });
    });

    // Initial state (e.g. reload mid-page): last section already past the middle.
    const middle = window.innerHeight / 2;
    let current: Theme = 'light';
    for (const section of sections) {
      const theme = themeOf(section);
      if (isTheme(theme) && section.getBoundingClientRect().top <= middle) current = theme;
    }
    apply(current, true);

    return () => {
      ctx.revert();
      gsap.set(document.body, { clearProps: 'backgroundColor' });
      document.documentElement.dataset.theme = 'light';
    };
  }, []);

  return null;
}
