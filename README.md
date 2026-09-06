# Anna — Portfolio

Award-style single-page portfolio built from [portfolio-build-brief.md](./portfolio-build-brief.md).
Build progress follows brief §5; step 1 (scaffold, tokens, fonts, Lenis + GSAP, page frame, scroll progress, mail button, reduced motion) is done.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

Docker (the institution setup — `next dev` on port 3000 with the project bind-mounted):

```bash
docker compose up --build
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

## Reduced motion

- CSS transitions/animations collapse to instant via `styles/globals.css`.
- GSAP animations must be wrapped in `gsap.matchMedia().add(MOTION_OK, …)` (see `lib/gsap.ts`).
- Lenis switches to native scrolling (`LENIS_OPTIONS_REDUCED`).

## Structure

```
app/            layout (chrome + providers), home page, later work/[slug]
components/     SmoothScroll, PageFrame, ScrollProgress, MailButton, …
content/        site.ts (copy, links) — projects.ts arrives in step 3
lib/            gsap.ts, lenis.ts, fonts.ts
styles/         tokens.css, globals.css, type.css, fonts/
```

Placeholders are prefixed `[PLACEHOLDER]` or written in `[BRACKETS]` and marked `// TODO: replace`.
