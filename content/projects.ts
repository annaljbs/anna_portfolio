/**
 * Featured work (§3.4) and its detail pages (§3.9). Rows render in this
 * order. `status: 'wip'` rows show the in-progress state on the home page
 * (grayscale cover, no video, no link) and an "In progress" banner with
 * placeholder blocks on their detail page. `video` is the muted loop,
 * `embed` a full YouTube/Vimeo video on the detail page. Media boxes use object-fit:
 * cover, so any cover/clip size works. Placeholders carry a TODO.
 *
 * ─── EDIT: HOW TO CHANGE PROJECTS ─────────────────────────────────────────
 * Every project is one { … } block in the `projects` list at the bottom.
 * The order of the blocks = the order on the home page.
 *  - Add:     copy a whole block (from `{` to `},`), paste it, give it a new slug.
 *  - Delete:  remove the whole block.
 *  - Reorder: move whole blocks up or down.
 *
 * Fields (? = optional, delete the line if you don't need it):
 *  slug         page address → /work/<slug>. lowercase-with-dashes, unique.
 *  title        big project title (home row + project page).
 *  category     small label (home row + "Category" on the project page).
 *  year         e.g. '2026'.
 *  description  one or two lines under the title on the home page.
 *  cover        picture for the home row, the project page top and the
 *               "Next project" card. Always needed.
 *  pageCover?   picture for the top of the project page only (the home row
 *               keeps `cover`). Leave out to use `cover` on both.
 *  video?       { mp4: '…' } short muted loop over the cover (home row and
 *               project page top). Optional { mp4, webm } for a smaller webm.
 *  videoOnPage? false = loop only on the home row; project page shows the cover.
 *  videoPlay?   'hover' = shows the first frame (cover) and plays the loop only
 *               while the mouse is over it (home row + project page); default autoplays.
 *  embed?       YouTube or Vimeo link (youtube.com/watch?v=…, youtu.be/…,
 *               vimeo.com/123…). Replaces the cover at the top of the project
 *               page with a player. Search/playlist links are ignored.
 *  caseStudy?   tall images (e.g. a Figma case study cut into slices) shown
 *               full width and uncropped, one under another with no gap, at
 *               the top of the project page instead of the cover. Each entry:
 *               { src, alt, width, height } — width/height = the file's pixels.
 *  status       'live' = clickable; 'wip' = grey "In progress", no link,
 *               no video/player.
 *  role         "Role" in the project page meta row.
 *  stack        tools list, e.g. ['Blender', 'After Effects'].
 *  intro?       first paragraph on the project page; leave out to hide it.
 *  blocks       text + picture sections, as many as you like:
 *               { heading: '…', text: '…', media: { src: '…', alt: '…' } }
 *               Leave out `media` for a text-only section.
 *  challenge? / solution?   the two-column text block; leave both out to hide it.
 *  rows?        horizontal rows of media right after Challenge / Solution:
 *               { layout: 'screens', media: [ … ] } = equal-width columns,
 *               { layout: 'elements', media: [ … ] } = small UI pieces at one
 *               height on a panel. Each media item: { src, alt, width, height }.
 *  gallery      up to 4 pictures at the bottom ([] hides the gallery).
 *
 * Every project has its own full set of fields and placeholder media, so
 * each one can be changed on its own: delete a block or gallery picture you
 * don't need (the whole { … }, line), or copy one to add more.
 *
 * Files: put them in public/projects/<number>/ and write the path WITHOUT
 * "public", e.g. public/projects/03/cover.jpg → '/projects/03/cover.jpg'.
 *  Pictures: .jpg .jpeg .png .webp .avif .gif .svg — ~2000–2500 px wide.
 *  Loops:    .mp4 (H.264), muted, 5–15 s, under ~10 MB; optional .webm.
 *            .mov/.mkv do not play in all browsers — export to .mp4.
 *  alt:      short description of the picture for screen readers.
 * ──────────────────────────────────────────────────────────────────────────
 */
export type ProjectStatus = 'live' | 'wip';

export type ProjectVideo = {
  mp4: string;
  webm?: string;
};

export type ProjectMedia = {
  src: string;
  alt: string;
  /** Pixel size of the file; required for caseStudy images so the page can reserve their space. */
  width?: number;
  height?: number;
};

/**
 * A horizontal row of media under Challenge / Solution.
 *  'screens' — equal-width columns (e.g. UI screens, same aspect ratio).
 *  'elements' — small pieces (buttons, icons, bars) at one shared height,
 *               centred on a subtle panel.
 * Every item needs width + height (the file's size) so it keeps its shape.
 */
