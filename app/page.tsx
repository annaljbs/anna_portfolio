import Hero from '@/components/Hero';
import About from '@/components/About';
import Work from '@/components/Work';
import ThemeController from '@/components/ThemeController';
import styles from './page.module.css';

/**
 * Home: all sections stacked. Each top-level section declares its theme
 * with data-section-theme (the hero, built earlier, uses data-theme);
 * ThemeController tweens the body background at every theme boundary and
 * flips html[data-theme] so text colours follow.
 * Hero, About and Work are real (steps 2–3); the stubs below give
 * the nav anchors a target until steps 4–5 replace them.
 */
export default function Home() {
  return (
    <>
      <ThemeController />
      <Hero />
      <About />
      <Work />

      {/* TODO: replace — section stubs, see steps 4–5 of the brief. */}
      <section id="skills" className={styles.stub} data-section-theme="light">
        <p className="t-mono">(04) Skills — step 4</p>
      </section>
      <section id="qa" className={styles.stub} data-section-theme="dark">
        <p className="t-mono">(05) Q&amp;A — step 4</p>
      </section>
      <section id="contact" className={styles.stub} data-section-theme="dark">
        <p className="t-mono">(03) Contact — step 5</p>
      </section>
    </>
  );
}
