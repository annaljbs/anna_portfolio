import { site } from '@/content/site';
import styles from './MailButton.module.css';

/**
 * Floating mail button (§2.3): fixed bottom-right, hover scales it and nudges
 * the envelope up, click opens a new mail to site.email in the mail client.
 * Colour comes from difference blending (see the CSS module), so it reads as
 * a black circle on light sections and white on dark ones.
 */
export default function MailButton() {
  return (
    <a
      href={`mailto:${site.email}`}
      className={styles.button}
      aria-label={`Write an email to ${site.email}`}
    >
      <span className={styles.icon} aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      </span>
    </a>
  );
}
