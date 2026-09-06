# Portfolio Website — Build Brief for Claude Code

Owner: Anna
Type: single-page scroller + a few project detail pages
Goal: an award-style creative portfolio in the spirit of the three reference sites below. Finished animations, finished layout, placeholder content where projects aren't done yet.

---

## 0. Reference map — what to take from where

| Site | Take from it | Ignore |
|---|---|---|
| **billchien.net** | The **hero section** only: layout, huge stacked name, live location + date + time row, portrait on the right, floating mail button, scroll progress bar, rounded page frame. Also the idea of a **Q&A section**. | Everything else (shows/music/switch sections, multi-page nav). |
| **russellnumo.nl** | **Section structure and order**, numbered nav (01/02/03), scroll reveals, hover interactions, the interactive list with "click me" toggles (rename Services → **Skills**), the loading counter, page transitions, image distortion hover on project cards, and the **footer / contact section** exactly. | His copy and colours (we use our own palette). |
| **charly.graphics** | **Typography** — the font pairing and how type is used (display vs. body vs. mono labels). **Colours** (light grey + near-black). Lenis smooth scroll, custom cursor, autoplaying video project previews. | Layout, multi-page structure. |

**Verified in DevTools (Safari, 6 Sep 2026):**
- billchien.net: Webflow. Fonts loaded: **Manuka Medium/Black** (the hero name = Manuka Black), Faktum Medium/SemiBold/Bold, National Web Book/Medium/Semibold, Saol Display Bold, Pitch Medium Italic, Basis Grotesque Mono Regular/Bold. Hero markup: `.bilchien-wrapper > .bill-wrapper > .h1.letters-slide-up.text-split > span.word > span.char` — every letter is its own inline-block span and slides up on load; separate `.chien-wrapper` for line two; `.location-wrapper` is a CSS grid; `.portrait` has `will-change: transform` + `translate3d/scale3d` (scroll-driven transform). Swiper is loaded (slider used elsewhere on the site).
- charly.graphics: Webflow. Fonts: **Nimbus Sans L Bold/Regular** (hero marquee + headings), **Geist Mono** variable (labels, email), **BDO Grotesk** variable (body, 14px/20px). Colours: body `#F0F0F0` background, text `#333`, `--color-bg: #000`, `--color-bg-content: rgba(255,255,255,.05)`. Scroll: **Lenis 1.3.4** (`new Lenis({ autoRaf: true })`) with `lenis.css`. `body { cursor: none }` → custom cursor. Sections: `header.hero-section`, `#projects.projects-section`, `.about-section`, `.service-section`, `#footer.footer-section`.
- russellnumo.nl: Next.js + Chakra UI. `theme-color #0E0E0E`; Awwwards palette lists `#FFFFFF` + `#1A202C`. Verified: the image distortion is **WebGL** — the app bundle creates a `<canvas>` (`this.gl.canvas`, `dpr`, shader uniforms) positioned `absolute; inset: 0; opacity: 0; pointer-events: none` over the image; the hero portrait `div[data-intro="portrait"]` does a `clip-path: inset()` intro reveal. The **page transition** is a `div` of **12 black columns** (`width: 8.333%`, `height: 0`) that grow to cover the viewport. Hero meta reads `BASED IN AMSTERDAM • 13:57:23` (24 h clock with seconds) and `● OPEN TO WORK`. DOM: `header` → `main` → hero `section` → `section#about` → `section#projects` → `section` (manifesto/services) → `footer#contact`.
- charly.graphics projects: each `.project_n` = `.project_number "(n)"` + `a[href="/slug"]` wrapping `.team-image-video_wrapper` with a `<video autoplay loop muted playsinline>` (poster jpg, mp4 + webm sources, `object-fit: cover`) + `.project_title`. Videos **autoplay continuously**, not on hover.

---

## 1. Tech stack & setup

