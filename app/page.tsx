import { site } from '@/content/site';
import styles from './page.module.css';

/**
 * TODO: replace — temporary type/scroll specimen for build step 1.
 * It exists only to exercise the fonts, colour themes, page frame, scroll
 * progress and smooth scrolling. Steps 2–5 replace these blocks with the
 * real Hero, About, Work, Skills, Q&A and Contact sections.
 */
export default function Home() {
  return (
    <>
      <section className={styles.section} data-theme="light">
        <p className="t-mono">[PLACEHOLDER] Hero — replaced in step 2</p>
        <h1 className="t-hero">
          {site.firstName}
          <br />
          {site.surname}
        </h1>
        <p className={`${styles.tagline} t-body`}>{site.tagline}</p>
        <p className={`${styles.meta} t-mono`}>
          <span>{site.location}</span>
          <span>Sep 6, 2026</span>
          <span>13:57:23</span>
        </p>
      </section>

      <section className={styles.section} data-theme="dark">
        <p className="t-mono">(02)</p>
        <h2 className="t-display">Featured Work</h2>
        <p className={`${styles.tagline} t-body-lg`}>
          [PLACEHOLDER] Project rows with enter reveals, hover video and the WIP
          state arrive in step 3.
        </p>
        <p className="t-mono">[Scroll to explore more]</p>
      </section>

      <section className={styles.section} data-theme="light">
        <p className="t-mono">(04)</p>
        <h2 className="t-display">Skills</h2>
        <p className={`${styles.tagline} t-body`}>
          [PLACEHOLDER] Interactive skills list, manifesto and Q&amp;A arrive in
          step 4.
        </p>
      </section>

      <section className={styles.section} data-theme="dark">
        <p className="t-mono">(03)</p>
        <h2 className="t-display">Get in touch</h2>
        <a className={`${styles.email} t-body-lg`} href={`mailto:${site.email}`}>
          {site.email}
        </a>
        <p className="t-mono">
          [PLACEHOLDER] Footer with the sticky reveal arrives in step 5.
        </p>
      </section>
    </>
  );
}
