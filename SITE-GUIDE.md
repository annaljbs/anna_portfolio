# Site guide: how to change your portfolio

This guide explains where everything on the website lives and how to change it yourself: text, pictures, videos, projects, colours. You don't need to understand the code. Almost everything you'll want to change is in **two files**:

- `content/site.ts` holds all the text on the home page: hero, About, Skills, Q&A, footer and so on.
- `content/projects.ts` holds all the projects: titles, texts, pictures and videos.

In the code, look for comments that start with **`EDIT:`**. They mark the places that are safe and useful to change.

---

## 1. Quick start

1. Open the project folder in VS Code, then open a terminal with **Terminal → New Terminal**.
2. Run `npm run dev` and open <http://localhost:3000> in the browser.
3. Change a file and save it. The browser updates by itself.
4. Before you publish, run `npm run build` (you can stop the dev server first with `Ctrl + C`). If something is wrong, for example a typo or a missing comma, the build tells you the file and line.

If `npm run dev` says the port is in use, the site is probably already running. Just open the address.

---

## 2. Where things are

| Folder | What's inside | Will you edit it? |
|---|---|---|
| `content/` | All texts and project data | **Yes, this is your main place** |
| `public/` | Pictures and videos the site shows | **Yes, put your files here** |
| `styles/` | Colours, fonts, text sizes (`tokens.css`) | Sometimes: look & feel |
| `components/` | The building blocks of each section (layout + animation) | Rarely: only the `EDIT:` spots |
| `app/` | Pages and routes (home page, project pages) | No |
| `lib/` | Helpers (animations, smooth scroll, fonts, video links) | No |

---

## 3. Changing text, section by section

All of these are in **`content/site.ts`**. These rules apply everywhere in that file:

- **Only change the text between the quotes.** Keep the quotes and the comma at the end of each line.
- **Apostrophes:** text inside `'…'` can't contain a plain `'`. Use the typographic `’` instead (`I’m`), or wrap the whole text in double quotes: `"What's your favourite tool?"`.
- **Lists in `[ … ]`** can grow or shrink. Add or delete whole items, including their comma.
- Where a comment says so, empty quotes `''` hide that line on the page.

### Name, contact basics (top of the file)
| Field | Where you see it |
|---|---|
| `firstName`, `surname` | The two giant lines of the hero |
| `name` | Menu bar, browser tab title, footer |
| `tagline` | Short line under the hero name, also the Google description. `''` hides it |
| `location` | Hero meta row ("Gunskirchen, Austria · date · time") |
| `timezone` | Time zone of the live clocks, e.g. `'Europe/Vienna'` |
| `email` | Menu, floating mail button, big footer link |
| `status` | The pill in the hero ("Ready for work"). `''` hides it |
| `portrait` | Hero photo. See [5. Media files](#5-media-files) |

### Menu (`nav`)
These are the links in the slide-out menu. You can rename a `label` or reorder or delete lines. Keep the `href` values (`#about`, `#work` …), because they jump to the sections.

### About (`about`)
- `number` is the small `(01)` label. `title` is the big heading.
- `lead` is your bold About text. **`\n\n` starts a new paragraph.** Example:
  ```ts
  lead: 'First paragraph.\n\nSecond paragraph.',
  ```
- `roles` are the words in the scrolling band under the text: `['Student', 'Maker', …]`.

