import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import styles from './page.module.css';

/**
 * Home: all sections stacked. Hero + name marquee are real (build step 2);
 * the stubs below only give the nav anchors a target and the page some
 * length until steps 3–5 replace them.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />

      {/* TODO: replace — section stubs, see steps 3–5 of the brief. */}
      <section id="about" className={styles.stub} data-theme="light">
        <p className="t-mono">(01) About — step 3</p>
      </section>
      <section id="work" className={styles.stub} data-theme="dark">
        <p className="t-mono">(02) Featured Work — step 3</p>
      </section>
      <section id="skills" className={styles.stub} data-theme="light">
        <p className="t-mono">(04) Skills — step 4</p>
      </section>
      <section id="qa" className={styles.stub} data-theme="dark">
        <p className="t-mono">(05) Q&amp;A — step 4</p>
      </section>
      <section id="contact" className={styles.stub} data-theme="dark">
        <p className="t-mono">(03) Contact — step 5</p>
      </section>
    </>
  );
}
