/**
 * Featured work (§3.4) and its detail pages (§3.9). Rows render in this
 * order. `status: 'wip'` rows show the in-progress state on the home page
 * (grayscale cover, no video, no link) and an "In progress" banner with
 * placeholder blocks on their detail page. Media boxes use object-fit:
 * cover, so any cover/clip size works. Placeholders carry a TODO.
 */
export type ProjectStatus = 'live' | 'wip';

export type ProjectVideo = {
  mp4: string;
  webm?: string;
};

export type ProjectMedia = {
  src: string;
  alt: string;
};

export type ProjectBlock = {
  heading: string;
  text: string;
  media: ProjectMedia;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  /** Poster / static cover (home row and detail hero). */
  cover: string;
  /** Autoplaying muted preview; omit for a static cover. */
  video?: ProjectVideo;
  status: ProjectStatus;
  /* Detail page (§3.9) */
  role: string;
  stack: string[];
  intro: string;
  blocks: ProjectBlock[];
  challenge: string;
  solution: string;
  gallery: ProjectMedia[];
};

const placeholder = (n: 1 | 2 | 3): ProjectMedia => ({ src: `/placeholders/media-${n}.svg`, alt: '' }); // TODO: replace

const placeholderBlocks: ProjectBlock[] = [
  {
    heading: '[PLACEHOLDER] Concept', // TODO: replace
    text: '[PLACEHOLDER] A short paragraph on the idea and the first decisions: what the piece had to do and what it deliberately left out.', // TODO: replace
    media: placeholder(1),
  },
  {
    heading: '[PLACEHOLDER] Build', // TODO: replace
    text: '[PLACEHOLDER] A short paragraph on how it was made: tools, the tricky part, and what you would do differently.', // TODO: replace
    media: placeholder(2),
  },
];

const placeholderDetail = {
  role: '[PLACEHOLDER] Design & development', // TODO: replace
  stack: ['Next.js', 'GSAP', 'Blender'], // TODO: replace
  intro:
    '[PLACEHOLDER] One paragraph that sets the project up: who it was for, what the brief asked, and the constraint that shaped it.', // TODO: replace
  blocks: placeholderBlocks,
  challenge:
    '[PLACEHOLDER] What made this hard: the audience, the timeline, the technology, or the thing nobody had done before.', // TODO: replace
  solution:
    '[PLACEHOLDER] What you did about it, and the outcome in one or two concrete sentences.', // TODO: replace
  gallery: [placeholder(3), placeholder(1), placeholder(2)],
};

export const projects: Project[] = [
  {
    slug: 'project-one',
    title: '[PLACEHOLDER] Project One', // TODO: replace
    category: '[PLACEHOLDER] Web design & development', // TODO: replace
    year: '2026',
    description:
      '[PLACEHOLDER] One or two lines on what the project is, who it was for and what you did.', // TODO: replace
    cover: '/projects/project1.jpeg',
    video: { mp4: '/projects/project1.mp4' },
    status: 'live',
    ...placeholderDetail,
    blocks: [
      { ...placeholderBlocks[0], media: { src: '/projects/project1.jpeg', alt: '' } },
      placeholderBlocks[1],
    ],
  },
  {
    slug: 'project-two',
    title: '[PLACEHOLDER] Project Two', // TODO: replace
    category: '[PLACEHOLDER] Interactive experience', // TODO: replace
    year: '2025',
    description:
      '[PLACEHOLDER] One or two lines on what the project is, who it was for and what you did.', // TODO: replace
    cover: '/projects/project2.jpeg',
    video: { mp4: '/projects/project2.mp4' },
    status: 'live',
    ...placeholderDetail,
    blocks: [
      { ...placeholderBlocks[0], media: { src: '/projects/project2.jpeg', alt: '' } },
      placeholderBlocks[1],
    ],
  },
  {
    slug: 'project-three',
    title: '[PLACEHOLDER] Project Three', // TODO: replace
    category: '[PLACEHOLDER] Motion & 3D', // TODO: replace
    year: '2026',
    description:
      '[PLACEHOLDER] Work in progress — a short teaser line about what is coming.', // TODO: replace
    cover: '/placeholders/project-3.svg', // TODO: replace
    status: 'wip',
    ...placeholderDetail,
  },
  {
    slug: 'project-four',
    title: '[PLACEHOLDER] Project Four', // TODO: replace
    category: '[PLACEHOLDER] Brand & UI', // TODO: replace
    year: '2026',
    description:
      '[PLACEHOLDER] Work in progress — a short teaser line about what is coming.', // TODO: replace
    cover: '/placeholders/project-4.svg', // TODO: replace
    status: 'wip',
    ...placeholderDetail,
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