### Featured Work (`work`)
This holds only the section texts: `title`, `hint` (the small text next to the title), `viewLabel` (the "View Project" link), and `wipLabel` / `wipPill` (the texts on projects that are in progress). **The projects themselves are in `content/projects.ts`.** See [section 4](#4-projects).

### Manifesto (`manifesto`)
`quote` is the big centred sentence that lights up word by word as you scroll. One or two sentences read best.

### Skills (`skills`)
Each group is one clickable row:
```ts
{ name: 'Video', items: ['Premiere Pro', 'DaVinci Resolve'] },
```
- `name` is the row title, and `items` open below it.
- To add a row, copy a whole line. To delete one, remove the line.
- `hints` holds the little "click me →" texts.

### Q&A (`qa`)
Each `{ q: '…', a: '…' }` block is one question with its answer. You can add, remove or reorder whole blocks. Questions with an apostrophe use `"…"` quotes.

### Contact / footer (`contact`)
| Field | What it is |
|---|---|
| `lead` | Small line above the big title |
| `title` | "Get in touch" |
| `copied` | Text that appears after someone clicks your email (it copies it) |
| `phone` | Your phone number, or `''` to hide it |
| `timeLabel` | Label of the footer clock |
| `credit` | Text before your name in the bottom bar |
| `socials` | Bottom-bar links: `{ label: 'Instagram', href: 'https://…' }`. Add or delete lines. WhatsApp uses `https://wa.me/<number with country code, no + or spaces>` |

### Floating mail button
It has no text of its own. It opens a new email to `email`.

### Project page labels (`project`)
These are fixed words that appear on every project page: "Back to work", "Next project", "Challenge", "Solution", the meta-row titles (Category / Year / Role / Stack), and the banner text on in-progress projects.

---

## 4. Projects

All projects are in **`content/projects.ts`**, in the `projects` list at the bottom. The header comment at the top of that file explains every field.

### Add, delete, reorder
- **Add:** copy a whole project block, from `{` down to `},`, and paste it where you want it. Give it a new `slug`.
- **Delete:** remove the whole block.
- **Reorder:** move whole blocks. The order in the file is the order on the website.

The website builds a page for every project automatically at `/work/<slug>`.

### Live vs. in progress
- `status: 'live'`: the project is clickable, and its video and player work.
- `status: 'wip'`: the project shows a grey cover with an "In progress" pill on the home page. You can't click it on the home page, but `/work/<slug>` still exists and shows an "In progress" banner at the top. It has no video or player. "Next project" links skip it.

### Three kinds of media
| What | Field | Where it shows |
|---|---|---|
| **Cover picture** | `cover` (always needed) | Home row, top of the project page, "Next project" card |
| **Short loop** (muted, autoplay) | `video: { mp4: '/projects/03/loop.mp4' }` | Over the cover on the home row and at the top of the project page |
| Loop on the home row only | add `videoOnPage: false` | Project page shows the still cover instead |
| **Full video** (YouTube/Vimeo) | `embed: 'https://www.youtube.com/watch?v=…'` | Replaces the cover at the top of the project page with a player |

`embed` accepts these links: `youtube.com/watch?v=…`, `youtu.be/…`, YouTube Shorts and `vimeo.com/123456789`. A search-results or playlist link is ignored and the cover shows instead. Delete the `embed` line for projects without a full video.

### Your 10 projects, as currently set up
| # | Project | Home row | Top of project page | Sections & gallery |
|---|---|---|---|---|
| 1 | Short documentary (**wip**) | grey cover | cover + "In progress" banner | pictures. `embed` is ready; set `status: 'live'` when the film is done |
| 2 | Game UI/UX + video | cover | YouTube/Vimeo player | screenshots |
| 3 | Blender rigging | loop | loop | pictures |
| 4 | Game development | cover | player | pictures |
| 5 | Showreel | cover (thumbnail) | player | text only |
| 6 | UX user study | cover | cover | pictures |
| 7 | Image video | loop snippet | player | text only |
| 8 | Character design | cover | cover | pictures |
| 9 | Cozy place | loop snippet | cover | pictures |
| 10 | Logo design | cover | cover | pictures |

Right now every `embed` holds a placeholder video, and the pictures are grey placeholder images. Every spot to replace has a `// TODO:` comment saying which file goes there.

### Editing one project
Every project has its **own full set of fields**: role, stack, intro, sections (`blocks`), challenge, solution and gallery, each with its own placeholder text and placeholder pictures. Changing one project never affects another.

- **Fewer pictures:** delete the whole `{ src: …, alt: '' },` line from `gallery`, or the `media: …` line from a section to make it text-only.
- **More pictures or sections:** copy a line or a whole `{ heading, text, media }` block and paste it below.
- **No gallery at all:** `gallery: [],`
- **Video only** (like project 5): delete the `intro`, `challenge` and `solution` lines and set `blocks: [],` and `gallery: [],`. The project page then shows just the title, meta row and the player.
- Each placeholder picture has a `// TODO: replace → /projects/NN/…` comment suggesting a file name for that project's folder.

A full project entry looks like this. You can also use it as a template for a new project:

```ts
{
  slug: 'kino-spot',
  title: 'Kino Spot',
  category: 'Commercial · Color grading',
  year: '2026',
  description: 'One or two lines shown on the home page.',
  cover: '/projects/02/cover.jpg',
  embed: 'https://www.youtube.com/watch?v=XXXXXXXXXXX',   // delete if no full video
  // video: { mp4: '/projects/02/loop.mp4' },              // short loop, if wanted
  status: 'live',
  role: 'Director, editor, colorist',
  stack: ['Premiere Pro', 'DaVinci Resolve'],
  intro: 'Opening paragraph of the project page.',
  blocks: [
    { heading: 'Concept', text: '…', media: { src: '/projects/02/concept.jpg', alt: 'Storyboard sketches' } },
    { heading: 'Shoot', text: '…' },                       // no media = text-only section
  ],
  challenge: 'What made it hard.',
  solution: 'What you did and the outcome.',
  gallery: [
    { src: '/projects/02/still-1.jpg', alt: '…' },
    { src: '/projects/02/still-2.jpg', alt: '…' },
  ],                                                       // [] = no gallery
},
```

Notes:
- `blocks` can have as many sections as you like, and they alternate left and right.
- `gallery` shows at most 4 pictures, and the 3rd one spans the full width.
- `alt` is a short description of the picture for people using screen readers. Use `''` only for purely decorative images.
- Once no project uses the grey images in `public/placeholders/` any more, you can delete that folder.

---

## 5. Media files

### Where to put them
Everything goes inside **`public/`**. In the code, you write the path **without** `public`:

| File on disk | Written in the code as |
|---|---|
| `public/projects/03/cover.jpg` | `'/projects/03/cover.jpg'` |
| `public/images/portrait.webp` | `'/images/portrait.webp'` |

Tip: use one folder per project (`public/projects/01/`, `02/` …) so you always know which file belongs where. Avoid spaces and umlauts in file names: `cozy-place-1.jpg` is fine, `Gemütlicher Ort 1.JPG` is not.

### Pictures
- **Formats:** `.jpg` / `.jpeg`, `.png`, `.webp`, `.avif`, `.gif`, `.svg`.
- **Size:** about 2000–2500 px wide is plenty. The site makes smaller versions for phones automatically.
- **Shape:** anything works, because the boxes crop to fill themselves. Keep the important part near the centre.
- **Portrait:** upright 3:4, about 1200 × 1600 px. Replace `public/images/portrait.webp`, or add a new file and change `portrait` in `content/site.ts`.

### Short loops (`video`)
- **Format:** `.mp4` with **H.264** video. It plays in every browser. You can also add a `.webm` copy, which is smaller and is used where supported: `video: { mp4: '…mp4', webm: '…webm' }`.
- **Length and size:** 5–15 seconds, 1280–1920 px wide, **under about 10 MB**. Loops always play muted, so remove the audio when you export.
- **Not supported:** `.mov` and `.mkv` don't play in Chrome or Firefox. Export them as H.264 `.mp4` first (from Premiere, DaVinci Resolve or HandBrake).
- The cover picture shows while the loop loads, and also for visitors who turned off animations.

### Full videos (`embed`)
Upload the video to YouTube or Vimeo, copy the link from the address bar, and paste it into `embed`. On YouTube, "Unlisted" works too, but "Private" does not. On Vimeo, allow embedding in the video's privacy settings.

---

## 6. Look & feel

Everything here is in **`styles/tokens.css`**. The `EDIT:` comments explain each group.

- **Colours:** at the bottom of the file there are two colour sets.
  - `light` is used on Hero, About, Manifesto and Skills.
  - `dark` is used on Work, Q&A, the footer, the menu and the project pages.
  - In each set, `--bg` is the background, `--ink` is used for headings, `--text` for paragraphs, `--muted` for small labels and `--line` for dividers.
  - **If you change a `--bg`, change the same colour in `lib/theme.ts` too.** That file holds the colour the page fades to when you scroll between sections.
- **Text sizes:** the `--fs-…` values.
  - `hero` is the giant name, `display` the section titles, `body` normal text, `body-lg` large paragraphs and `mono` the small labels.
  - `1rem` = 16 px. `clamp(min, preferred, max)` means the size scales with the window but stays between min and max.
- **Fonts:** the font files are in `styles/fonts/` and are loaded in `lib/fonts.ts`.
  - Anton is used for the hero name, Nimbus Sans Bold for titles, Inter for body text and Geist Mono for labels.
  - To swap one, put the new `.woff2` file in `styles/fonts/` and change its `src` in `lib/fonts.ts`.
- **Small settings in components** (each marked `EDIT:`):
  - `components/About.tsx` → `duration={18}` is the speed of the roles band. Lower is faster.
  - `components/Clock.tsx` → `HOUR_12` switches between a 24-hour and a 12-hour clock.
  - `components/Preloader.tsx` → `COUNT_SECONDS` is how long the loading counter runs.
  - `components/ProjectPage.tsx` → the gallery shows at most 4 pictures.

---

## 7. Every file explained

### Content (edit freely)
| File | What it does | What you can change |
|---|---|---|
| `content/site.ts` | All home-page text, menu, contact data, project-page labels | Everything marked `EDIT:` (see section 3) |
| `content/projects.ts` | The project list and each project's text and media | Everything in the `projects` list (see section 4) |
| `public/images/` | Hero portrait | Replace the picture |
| `public/projects/` | Your project pictures and videos | Add, replace, delete files (and update the paths in `projects.ts`) |
| `public/placeholders/` | Grey placeholder images | Delete once nothing refers to them |

### Pages (`app/`): don't touch
| File | What it does |
|---|---|
| `app/layout.tsx` | The frame around every page: fonts, menu, mail button, scroll bar, page transition, browser tab title |
| `app/page.tsx` + `page.module.css` | The home page: stacks Hero → About → Work → Manifesto → Skills → Q&A → Footer |
| `app/work/[slug]/page.tsx` | Builds one project page per entry in `projects.ts` (`/work/project-two` …) |
| `app/favicon.ico` | The little icon in the browser tab. You can replace it with your own `.ico` |

### Sections (`components/`): layout and animation
Each `.tsx` file has a matching `.module.css` file with its styles. The texts come from `content/`, so you rarely need to open these.

| File | What it shows |
|---|---|
| `Preloader.tsx` | The 0 → 100 counter on the first visit (`EDIT:` duration) |
| `Nav.tsx` | Top bar with your name and "menu", and the slide-out menu |
| `Hero.tsx` | Giant name, tagline, location / date / clock, portrait |
| `Clock.tsx` | The live clock in the hero and footer (`EDIT:` 12/24 h) |
| `About.tsx` | About heading, your lead paragraphs, roles band (`EDIT:` speed) |
| `Marquee.tsx` | The endless scrolling band used by About |
| `Work.tsx` | "Featured Work" heading and the list of projects |
| `WorkCard.tsx` | One project row on the home page (cover/loop, title, link) |
| `ProjectVideo.tsx` | The muted autoplay loop (pauses when off-screen) |
| `Manifesto.tsx` | The big quote that lights up as you scroll |
| `Skills.tsx` | Clickable skill rows |
| `QA.tsx` | The question/answer accordion |
| `Footer.tsx` | Contact section: big "Get in touch", email (click copies it), clock, socials |
| `MailButton.tsx` | Round mail button bottom-right (opens a new email) |
| `ProjectPage.tsx` | The whole project page: title, meta row, cover/player, sections, gallery, next project |
| `ProjectEmbed.tsx` | The YouTube/Vimeo player box |
| `PageFrame.tsx` | The thin rounded frame around the window |
| `ScrollProgress.tsx` | The thin bar at the bottom that fills as you scroll |
| `PageTransition.tsx` | The column wipe when switching between pages |
| `ThemeController.tsx` | Fades the background between light and dark sections |
| `IntroProvider.tsx` | Makes the hero wait for the preloader before animating in |
| `SmoothScroll.tsx` | Smooth scrolling |
| `useExpandable.ts`, `useSectionReveal.ts` | Shared open/close and fade-in animations |

### Helpers (`lib/`): don't touch, except where noted
| File | What it does |
|---|---|
| `lib/embed.ts` | Turns a YouTube/Vimeo link into a player address |
| `lib/fonts.ts` | Loads the four fonts (change it only to swap fonts) |
| `lib/theme.ts` | Light/dark background colours for the scroll fade (keep them equal to `tokens.css`) |
| `lib/gsap.ts` | Animation library setup, speeds and easing |
| `lib/lenis.ts` | Smooth-scroll settings |
| `lib/intro.ts` | Remembers that the preloader already ran this visit |

### Styles (`styles/`)
| File | What it does | What you can change |
|---|---|---|
| `styles/tokens.css` | Colours, fonts, text sizes, spacing, animation timing | Colours and text sizes (section 6) |
| `styles/type.css` | Text styles (`t-display`, `t-body` …) built from the tokens | Rarely |
| `styles/globals.css` | Base styles for the whole site | No |
| `styles/fonts/` | Font files and their licences | Swap fonts (section 6) |

### Project files in the root: don't touch
| File | What it does |
|---|---|
| `package.json` / `package-lock.json` | Lists the libraries the site uses, plus the `npm run …` commands |
| `next.config.ts`, `tsconfig.json`, `eslint.config.mjs` | Settings for Next.js, TypeScript and code checking |
| `.gitignore` | Files Git should ignore |
| `README.md` | Short technical overview |
| `portfolio-build-brief.md` | The original design brief the site was built from |
| `create-projects.md` | The step-by-step plan for the 10-project setup |
| `TODO.md` | Open polish ideas |
| `AGENTS.md`, `CLAUDE.md` | Notes for AI coding assistants |
| `SITE-GUIDE.md` | This guide |

---

## 8. Troubleshooting

| Problem | Likely cause and fix |
|---|---|
| A picture is grey or broken | The path in the code doesn't match the file. Check the spelling, the upper/lower case (`Cover.JPG` ≠ `cover.jpg`), and that you left out `public` |
| A loop doesn't play | It's not an H.264 `.mp4` (e.g. a `.mov`), the path is wrong, or the file is very large. The cover stays visible in that case |
| The player doesn't appear | The `embed` link isn't a single video (search or playlist link), the project is `'wip'`, or the video is private or blocks embedding |
| Red error after saving `site.ts` / `projects.ts` | Usually a missing comma, a missing quote, or a `'` inside `'…'` text. The error names the line. Compare it with the lines around it |
| A project page shows 404 | The `slug` changed but an old link still uses the previous one, or two projects share the same `slug` |
| Changes don't show up | Save the file. If needed, reload the browser. If you see a stale page, stop the dev server (`Ctrl + C`) and run `npm run dev` again |

Before publishing, always run `npm run build`. If it finishes without errors, the site is ready.