- **Next.js (App Router) + TypeScript** — one home page (`/`) with all sections, plus `/work/[slug]` detail pages.
- **GSAP 3.13+** with `ScrollTrigger` and `SplitText` (all GSAP plugins are free since 3.13). Handles every scroll-driven reveal, pinning and text animation.
- **Lenis** for smooth scrolling. Sync it with GSAP's ticker (`lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(...)`).
- **motion** (Framer Motion) for route/page transitions and small stateful hover/click micro-interactions only. Do not mix GSAP and motion on the same element.
- **CSS Modules or plain global CSS** with CSS custom properties. No Tailwind — custom CSS gives finer control over motion and type.
- WebGL: **ogl** (tiny) for the project-image distortion hover (§3.4) — confirmed as a canvas/shader effect on the reference. Ship the CSS-only hover first, add the shader as a second pass.
- Dev runs in the institution's **Docker** setup — add a `Dockerfile` + `compose.yaml` running `next dev` on port 3000 with the project mounted as a volume.
- Respect `prefers-reduced-motion`: every animation described below must degrade to a simple opacity fade or no motion.

Folder shape:
```
app/
  layout.tsx          # Lenis provider, preloader, custom cursor, page frame
  page.tsx            # home: all sections stacked
  work/[slug]/page.tsx
components/
  Preloader, Nav, Hero, About, Work, WorkCard, Skills, Manifesto, QA, Footer,
  ScrollProgress, MailButton, PageTransition, Cursor
content/
  site.ts             # name, location, email, socials, skills, Q&A
  projects.ts         # projects array incl. status: 'live' | 'wip'
lib/
  gsap.ts             # register plugins once
  lenis.ts
styles/
  tokens.css, globals.css, type.css
```

---

## 2. Global design system

### 2.1 Colour (taken from charly.graphics + russellnumo.nl — no sand yellow)
Two themes, both used on the page, switched per section via a `data-theme` attribute:

```
[data-theme="light"]  /* charly.graphics */
  --bg: #F0F0F0;  --ink: #0E0E0E;  --text: #333333;
  --muted: rgba(14,14,14,.5);  --line: rgba(14,14,14,.15);

[data-theme="dark"]   /* russellnumo.nl + charly dark blocks */
  --bg: #0E0E0E;  --ink: #FFFFFF;  --text: rgba(255,255,255,.85);
  --muted: rgba(255,255,255,.5);  --line: rgba(255,255,255,.12);
  --surface: rgba(255,255,255,.05);   /* card / content backgrounds */
```

Default mapping: Hero, About, Skills → **light**. Work, Manifesto, Q&A, Contact/Footer → **dark**. The body background is tweened between the two (`gsap.to(body, { backgroundColor })` on ScrollTrigger enter/leave-back at each theme boundary, `--dur-base`) so the switch reads as a smooth fade, not a hard edge. Text colour follows via the CSS variables.

### 2.2 Typography (verified)
Three roles, mirroring charly.graphics, with the billchien hero face for the name only:

| Role | Reference font | Licence | Use in build |
|---|---|---|---|
| **Hero name** (BILL CHIEN) | Manuka Black (Klim) | commercial | Buy if budget allows; free stand-in **Anton** (Google Fonts) or **Tusker Grotesk 8800** (free for personal use). Uppercase, `line-height .82`, `letter-spacing -.01em`. |
| **Display / section titles** | Nimbus Sans L Bold | free (URW base35, GPL/AFPL) | Use **Nimbus Sans L Bold** directly (self-host the woff2 from the URW base35 set) — this is the "CHARLYGRAPHICS" look. Tight tracking `-.03em`, `line-height .9`. |
| **Body** | BDO Grotesk | commercial | Free stand-in **Inter** (or Geist Sans). 14–16 px, `line-height 1.45`, colour `--text`. |
| **Labels / meta / mono** | Geist Mono (variable) | free (Vercel, OFL) | Use **Geist Mono** directly. Uppercase, 11–12 px, `letter-spacing .06em`. Used for: "(01)", categories, year, location · date · time row, nav numbers, email links, "[Scroll to explore more]". |

Load all fonts with `next/font/local` (self-hosted woff2, `display: swap`). Fluid sizes: hero name `clamp(6rem, 22vw, 26rem)`; section titles `clamp(2.5rem, 7vw, 8rem)`; marquee text `clamp(5rem, 18vw, 22rem)`.

