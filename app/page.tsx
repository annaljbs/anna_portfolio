import Hero from '@/components/Hero';
import About from '@/components/About';
import Work from '@/components/Work';
import Manifesto from '@/components/Manifesto';
import Skills from '@/components/Skills';
import QA from '@/components/QA';
import Footer from '@/components/Footer';
import ThemeController from '@/components/ThemeController';
import styles from './page.module.css';

/**
 * Home: all sections stacked. Each top-level block declares its theme with
 * data-section-theme (the hero, built earlier, uses data-theme);
 * ThemeController tweens the body background at every theme boundary and
 * flips html[data-theme] so text colours follow.
 *
 * Curtain reveal (§3.8): Q&A and the footer share one tail block. The Q&A
 * curtain is opaque and stacked above; the footer is position: sticky at the
 * bottom of the tail, so it stays pinned while Q&A scrolls up and off it.
 * The zero-height #contact anchor marks the footer's natural position for
 * the nav (a sticky box's own rect moves).
 */
export default function Home() {
  return (
    <>
      <ThemeController />
      <Hero />
      <About />
      <Work />
      <Manifesto />
      <Skills />

      <div className={styles.tail} data-section-theme="dark">
        <div className={styles.curtain} data-curtain data-theme-surface>
          <QA />
        </div>
        <div id="contact" className={styles.anchor} aria-hidden="true" />
        <Footer />
      </div>
    </>
  );
}
