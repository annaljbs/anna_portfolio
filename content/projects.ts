/**
 * Featured work (§3.4). Rows render in this order. `status: 'wip'` rows get
 * the in-progress state: grayscale static cover, no video, no detail link.
 * Media boxes are 16:10 with object-fit: cover, so any cover/clip size works.
 * Placeholders carry a TODO so they are grep-able.
 */
export type ProjectStatus = 'live' | 'wip';

export type ProjectVideo = {
  mp4: string;
  webm?: string;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  /** Poster / static cover. */
  cover: string;
  /** Autoplaying muted preview; omit for a static cover. */
  video?: ProjectVideo;
  status: ProjectStatus;
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
  },
];

/** Projects with a detail page (used for "Next project" links in step 6). */
export const liveProjects = projects.filter((p) => p.status === 'live');
