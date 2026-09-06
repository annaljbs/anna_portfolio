/**
 * sessionStorage key set once the preloader has run this session.
 * Plain module (no 'use client') so the server-rendered layout can inline it
 * in its pre-hydration script and client components can import it too.
 */
export const INTRO_STORAGE_KEY = 'intro-seen';
