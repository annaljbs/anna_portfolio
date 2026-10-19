# Plan: 10 projects, each with its own media setup

## Context
Anna needs 10 projects instead of 4. All text stays as `[PLACEHOLDER]` copy, the same as projects 1 and 2 have now (title, category, year, role, stack, description, intro, Concept/Build blocks, challenge/solution). What differs per project is the **media**:
- some projects have a full YouTube or Vimeo video that plays inside the project page;
- some have a short looping clip on the Featured Work card;
- some have pictures only.

The design stays exactly as it is.

| # | Project | Home card | Project page top | Sections & gallery |
|---|---|---|---|---|
| 1 | Short documentary (**wip**) | grey cover (`project1.jpeg`) | cover + "In progress" banner | pictures; `embed` field prepared |
| 2 | Game UI/UX + video | cover | **YouTube/Vimeo player** | screenshots |
| 3 | Blender rigging | **loop** | loop | pictures |
| 4 | Game development | cover | **player** | pictures |
| 5 | Showreel | cover (thumbnail) | **player** | text only |
| 6 | UX user study | cover | cover | pictures |
| 7 | Image video | **loop snippet** | **player** | text only |
| 8 | Character design | cover | cover | pictures |
| 9 | Cozy place | **loop snippet** | cover (no loop) | pictures |
| 10 | Logo design | cover | cover | pictures |

Files that don't exist yet point at `/placeholders/*.svg`. Each of those paths has a `// TODO: replace → /projects/NN/<file>` comment that names where the real file should go. The existing `project1.mp4` and `project2-small.mp4` stay in the folder untouched.

---

## Step 1: Data model + 10 project entries (`content/projects.ts`)
- Add `embed?: string` to `Project`. It holds a YouTube or Vimeo link.
- Add `videoOnPage?: boolean` (default `true`). When it's `false`, the loop plays only on the home card.
- Make `ProjectBlock.media` optional, for text-only blocks.
- Replace the 4 entries with 10 (`project-one` … `project-ten`). Each keeps `...placeholderDetail` and sets its media according to the table.
- Small, required guards in `components/ProjectPage.tsx`, so the type check passes now that block media is optional and some galleries are empty:
  - render `MediaBox` only when `block.media` is set;
  - hide the gallery section when it's empty;
  - play the hero loop only when `videoOnPage !== false`.
- Check: `npx tsc --noEmit`. The home page should show 10 rows, with loops on 3, 7 and 9.

## Step 2: YouTube/Vimeo player
- New `lib/embed.ts`: `toEmbedUrl(url)` turns YouTube links (`watch?v=`, `youtu.be/`, `shorts/`) into `youtube-nocookie.com/embed/<id>` and Vimeo links (`vimeo.com/<id>`) into `player.vimeo.com/video/<id>`. Anything else returns `null`.
- New `components/ProjectEmbed.tsx`: a 16:9 `<iframe>` (titled, fullscreen allowed, lazy-loaded, no autoplay).
- `ProjectPage.tsx`: for a live project with an `embed`, the player goes inside the existing cover wrappers, so the intro wipe still plays. The box gets `data-embed`.
- CSS: `.cover[data-embed] { aspect-ratio: 16/9 }` and an iframe that fills the box.
- Check: a public test link on project 2 plays, then the field is reset to the placeholder.

## Step 3: Text-only block layout
- CSS: `.block[data-text-only] { grid-template-columns: 1fr; }`. Set that attribute in `ProjectPage.tsx`.
- Check `/work/project-five` and `/work/project-seven`.

## Step 4: Verify in the browser
- Run `npm run build`, which should build all 10 pages.
- Use Playwright with the installed Chrome from the scratchpad. Anna's dev server may already be running on port 3000.
- Take screenshots at desktop and 390 px of: the home list, project 2 (player), project 9 (static cover) and project 5 (player + text only).

## Step 5: "Edit here" comments + a site guide (updated)

Anna wants to change text and media herself without reading the code. Almost all content already lives in two files: `content/site.ts` and `content/projects.ts`. Components read from those two files. A few things live elsewhere:
- the colours and font sizes (`styles/tokens.css`);
- the roles marquee speed (`components/About.tsx`, `duration={18}`);
- the files in `public/`.

