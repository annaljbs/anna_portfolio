import { site } from '@/content/site';
import styles from './MailButton.module.css';

/**
 * Floating mail button (§2.3): fixed bottom-right, hover scales it and nudges
 * the envelope (public/images/mail.svg) up, click opens a new mail to site.email in the mail client.
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
      <span className={styles.icon} aria-hidden="true" />
    </a>
  );
}
