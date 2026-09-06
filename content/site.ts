/**
 * Site-wide content (§4). Components read from here — nothing is hard-coded.
 * Placeholders are prefixed [PLACEHOLDER] or written in [BRACKETS] and each
 * carries a TODO so they are grep-able.
 */
export const site = {
  firstName: 'Anna',
  surname: '[SURNAME]', // TODO: replace
  name: 'Anna', // TODO: replace with full name once surname is set
  tagline:
    '[PLACEHOLDER] Web developer & designer building interfaces that are fast, clear and a little playful.', // TODO: replace
  location: '[CITY, COUNTRY]', // TODO: replace
  timezone: 'Europe/Vienna',
  email: 'hello@example.com', // TODO: replace
} as const;

export type Site = typeof site;
