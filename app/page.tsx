import Hero from '@/components/Hero';
import About from '@/components/About';
import Work from '@/components/Work';
import Manifesto from '@/components/Manifesto';
import Skills from '@/components/Skills';
import QA from '@/components/QA';
import ThemeController from '@/components/ThemeController';
import styles from './page.module.css';

/**
 * Home: all sections stacked. Each top-level section declares its theme
 * with data-section-theme (the hero, built earlier, uses data-theme);
 * ThemeController tweens the body background at every theme boundary and
 * flips html[data-theme] so text colours follow.
 * Hero, About, Work, Manifesto, Skills and Q&A are real (steps 2–4); the
 * Contact stub gives its nav anchor a target until step 5 replaces it.
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
      <QA />

      {/* TODO: replace — section stub, see step 5 of the brief. */}
      <section id="contact" className={styles.stub} data-section-theme="dark">
        <p className="t-mono">(03) Contact — step 5</p>
      </section>
    </>
  );
}
