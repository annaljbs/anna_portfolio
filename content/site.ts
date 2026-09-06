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
} as const;

export type Site = typeof site;