export type ProjectRow = {
  layout: 'screens' | 'elements';
  media: ProjectMedia[];
};

export type ProjectBlock = {
  heading: string;
  text: string;
  /** Omit for a text-only block. */
  media?: ProjectMedia;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  /** Poster / static cover (home row and detail hero). */
  cover: string;
  /** Different picture for the top of the project page only; defaults to `cover`. */
  pageCover?: string;
  /** Autoplaying muted preview; omit for a static cover. */
  video?: ProjectVideo;
  /** false: the preview loops on the home card only; the detail hero stays static. */
  videoOnPage?: boolean;
  /** 'hover': the home card shows the first frame and loops the video only while hovered. */
  videoPlay?: 'auto' | 'hover';
  /** YouTube or Vimeo link, played in the detail hero instead of the cover. */
  embed?: string;
  /** Full-width, uncropped images stacked without gaps (e.g. a Figma case study);
   *  replaces the cover at the top of the project page. */
  caseStudy?: ProjectMedia[];
  status: ProjectStatus;
  /* Detail page (§3.9) */
  role: string;
  stack: string[];
  /** Omit to hide the intro paragraph. */
  intro?: string;
  blocks: ProjectBlock[];
  /** Rows of media shown right after Challenge / Solution; omit for none. */
  rows?: ProjectRow[];
  /** Omit both to hide the Challenge / Solution block. */
  challenge?: string;
  solution?: string;
  gallery: ProjectMedia[];
};

