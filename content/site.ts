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
  portrait: '/placeholders/portrait.svg', // TODO: replace with /images/portrait.webp
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
} as const;

export type Site = typeof site;
