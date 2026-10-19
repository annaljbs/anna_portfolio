/**
 * Site-wide content (§4). Components read from here — nothing is hard-coded.
 * Placeholders are prefixed [PLACEHOLDER] or written in [BRACKETS] and each
 * carries a TODO so they are grep-able.
 *
 * EDIT: every text on the home page lives in this file (projects live in
 * content/projects.ts). Change the text between the quotes and save — the
 * dev server updates the page instantly. Rules of thumb:
 *  - Keep the quotes and the comma at the end of each line.
 *  - Text in '…' may not contain a plain ' — use ’ instead (as in "I’m"),
 *    or wrap the text in "…" instead.
 *  - Lists in [ … ] can grow or shrink: add or delete whole items.
 *  - '' (empty quotes) hides a line where noted.
 * See SITE-GUIDE.md for a section-by-section walkthrough.
 */
export const site = {
  // EDIT: your name. firstName + surname are the two big lines in the hero;
  // name is used in the menu bar, browser tab title and footer.
  firstName: 'Anna',
  surname: 'Ljubas', 
  name: 'Anna Ljubas', 
  // EDIT: short line under the hero name and the Google/browser description. '' hides it.
  tagline:
    '', // TODO: replace
  // EDIT: shown in the hero meta row next to the date and live clock.
  location: 'Gunskirchen, Austria', 
  // EDIT: time zone of the live clocks (hero + footer), e.g. 'Europe/Berlin'.
  timezone: 'Europe/Vienna',
  // EDIT: used by the menu, the floating mail button and the big footer link.
  email: 'ljubas.anna@hotmail.com', 
  initials: 'AL',
  /** Hero status pill (russellnumo). Set to '' to hide it. */
  // EDIT: e.g. 'Ready for work', 'Open for internships', or '' to hide.
  status: 'Ready for work', 
  /** Hero portrait, 3:4. */
  // EDIT: put the picture in public/images/ and write its path without 'public'.
  // Upright 3:4 crop, about 1200 × 1600 px, .webp or .jpg.
  portrait: '/images/portrait.webp',
  /** Menu links in the order the brief lists them; hrefs are section ids. */
  // EDIT: label = text in the menu. Reorder or delete whole lines; keep the hrefs
  // (#about, #work, #skills, #qa, #contact) — they point at the sections.
  nav: [
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#work' },
    { label: 'Skills', href: '#skills' },
    { label: 'Q&A', href: '#qa' },
    { label: 'Contact', href: '#contact' },
  ],
  /** (01) About — §3.3 */
  // EDIT: number = the small (01) label, title = big heading.
  // lead = the bold paragraphs; \n\n starts a new paragraph.
  // roles = words in the scrolling band under the text; add or remove items.
  about: {
    number: '01',
    title: 'About',
    lead: 'Hi, I am Anna and currently I’m a Media Technology and Design student with a slightly unconventional background.\n\nStarting my degree at 29 gave me a unique edge: the work ethic of a former CNC programmer and designer combined with a massive appetite for visual media.\n\nI am incredibly driven to learn from people outside the university bubble. My sights are set on the filmmaking and graphics sectors. Whether it requires filming, color grading, 3D design, motion graphics, VFX, or CGI. I want to be where the action is. I believe the best possible payment is a heavy dose of reality. \n\n I am looking for a studio that will throw me into the mix, let me click until my hands cramp on real projects, and teach me everything they know. I want to work and I want to push my limits to build something great.',
    roles: ['Student', 'Maker', 'Video Editor', 'Creative', 'Developer', 'Designer'], // TODO: replace
  },
  /** (02) Featured Work — §3.4 */
  // EDIT: section heading texts only. The projects themselves are in content/projects.ts.
  // hint = small text right of the title, viewLabel = link under each project,
  // wipLabel / wipPill = texts shown on projects with status 'wip'.
  work: {
    number: '02',
    title: 'Featured Work',
    hint: '[Scroll to explore more]',
    viewLabel: 'View Project',
    wipLabel: 'Case study coming soon',
    wipPill: 'In progress',
  },
  /** Manifesto pull-quote — §3.5 */
  // EDIT: the big centred quote between Work and Skills. One or two sentences read best.
  manifesto: {
    quote:
      'I don’t care if I’m running errands on set, organizing project files, or actively animating, filming, or editing. I just want to be in the room where the real work happens.', // TODO: replace
  },
  /** (04) Skills — §3.6. Hints alternate per row; the arrow always points at the marker. */
  // EDIT: groups = the clickable rows. name = row title, items = what opens below it.
  // Add a row by copying a whole { name: …, items: [ … ] }, line; delete one by removing its line.
  skills: {
    number: '03',
    title: 'Skills',
    hints: { before: 'click me →', after: '← click me' },
    groups: [
      { name: 'Development', items: ['React / Next.js', 'TypeScript', 'GSAP', 'CSS', 'Vue'] },
      { name: 'Design', items: ['Figma', 'Illustrator', 'Photoshop'] },
      { name: '3D & Motion', items: ['Blender', 'After Effects', 'Adobe Animate'] },
      { name: 'Video', items: ['Premiere Pro', 'DaVinci Resolve'] },
    ], 
  },
  /** (05) Q&A — §3.7 */
  // EDIT: items = the accordion. q = question, a = answer. Add, remove or reorder
  // whole { q, a } blocks. A question containing ' must use "…" quotes (see below).
  qa: {
    number: '04',
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
  // EDIT: lead = small line above the big title, title = 'Get in touch',
  // copied = text shown after clicking the email, phone = '' hides it,
  // credit = text before your name in the bottom bar.
  // socials = bottom-bar links: label + full https:// address; add or delete lines.
  contact: {
    number: '05',
    lead: "Want to get to know me better? Don't hesitate to reach out!",
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
  // EDIT: fixed labels on every project page (back link, next link, headings,
  // meta row titles, and the banner on 'wip' projects).
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