### 5a. Comments in the code (comments only, no behaviour change)
- **`content/site.ts`:**
  - Above each section object (nav, hero, about, work, manifesto, skills, qa, contact, project labels, email, portrait): a short `// EDIT:` comment saying what it shows on the page and how to change it. Examples: "roles = words in the scrolling marquee; add or remove strings", and "`\n\n` in `lead` starts a new paragraph".
  - On fields whose effect isn't obvious: the same short note, for example lists that can grow or shrink, or the portrait path that points into `public/images/`.
- **`content/projects.ts`:**
  - A header block that walks through every field (`slug`, `title`, `category`, `year`, `description`, `cover`, `video`, `videoOnPage`, `embed`, `status`, `role`, `stack`, `intro`, `blocks`, `challenge`, `solution`, `gallery`).
  - The header also covers allowed file types, recommended sizes, how to add, delete or reorder a project, and how to make a section text-only.
  - Per-entry TODO comments already exist; they stay.
- **`styles/tokens.css`:** `/* EDIT: */` notes on the colour and font-size tokens, saying what each one changes on the page.
- **Components:** comment only the few values Anna might change that sit outside `content/`, e.g. the marquee `duration` in `About.tsx` and the gallery `.slice(0, 4)` cap in `ProjectPage.tsx`. No other component edits.
- **Folders:** no README files inside `public/`. The guide covers them.

### 5b. New `SITE-GUIDE.md` in the project root
Written for Anna, in plain language. Sections:
1. **Quick start:** run the site (`npm run dev`, open localhost:3000), see changes live, then build and check (`npm run build`).
2. **Where things are:** a short folder map (`app/`, `components/`, `content/`, `lib/`, `public/`, `styles/`).
3. **Changing text, section by section:** one subsection per page section in page order: Nav/menu, Hero, About, Featured Work, Manifesto, Skills, Q&A, Contact/footer, Mail button, Project pages. Each subsection covers:
   - what you see on the page;
   - which file and field to edit;
   - a small before/after example;
   - what you can add or remove.
4. **Projects:** add, delete, reorder, wip vs live, and the three media types: cover pictures, loop clips (`video`) and YouTube/Vimeo (`embed`). Includes the per-project media table from this plan and a copy-paste template entry.
5. **Media files:** allowed formats and sizes for pictures and videos, `public/` paths vs the `/projects/...` form used in the code, how to export loops (H.264 mp4, muted, under ~10 MB), and how to replace the portrait.
6. **Look & feel:** colours, fonts and font sizes in `styles/tokens.css`, plus the marquee speed.
7. **Every file explained:** a table with one row per tracked source file. Columns: what it does, what it's for, and what you can safely change, or "don't touch".
8. **Troubleshooting:** a missing image or 404, a video not playing (wrong format, or a link that isn't a single video), a type error after editing (a missing comma or quote).

### Check
- `npx tsc --noEmit` and eslint should pass. Only comments change, so the build output must stay the same.
- Run `npm run build` once.

---

**Status:** All steps (1–5) are done.
- Step 2: all `embed` fields use the placeholder video `https://www.youtube.com/watch?v=Y-x0efG1seA`.
- Projects 2, 4, 5 and 7 show the 16:9 YouTube player in the hero.
- Project 1 hides it while it's `wip`.
- Step 3: blocks without media get `data-text-only` and use a single column, so the text no longer flips to the right.
- Step 4: `npm run build` passes and pre-renders all 10 `/work/project-*` pages. Chrome check at 1440 px and 390 px:
  - home lists 10 rows; project 1 has no link (wip); loops are set on 3, 7 and 9;
  - every project page matches the table, the "Next project" chain skips project 1, and nothing scrolls sideways;
  - the only errors are the 404s for `/projects/03|07|09/loop.mp4`, which Anna hasn't added yet.

- Step 5: `EDIT:` comments are in `content/site.ts`, `content/projects.ts` (with a full field guide in its header), `styles/tokens.css`, `lib/theme.ts`, and the `About`, `Clock`, `Preloader` and `ProjectPage` components. `SITE-GUIDE.md` is in the root. Only comments changed, and the build passes.
- Follow-up: every project now has its own full fields and placeholder media (no shared `placeholderDetail` any more), so each one can be edited, trimmed or extended on its own.
