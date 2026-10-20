'use client';

import { useEffect, useState } from 'react';
import { useLenis } from 'lenis/react';
import { prefersReducedMotion } from '@/lib/gsap';
import styles from './BackToTop.module.css';

// EDIT: seconds the smooth scroll back to the top takes.
const SCROLL_SECONDS = 1.4;

/**
 * Back-to-top button (home page): a round button stacked above the mail
 * button with the hand-drawn arrow (public/images/arrow_drawn.svg). It fades
 * in once the bottom of the About section reaches the bottom of the window
 * and stays until the end of the footer; clicking it scrolls to the top,
 * where it fades out again. Same difference blending as the mail button, so
 * it reads on light and dark sections. Reduced motion: jumps instantly.
 */
export default function BackToTop() {
  const lenis = useLenis();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const about = document.getElementById('about');
    if (!about) return;
    const update = () => setVisible(about.getBoundingClientRect().bottom <= window.innerHeight);
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  function toTop() {
    const immediate = prefersReducedMotion();
    if (lenis) {
      lenis.scrollTo(0, { duration: SCROLL_SECONDS, immediate, force: true });
    } else {
      window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
    }
  }

  return (
    <button
      type="button"
      className={styles.button}
      data-visible={visible || undefined}
      onClick={toTop}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <span className={styles.arrow} aria-hidden="true" />
    </button>
  );
}