### 2.3 Global chrome (always present)
- **Smooth scroll:** Lenis (charly uses 1.3.4 with `autoRaf: true`; in Next.js use `lenis/react` and drive it from GSAP's ticker instead of autoRaf).
- **Custom cursor:** `body { cursor: none }` like charly; a small `--ink` dot follows the pointer with `gsap.quickTo` (0.15 s lag), grows to a 60 px ring over links, becomes a labelled disc ("View" / "Soon") over project cards. Desktop only (`pointer: fine`).
- **Page frame:** the whole viewport has a ~14 px border-radius and a 6 px inset from the window edge (visible on the reference hero screenshot at the corners). Implement as a fixed `inset: 6px` container with `border-radius: 14px; overflow: hidden`.
- **Scroll progress bar:** 4 px bar pinned to the bottom of the frame, fills left→right with scroll (`ScrollTrigger scrub: true` on `scaleX`).
- **Floating mail button:** black circle, ~56 px, fixed bottom-right, envelope icon. Hover: scales to 1.08 and icon nudges up 2 px; click copies the email and the button briefly shows "Copied".

### 2.4 Motion tokens
```
--ease-out:   cubic-bezier(.22, 1, .36, 1)   /* expo-ish, used for reveals */
--ease-inout: cubic-bezier(.76, 0, .24, 1)   /* page transitions, masks */
--dur-fast: .35s   --dur-base: .8s   --dur-slow: 1.2s
```
Stagger between siblings: 0.06–0.08 s. Text reveals use `SplitText` by lines with `overflow: hidden` on each line wrapper and `yPercent: 110 → 0`.

---

## 3. Sections, top to bottom (with animation spec)

### 3.0 Preloader (russellnumo)
- Full-screen `--ink` overlay with a number counting `0%` → `100%` bottom-left in the small-caps style. Duration ~1.6 s, `ease: power2.inOut`, driven by GSAP tweening a counter object.
- At 100% the overlay wipes upward (`yPercent: -100`, `--dur-slow`, `--ease-inout`) and the hero animation (§3.2) starts on the wipe's midpoint.
- Only on first load per session (`sessionStorage` flag); on repeat visits skip straight to hero.

### 3.1 Navigation (russellnumo)
- Fixed top bar inside the page frame. Left: wordmark/name (small, body font). Right: word "menu".
- Clicking "menu" opens a full-height panel from the right with three large links, each prefixed by a number in small caps:
  `01 About` `02 Work` `03 Contact` — plus the Skills and Q&A anchors as `04 Skills`, `05 Q&A`. Links smooth-scroll (Lenis `scrollTo`) to section anchors.
- Panel open/close: clip-path or `x: 100% → 0`, `--dur-base`, `--ease-inout`; links stagger in 0.06 s with `yPercent: 100 → 0`.
- Link hover: underline draws in left→right (`scaleX` on a pseudo-element, transform-origin left, `--dur-fast`).

### 3.2 Hero (billchien) — full viewport, 2 columns
Layout (desktop): left column ~48 % width, right column is the portrait.
- Top-left: small square monogram/logo tile (rounded 12 px, `--ink` fill). Placeholder: Anna's initials.
- Name in two stacked lines, huge, uppercase, display font, flush left:
  `ANNA` / `[SURNAME]`. The second line may be wider than the first — that asymmetry is part of the look.
- Tagline: short 3–4 line paragraph, body font, sitting to the right of the first name line, top-aligned with it. Placeholder: "Web developer & designer building interfaces that are fast, clear and a little playful."
- Bottom row, small caps, spread across the left column in three columns: **location** · **date** · **live time**.
  - Location: `[CITY, COUNTRY]` (fill from `content/site.ts`).
  - Date: `SEP 6, 2026` format, computed on the client in the owner's timezone.
  - Time: live clock in the **owner's** timezone (`Europe/Vienna`), updates every second, **24 h with seconds** like russellnumo (`13:57:23`); optional 12 h variant behind a constant. Render on client only to avoid hydration mismatch.
  - Optional (russellnumo): a `● OPEN TO WORK` / `● AVAILABLE FOR INTERNSHIPS` status pill bottom-right with a slowly pulsing dot.
- Right column: full-height portrait image, `object-fit: cover`, flush to the right frame edge. **Placeholder:** a neutral blurred/gradient block with a subtle "portrait placeholder" label, sized 3:4, swapped later for `public/images/portrait.webp`.

Animations (matching the verified billchien markup):
- On load (after preloader): the name is split into **characters** (`SplitText type: 'chars'`, each char `display: inline-block`, line wrapper `overflow: hidden`). Letters slide up `yPercent: 110 → 0`, `--dur-slow`, `--ease-out`, stagger 0.04 s per char, second name line starting 0.15 s after the first. Tagline lines follow with SplitText line stagger. Bottom meta row fades up last (`y: 12 → 0`). Portrait scales from 1.15 → 1 with a `clip-path: inset(0 0 100% 0) → inset(0)` wipe from top over `--dur-slow`.
- On scroll: the portrait carries `will-change: transform` and is transformed with scroll (like the reference) — move it at 0.85× scroll speed and scale 1 → 1.08, name at 1.05× (`ScrollTrigger scrub: true`). Hero content fades to 0 opacity by the time the section is 60 % scrolled out.
- Optional charly touch below the hero: a full-width **marquee** of the name in Nimbus Sans Bold with a small round monogram badge between repeats (`xPercent: 0 → -50`, linear, ~20 s loop, speed nudged by scroll velocity via `lenis.velocity`).

### 3.3 About — "(01) About" (russellnumo)
- Left: small caps label `(01)` and title "About" in display font. Right: two paragraphs, first one larger (~22 px), second normal.
- Optional row of three rotating role words below ("Frontend developer · UX/UI designer · Creative") — russellnumo shows each role twice, which is a **marquee**: an infinite horizontal loop (`xPercent: 0 → -50`, linear, ~18 s per cycle, pauses on hover).
- Reveal: label + title from below on enter (`start: 'top 80%'`), paragraphs SplitText by line, stagger .05 s.

### 3.4 Featured Work — "(02) Work" (russellnumo layout + charly hover)
Section header: `(02)` + "Featured Work" + small caps hint "[Scroll to explore more]".

Each project is a full-width row (not a grid), stacked vertically:
- Left column meta (small caps): `(01)`, category, year.
- Right/main: large media (16:10), then project title in display font, short description, link `View Project →`.
- **Data** comes from `content/projects.ts`:
  ```ts
  { slug, title, category, year, description, cover, video?, status: 'live' | 'wip' }
  ```

Interactions:
- **Enter reveal:** media clip-path wipe (`inset(0 0 100% 0) → inset(0)`) with inner image scale 1.2 → 1; title mask-reveal; stagger meta.
- **Video (charly, verified):** if `video` exists, render `<video autoplay loop muted playsinline poster={cover}>` with mp4 + webm sources and `object-fit: cover` — it plays continuously, no hover needed. Lazy-load with an IntersectionObserver (`play()` on enter, `pause()` on leave) so off-screen videos don't burn CPU. Hover: media scales 1 → 1.04 (`--dur-base`).
- **Hover distortion (russellnumo, verified WebGL):** a `<canvas>` overlay per image (`position: absolute; inset: 0; pointer-events: none`), rendered with **ogl**: a full-quad plane textured with the cover image, fragment shader displaces UVs by mouse position × velocity (decays back to 0). Canvas fades to `opacity: 1` on hover and back to 0 on leave; the plain `<img>` stays underneath as the fallback and the DPR-aware canvas sizes to the image box. Skip on touch devices and `prefers-reduced-motion`. Ship pass 1 (CSS scale hover only) first, add the shader as pass 2.
- Title hover: text slides up and a duplicate slides in from below (`overflow: hidden` wrapper, two stacked spans, `yPercent: -100`).
- Arrow in `View Project →` nudges 6 px right on hover.
- Click → `/work/[slug]` with page transition (§3.9).

**WIP placeholder state (`status: 'wip'`):**
- Same row, same enter animation, so scrolling feels finished.
- Media: grayscale static thumbnail or a generated gradient/noise block, no video, no distortion.
- A small caps pill `IN PROGRESS` next to the `(0n)` index.
- Link text becomes `Case study coming soon` — not clickable (`aria-disabled`), or links to a minimal detail page that says "In progress" with the same layout.
- Cursor label over it reads "Soon" instead of "View".

### 3.5 Manifesto / pull-quote (russellnumo, optional but recommended)
One large quote paragraph (display or large body, ~2.5 vw), in quotation marks, centred with wide margins. Reveal: SplitText by **word**, each word fades from `opacity .15 → 1` as it crosses the viewport centre (`scrub: true`) — the classic "read-along" reveal.

### 3.6 Skills — "(04) Skills" (russellnumo Services, renamed)
A vertical list of 4–6 rows. Each row:
- Left: skill group name in large body/display (`Frontend`, `Design`, `3D & Motion`, `Tooling` …).
- Right: `( )` marker and a small caps hint that alternates side per row: `← click me` / `click me →`.
- Click (or hover on desktop) toggles the row: the `( )` becomes `(●)`, the hint disappears, and a line of sub-skills expands below with a height auto-tween (`--dur-base`, `--ease-out`) and staggered fade: e.g. `React / Next.js · TypeScript · GSAP · CSS · Vue`, `Figma · UI/UX · Prototyping`, `Blender · Grease Pencil · Adobe Animate`, `Docker · Git · Laravel`.
- Only one row open at a time. Rows separated by 1 px `--muted` lines that draw in (`scaleX`) on scroll.

### 3.7 Q&A — "(05) Q&A" (billchien)
- Section title "Q&A". A list of 5–7 questions as accordion items.
- Closed: question in body font 20–24 px, `+` icon right. Open: `+` rotates 45° to `×`, answer expands (height auto tween) and fades in.
- One open at a time. Divider lines draw in on scroll like Skills.
- Content lives in `content/site.ts` (`qa: {q, a}[]`) with placeholder questions: "What kind of projects do you enjoy most?", "What do you do when you're not coding?", "What are you learning right now?", "What's your favourite tool?", "How do you approach a new project?".

### 3.8 Contact + Footer — "(03) Contact" (russellnumo, replicate closely)
Structure, top to bottom:
1. Short lead paragraph: "For enquiries, collaboration requests or job opportunities, don't hesitate to reach out!"
2. Huge title "Get in touch" in display font.
3. Email as a large link (hover: underline draw-in; click copies + shows "Email copied").
4. Phone (optional, from `site.ts`).
5. Bottom bar, small caps, three columns: `©2026 [Name]` · socials row `GitHub · LinkedIn · Instagram` · `Designed & Developed by [Name]`.
6. A **local time** repeater is a nice echo of the hero (optional).

Animations: title mask-reveal; the whole footer sits behind the previous section and is **revealed as if uncovered** — previous section has `z-index` above and the footer is `position: sticky; bottom: 0` (the "curtain lift" effect common on these sites). Social links get the underline draw-in.

### 3.9 Project detail page `/work/[slug]`
- Hero: project title (display), meta row (category · year · role · stack), full-width cover with the same clip-path wipe.
- Body: alternating text blocks and media (images/video), each with enter reveals; a 2-column "Challenge / Solution" block; a gallery of 2–4 images.
- Bottom: "Next project →" card that links to the following `live` project.
- **Page transition (russellnumo, verified):** a fixed full-screen overlay of **12 columns** (`width: 8.333%` each, `background: var(--ink)`). On link click the columns grow `height: 0 → 100%` from the top with a 0.04 s left→right stagger (`--dur-base`, `--ease-inout`); route changes while covered; columns then shrink from the bottom with the same stagger to reveal the new page, whose hero animation starts as the last column leaves. Implement with `motion`'s `AnimatePresence` in a template wrapper (or a GSAP timeline triggered from a custom `Link`). Back navigation reverses the stagger direction.
- WIP projects reuse this template with an "In progress" banner and placeholder blocks.

---

## 4. Content & placeholders

- All copy, links, skills and Q&A in `content/site.ts`; all projects in `content/projects.ts`. Nothing hard-coded in components.
- Placeholders are explicit: strings prefixed `[PLACEHOLDER]` and images under `public/placeholders/`. Add a one-line `// TODO: replace` where each is consumed so they're grep-able.
- Start with 2 `live` projects (dummy data) and 2 `wip` projects to prove both states render and animate correctly.

---

## 5. Build order for Claude Code (one step per session)

1. Scaffold Next.js + TS, tokens/fonts, Lenis + GSAP wiring, page frame, scroll progress, mail button, reduced-motion handling.
2. Preloader + Nav + Hero (incl. live clock/date). Review in browser before continuing.
3. About + Work rows with enter reveals and WIP state. Hover video, then CSS distortion pass.
4. Manifesto, Skills, Q&A.
5. Contact/Footer with the sticky reveal.
6. Detail page template + page transitions.
7. Polish: custom cursor, WebGL distortion (optional), responsive pass (≤ 768 px: hero stacks name over portrait, meta row wraps to two lines, nav panel full-screen), Lighthouse + keyboard/focus check.

At each step: run the dev server, screenshot the section, and compare against the reference before moving on. Match the *feel* (timing, easing, restraint), not pixel positions.

---

## 6. Remaining open items
- Everything technical is verified (§0). Only decision left: buy Manuka Black for the hero name, or ship with Anton/Tusker.