// EDIT: the project list. One { … } block per project, in display order.
export const projects: Project[] = [
  {
    slug: 'project-one',
    title: '[YUGOSLAVIA]',
    category: 'FILM',
    year: '2027',
    description:
      'Work in progress — Short Documentary about the Life in former Yugoslavia told from the Perspective of someone\'s Grandmother.', // TODO: replace
    cover: '/projects/project2.jpeg',
    embed: 'https://www.youtube.com/watch?v=Y-x0efG1seA', // TODO: paste the YouTube/Vimeo link when the film is finished, then set status to 'live'
    status: 'wip',
    role: 'Director, Producer, Editor, Cinematographer, Sound Designer', // TODO: replace
    stack: ['DaVinci Resolve', 'Premiere Pro', 'After Effects'], // TODO: replace
    intro:
      '[PLACEHOLDER] One paragraph that sets the project up: who it was for, what the brief asked, and the constraint that shaped it.', // TODO: replace
    blocks: [
      {
        heading: '[PLACEHOLDER] Concept', // TODO: replace
        text: '[PLACEHOLDER] A short paragraph on the idea and the first decisions: what the piece had to do and what it deliberately left out.', // TODO: replace
        media: { src: '/projects/project2.jpeg', alt: '' },
      },
      {
        heading: '[PLACEHOLDER] Build', // TODO: replace
        text: '[PLACEHOLDER] A short paragraph on how it was made: tools, the tricky part, and what you would do differently.', // TODO: replace
        media: { src: '/placeholders/media-2.svg', alt: '' }, // TODO: replace → /projects/01/block-2.jpg
      },
    ],
    challenge:
      '[PLACEHOLDER] What made this hard: the audience, the timeline, the technology, or the thing nobody had done before.', // TODO: replace
    solution:
      '[PLACEHOLDER] What you did about it, and the outcome in one or two concrete sentences.', // TODO: replace
    gallery: [
      { src: '/placeholders/media-3.svg', alt: '' }, // TODO: replace → /projects/01/gallery-1.jpg
      { src: '/placeholders/media-1.svg', alt: '' }, // TODO: replace → /projects/01/gallery-2.jpg
      { src: '/placeholders/media-2.svg', alt: '' }, // TODO: replace → /projects/01/gallery-3.jpg
    ],
  },
  // -----------
  // PROJECT TWO
  // -----------
  {
    slug: 'project-two',
    title: '[HEX\'N CATCH]',
    category: 'GAME', 
    year: '2026',
    description:
      'Hide, drink, and survive. In this 4-player asymmetrical party game, three undercover witches must chug their way to victory while dodging the ultimate buzzkill: a Witch Hunter tasked with catching them before they black out.', // TODO: replace
    cover: '/projects/02/cover.webp', // made from Plakat3.png: border trimmed, 2880 × 1800 like the other covers
    embed: 'https://youtu.be/5cZa_0SY_P8',
    status: 'live',
    role: 'UI/UX Designer, Game Designer, Editor, Colorist',
    stack: ['Unity', 'Figma', 'Illustrator', 'Premiere Pro', 'DaVinci Resolve'],
    intro:
      'This project was a collaborative effort to create a unique and engaging party game. My role was to design the user interface and ensure a seamless gameplay experience. The Project Video was filmed and edited by me.', // TODO: replace
    blocks: [
    ],
    challenge:
      'The challenge was to create a user-friendly interface that would enhance the gameplay experience.',
    solution:
      'I designed a clean and intuitive interface that made it easy for players to navigate the game and access the information they needed.',
    // EDIT: media rows under Challenge / Solution. Add, remove or reorder items;
    // width/height = the file's own size (keeps the proportions right).
    rows: [
      {
        layout: 'screens',
        media: [
          { src: '/projects/02/Username.svg', alt: 'Create Username screen', width: 1440, height: 1024 },
          { src: '/projects/02/Join.svg', alt: 'Create or Join Room screen', width: 1440, height: 1024 },
          { src: '/projects/02/Waiting.svg', alt: 'Waiting for other players screen', width: 1440, height: 1024 },
        ],
      },
      {
        layout: 'elements',
        media: [
          { src: '/projects/02/credits-button.svg', alt: 'Credits button', width: 289, height: 135 },
          { src: '/projects/02/grappling-hook.svg', alt: 'Grappling hook ability icon', width: 226, height: 200 },
          { src: '/projects/02/PickUp.svg', alt: 'Pick-up (drink) icon', width: 226, height: 200 },
          { src: '/projects/02/health.svg', alt: 'Health bar', width: 576, height: 135 },
        ],
      },
    ],
    gallery: [
      ],
  },
  // -----------
  // PROJECT THREE
  // -----------
  {
    slug: 'project-three',
    title: '[LIZZY]', 
    category: '3D',
    year: '2026',
    description:
      'Rigging and animation work for a 3D character.',
    cover: '/placeholders/project-4.svg', // TODO: replace → /projects/03/cover.jpg
    video: { mp4: '/projects/03/loop.mp4' }, // TODO: add this file (short muted loop)
    status: 'live',
    role: 'Rigging and Animation',
    stack: ['Blender'],
    intro:
      'Rigging and Animation Work for a 3D Character.', // TODO: replace
    blocks: [
      
    ],
    challenge:
      'The challenge was to create a realistic and fluid animation for the 3D character.', // TODO: replace
    solution:
      'I created a detailed rig and animated the character using keyframe animation to achieve a natural look and feel.', // TODO: replace
    gallery: [
      { src: '/placeholders/media-3.svg', alt: '' }, // TODO: replace → /projects/03/gallery-1.jpg
      { src: '/placeholders/media-1.svg', alt: '' }, // TODO: replace → /projects/03/gallery-2.jpg
      // { src: '/placeholders/media-2.svg', alt: '' }, // TODO: replace → /projects/03/gallery-3.jpg
    ],
  },
  {
    slug: 'project-four',
    title: '[LIVING ROOM]',
    category: 'GAME',
    year: '2026',
    description:
      'A game about a living room. Players explore the space and interact with objects.',
    cover: '/projects/04/hover-cover.webp', // first frame of the hover clip
    // Home card: first frame, plays in a loop only while hovered. Made from the
    // living-room recording: from 3 s to the end, editor title bar + cursor cropped.
    // The project page still shows the YouTube player (embed wins over video there).
    video: { mp4: '/projects/04/hover.mp4', webm: '/projects/04/hover.webm' },
    videoPlay: 'hover',
    embed: 'https://youtu.be/ZoMl3_uF2AQ',
    status: 'live',
    role: 'Coding with Blueprints, Trailer Production',
    stack: ['Unreal Engine', 'C++', 'Premiere Pro'],
    intro:
      'A game about a living room. Players explore the space, interact with objects and play mini-games.', // TODO: replace
    blocks: [
    ],
    challenge:
      'Work with Blueprints without any prior experience.',
    solution:
      'Thankfully, YouTube Tutorials and online resources helped me learn and master the use of Blueprints',
    gallery: []
  },
  // -----------
  // PROJECT FIVE
  // -----------
  {
    slug: 'project-five',
    title: '[QUESTIFY]',
    category: 'UI/UX, Design', 
    year: '2026',
    description:
      'Prototype for a new gamification app, with a Case Study showing the design process from low-fidelity to high-fidelity.',
    cover: '/projects/05/cover-02.webp', // top of the case study (home card + next-project card)
    // EDIT: the case study slices (made from public/projects/05/case-study-02.svg).
    caseStudy: [
      { src: '/projects/05/case-study-02/01.webp', alt: 'QUESTIFY case study, part 1 of 13', width: 2880, height: 4000 },
      { src: '/projects/05/case-study-02/02.webp', alt: 'QUESTIFY case study, part 2 of 13', width: 2880, height: 4000 },
      { src: '/projects/05/case-study-02/03.webp', alt: 'QUESTIFY case study, part 3 of 13', width: 2880, height: 4000 },
      { src: '/projects/05/case-study-02/04.webp', alt: 'QUESTIFY case study, part 4 of 13', width: 2880, height: 4000 },
      { src: '/projects/05/case-study-02/05.webp', alt: 'QUESTIFY case study, part 5 of 13', width: 2880, height: 4000 },
      { src: '/projects/05/case-study-02/06.webp', alt: 'QUESTIFY case study, part 6 of 13', width: 2880, height: 4000 },
      { src: '/projects/05/case-study-02/07.webp', alt: 'QUESTIFY case study, part 7 of 13', width: 2880, height: 4000 },
      { src: '/projects/05/case-study-02/08.webp', alt: 'QUESTIFY case study, part 8 of 13', width: 2880, height: 4000 },
      { src: '/projects/05/case-study-02/09.webp', alt: 'QUESTIFY case study, part 9 of 13', width: 2880, height: 4000 },
      { src: '/projects/05/case-study-02/10.webp', alt: 'QUESTIFY case study, part 10 of 13', width: 2880, height: 4000 },
      { src: '/projects/05/case-study-02/11.webp', alt: 'QUESTIFY case study, part 11 of 13', width: 2880, height: 4000 },
      { src: '/projects/05/case-study-02/12.webp', alt: 'QUESTIFY case study, part 12 of 13', width: 2880, height: 4000 },
      { src: '/projects/05/case-study-02/13.webp', alt: 'QUESTIFY case study, part 13 of 13', width: 2880, height: 2006 },
    ],
    status: 'live',
    role: 'UI/UX Design',
    stack: ['Figma', 'Illustrator'], 
    intro:
      'Low-fidelity and High-fidelity prototyping for a gamification app, that turns everyday tasks like studying, homework, or exercise into exciting quests.', // TODO: replace
    blocks: [
      {
        heading: 'CONCEPT', // TODO: replace
        text: 'The concept was to create a gamification app that would make everyday tasks more engaging and fun.', // TODO: replace
      },
    ],
    gallery: [], // no Challenge / Solution and no gallery for this project
  },
  {
    slug: 'project-six',
    title: '[KARL]', 
    category: '2D Design', 
    year: '2025',
    description:
      '[PLACEHOLDER] One or two lines on what the project is, who it was for and what you did.', 
    cover: '/projects/06/character-01.webp', 
    status: 'live',
    role: 'Artist, Designer',
    stack: ['Illustrator', 'InDesign'],
    intro:
      'A 2D design project for a fictional character named Karl.',
    blocks: [
    ],
    rows: [
      {
        layout: 'screens',
        media: [
          { src: '/projects/06/character-03.webp', alt: 'Character Sheet 03', width: 1440, height: 1024 },
          { src: '/projects/06/character-04.webp', alt: 'Character Sheet 04', width: 1440, height: 1024 },
          { src: '/projects/06/character-05.webp', alt: 'Character Sheet 05', width: 1440, height: 1024 },
        ],
      },
      {
        layout: 'screens',
        media: [
          { src: '/projects/06/character-02.webp', alt: 'Character Sheet 01', width: 2880, height: 4000 },
        ],
      },

    ],
    gallery: [
    ],
  },
  {
    slug: 'project-seven',
    title: '[COZY PLACE]',
    category: '2D Design, 3D Design',
    year: '2025',
    description:
      'Sketching and 3D Design Process for a Cozy Place.',
    cover: '/projects/07/roomtour-cover.webp', // first frame of the room tour
    // Room tour: upscaled from roomtour.mp4 (1920 → 2560 px, deblocked + lightly sharpened).
    // Shows the first frame; plays in a loop only while hovered (home card + project page).
    video: { mp4: '/projects/07/roomtour-hover.mp4', webm: '/projects/07/roomtour-hover.webm' },
    videoPlay: 'hover',
    // Project page: this still picture at the top instead of the looping video.
    pageCover: '/projects/07/cozynight.webp',
    videoOnPage: false,
    status: 'live',
    role: 'Artist, Designer',
    stack: ['Blender', 'InDesign'],
    intro:
      'A project to create a cozy and inviting space for me to relax and unwind.',
    blocks: [
      {
        heading: 'Concept',
        text: 'I\'ve always wanted to live or at least stay for a while in a cozy apartment with a stunning view of the New York City skyline. With nice furniture and a warm atmosphere, where I could go back to after a long day and relax.',
        media: { src: '/projects/07/sketch.webp', alt: '' }, // TODO: replace → /projects/08/block-1.jpg
      },
      {
        heading: 'Build', // TODO: replace
        text: 'The Project was built using Blender. The most challenging part was the UV unwrapping and texturing.', 
        media: { src: '/projects/07/wireframes.webp', alt: '' }, // TODO: replace → /projects/08/block-2.jpg
      },
    ],
    gallery: [
      { src: '/projects/07/cozynight.webp', alt: '' }, // TODO: replace → /projects/08/gallery-1.jpg
    ],
    rows: [
      {
        layout: 'screens',
        media: [
          { src: '/projects/07/asset1.webp', alt: 'Asset 1',  },
          { src: '/projects/07/asset2.webp', alt: 'Asset 2', },
          { src: '/projects/07/asset3.webp', alt: 'Asset 3', },
        ],
      },
      {
        layout: 'screens',
        media: [
          { src: '/projects/07/asset4.webp', alt: 'Asset 4', },
          { src: '/projects/07/asset5.webp', alt: 'Asset 5', },
          { src: '/projects/07/asset6.webp', alt: 'Asset 6', },
          { src: '/projects/07/asset7.webp', alt: 'Asset 7', },
        ],
      },
    ],
  },
  {
    slug: 'project-eight',
    title: '[LOGO DESIGN]',
    category: 'Branding, Design', 
    year: '2025',
    description:
      'A first attempt at creating a logo for a myself.',
    cover: '/projects/08/cover.png', // TODO: replace → /projects/09/cover.jpg
    // video: { mp4: '/projects/09/loop.mp4' }, // TODO: add this file (short snippet)
    // videoOnPage: false,
    // EDIT: the brand guidelines, one image per PDF page (converted from the brand guidelines PDF).
    // Shown full width at the top of the project page, like the QUESTIFY case study.
    caseStudy: [
      { src: '/projects/08/brand-guidelines/01.webp', alt: 'Brand guidelines, page 1 of 14', width: 2880, height: 2036 },
      { src: '/projects/08/brand-guidelines/02.webp', alt: 'Brand guidelines, page 2 of 14', width: 2880, height: 2036 },
      { src: '/projects/08/brand-guidelines/03.webp', alt: 'Brand guidelines, page 3 of 14', width: 2880, height: 2036 },
      { src: '/projects/08/brand-guidelines/04.webp', alt: 'Brand guidelines, page 4 of 14', width: 2880, height: 2036 },
      { src: '/projects/08/brand-guidelines/05.webp', alt: 'Brand guidelines, page 5 of 14', width: 2880, height: 2036 },
      { src: '/projects/08/brand-guidelines/06.webp', alt: 'Brand guidelines, page 6 of 14', width: 2880, height: 2036 },
      { src: '/projects/08/brand-guidelines/07.webp', alt: 'Brand guidelines, page 7 of 14', width: 2880, height: 2036 },
      { src: '/projects/08/brand-guidelines/08.webp', alt: 'Brand guidelines, page 8 of 14', width: 2880, height: 2036 },
      { src: '/projects/08/brand-guidelines/09.webp', alt: 'Brand guidelines, page 9 of 14', width: 2880, height: 2036 },
      { src: '/projects/08/brand-guidelines/10.webp', alt: 'Brand guidelines, page 10 of 14', width: 2880, height: 2036 },
      { src: '/projects/08/brand-guidelines/11.webp', alt: 'Brand guidelines, page 11 of 14', width: 2880, height: 2036 },
      { src: '/projects/08/brand-guidelines/12.webp', alt: 'Brand guidelines, page 12 of 14', width: 2880, height: 2036 },
      { src: '/projects/08/brand-guidelines/13.webp', alt: 'Brand guidelines, page 13 of 14', width: 2880, height: 2036 },
      { src: '/projects/08/brand-guidelines/14.webp', alt: 'Brand guidelines, page 14 of 14', width: 2880, height: 2036 },
    ],
    status: 'live',
    role: 'Designer',
    stack: ['Illustrator', 'Photoshop', 'InDesign'],
    intro:
      'A first attempt at creating a logo for a myself.',
    blocks: [
    ],
    gallery: [
    ],
  },
];

/** Projects with a finished case study. */
export const liveProjects = projects.filter((p) => p.status === 'live');

/** The next live project after `project` in list order, wrapping around; null if none. */
export function nextLiveProject(project: Project): Project | null {
  const start = projects.indexOf(project);
  for (let i = 1; i <= projects.length; i++) {
    const candidate = projects[(start + i) % projects.length];
    if (candidate.status === 'live' && candidate.slug !== project.slug) return candidate;
  }
  return null;
}
