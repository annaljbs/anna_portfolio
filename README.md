# Anna — Portfolio

Award-style single-page portfolio built from [portfolio-build-brief.md](./portfolio-build-brief.md).
Build progress follows brief §5. Done: step 1 (scaffold, tokens, fonts, Lenis + GSAP, page frame, scroll progress, mail button, reduced motion), step 2 (preloader, nav, hero with live clock), step 3 (About, Featured Work with live/WIP states and autoplaying previews, theme tween between sections), step 4 (Manifesto read-along quote, Skills rows, Q&A accordion) and step 5 (Contact footer with the sticky curtain reveal).

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

## Stack

- Next.js 16 (App Router) + TypeScript
- GSAP 3.15 with ScrollTrigger, SplitText and CustomEase — always import from `lib/gsap.ts`
- Lenis 1.3 (`lenis/react`), driven by GSAP's ticker in `components/SmoothScroll.tsx`
- motion 13 — reserved for page transitions and small stateful micro-interactions
- Plain CSS + CSS Modules with custom properties (`styles/tokens.css`), no Tailwind

## Fonts

Self-hosted woff2 in `styles/fonts/` (licences alongside), loaded via `next/font/local` in `lib/fonts.ts`:

| Role | Font | Note |
|---|---|---|
| Hero name | Anton | free stand-in for Manuka Black (brief §6) |
| Display / titles | Nimbus Sans Bold | URW base35 |
| Body | Inter (variable) | free stand-in for BDO Grotesk |
| Labels / mono | Geist Mono (variable) | |

Type roles are the `.t-hero`, `.t-display`, `.t-marquee`, `.t-body`, `.t-body-lg`, `.t-mono` classes in `styles/type.css`.

## Intro flow

1. An inline script in `app/layout.tsx` stamps `html[data-intro="first|seen"]` before hydration (session key in `lib/intro.ts`).
2. `Preloader` counts 0–100 %, wipes up, and calls `reveal()` from `IntroProvider` at the wipe's midpoint (immediately on repeat visits).
3. `Hero` and `Nav` keep their content hidden via `html[data-intro]` CSS and play their entrance when the phase becomes `reveal`.

## Section themes

Every top-level block in `app/page.tsx` declares `data-section-theme="light|dark"` and keeps a transparent background (run: Hero/About light, Work dark, Manifesto/Skills light, Q&A/footer dark). `components/ThemeController.tsx` tweens the body background (`lib/theme.ts` mirrors `--bg`) when a section with a different theme crosses the viewport middle and flips `html[data-theme]`, so all token-driven colours follow (they fade in step via a scoped transition in `styles/globals.css`). Only `html` and self-contained overlays (the nav panel) carry `data-theme` itself.

## Projects

`content/projects.ts` holds the Featured Work rows (`status: 'live' | 'wip'`). Live rows take a poster + optional `video` (mp4, optional webm) that autoplays muted while in view; WIP rows render a grayscale cover, an "In progress" pill and a non-clickable link. Media lives in `public/projects/`.

## Footer curtain

Q&A and the footer live in one tail block in `app/page.tsx`. The Q&A curtain is opaque (`background: var(--bg)`) and stacked above; `components/Footer.tsx` is `position: sticky; bottom: 0`, so it stays pinned to the viewport bottom while Q&A scrolls off it. The footer's entrance is triggered from the curtain's bottom edge, and the nav's `#contact` target is a zero-height anchor at the footer's natural position.

## Reduced motion

- CSS transitions/animations collapse to instant via `styles/globals.css`.
- GSAP animations are wrapped in `gsap.matchMedia().add(MOTION_OK, …)` (see `lib/gsap.ts`); the preloader and nav panel fall back to fades.
- Lenis switches to native scrolling (`LENIS_OPTIONS_REDUCED`).

## Structure

```
app/            layout (chrome + providers), home page, later work/[slug]
components/     Preloader, Nav, Hero, Clock, About, Work, WorkCard, ProjectVideo, Manifesto,
                Skills, QA, Footer, ThemeController, Marquee (generic loop), SmoothScroll, PageFrame,
                ScrollProgress, MailButton, IntroProvider, useSectionReveal, useExpandable (hooks)
content/        site.ts (copy, links, nav, section labels, skills, Q&A, contact), projects.ts
lib/            gsap.ts, lenis.ts, fonts.ts, intro.ts, theme.ts
public/         projects/ (clips + posters), placeholders/ (swap for images/ later)
styles/         tokens.css, globals.css, type.css, fonts/
```

Placeholders are prefixed `[PLACEHOLDER]` or written in `[BRACKETS]` and marked `// TODO: replace`.
