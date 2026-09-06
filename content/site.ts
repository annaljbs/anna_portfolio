/**
 * Site-wide content (§4). Components read from here — nothing is hard-coded.
 * Placeholders are prefixed [PLACEHOLDER] or written in [BRACKETS] and each
 * carries a TODO so they are grep-able.
 */
export const site = {
  firstName: 'Anna',
  surname: 'Ljubas', // TODO: replace
  name: 'Anna Ljubas', // TODO: replace with full name once surname is set
  tagline:
    '[PLACEHOLDER] Web developer & designer building interfaces that are fast, clear and a little playful.', // TODO: replace
  location: 'Gunskirchen, Austria', // TODO: replace
  timezone: 'Europe/Vienna',
  email: 'ljubas.anna@hotmail.com', // TODO: replace
  initials: 'AL',
  /** Hero status pill (russellnumo). Set to '' to hide it. */
  status: 'Open to work', // TODO: replace
  /** Hero portrait, 3:4. */
  portrait: '/images/portrait.webp',
  /** Menu links in the order the brief lists them; hrefs are section ids. */
  nav: [
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#work' },
    { label: 'Contact', href: '#contact' },
    { label: 'Skills', href: '#skills' },
    { label: 'Q&A', href: '#qa' },
  ],
  /** (01) About — §3.3 */
  about: {
    number: '01',
    title: 'About',
    lead: '[PLACEHOLDER] I am a web developer and designer who likes building interfaces that feel fast, read clearly and have a little personality.', // TODO: replace
    body: '[PLACEHOLDER] Second paragraph: background, what you are studying or working on, and what you are looking for next.', // TODO: replace
    roles: ['3D Designer', 'Video Editor', 'Creative'], // TODO: replace
  },
  /** (02) Featured Work — §3.4 */
  work: {
    number: '02',
    title: 'Featured Work',
    hint: '[Scroll to explore more]',
    viewLabel: 'View Project',
    wipLabel: 'Case study coming soon',
    wipPill: 'In progress',
  },
  /** Manifesto pull-quote — §3.5 */
  manifesto: {
    quote:
      '[PLACEHOLDER] I build things for the web that feel considered: fast to load, clear to read and a little playful to use, because the details are what people remember.', // TODO: replace
  },
  /** (04) Skills — §3.6. Hints alternate per row; the arrow always points at the marker. */
  skills: {
    number: '04',
    title: 'Skills',
    hints: { before: 'click me →', after: '← click me' },
    groups: [
      { name: 'Frontend', items: ['React / Next.js', 'TypeScript', 'GSAP', 'CSS', 'Vue'] },
      { name: 'Design', items: ['Figma', 'UI/UX', 'Prototyping'] },
      { name: '3D & Motion', items: ['Blender', 'Grease Pencil', 'Adobe Animate'] },
      { name: 'Tooling', items: ['Docker', 'Git', 'Laravel'] },
    ], // TODO: replace
  },
  /** (05) Q&A — §3.7 */
  qa: {
    number: '05',
    title: 'Q&A',
    items: [
      {
        q: 'What kind of projects do you enjoy most?',
        a: '[PLACEHOLDER] Two or three sentences. Keep the voice conversational; this is the one section that sounds like you talking.', // TODO: replace
      },
      {
        q: "What do you do when you're not coding?",
        a: '[PLACEHOLDER] Two or three sentences about life outside the editor.', // TODO: replace
      },
      {
        q: 'What are you learning right now?',
        a: '[PLACEHOLDER] Two or three sentences on current study or experiments.', // TODO: replace
      },
      {
        q: "What's your favourite tool?",
        a: '[PLACEHOLDER] Two or three sentences, and why.', // TODO: replace
      },
      {
        q: 'How do you approach a new project?',
        a: '[PLACEHOLDER] Two or three sentences on process: questions first, then sketches, then code.', // TODO: replace
      },
    ],
  },
  /** (03) Contact / footer — §3.8 */
  contact: {
    number: '06',
    lead: "For enquiries, collaboration requests or job opportunities, don't hesitate to reach out!",
    title: 'Get in touch',
    copied: 'Email copied',
    phone: '', // TODO: replace, or '' to hide the phone line
    timeLabel: 'Local time',
    credit: 'Designed & Developed by',
    socials: [
      { label: 'WhatsApp', href: 'https://wa.me/' }, // TODO: replace with https://wa.me/<number>
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/anna-ljubas' }, // TODO: replace
      { label: 'Instagram', href: 'https://www.instagram.com/annaljbs' }, // TODO: replace
      { label: 'GitHub', href: 'https://github.com/annaljbs' }, // TODO: replace
    ],
  },
  /** /work/[slug] detail pages — §3.9 */
  project: {
    back: 'Back to work',
    next: 'Next project',
    challenge: 'Challenge',
    solution: 'Solution',
    meta: { category: 'Category', year: 'Year', role: 'Role', stack: 'Stack' },
    wipBanner: 'This case study is still being written. The layout below is a placeholder.',
  },
} as const;


export type Site = typeof site;
