'use client';

import { useEffect, useRef, useState } from 'react';
import { site } from '@/content/site';
import styles from './MailButton.module.css';

const COPIED_MS = 1600;

/**
 * Floating mail button (§2.3): fixed bottom-right, hover scales it and nudges
 * the envelope up, click copies the email and briefly shows "Copied".
 * Falls back to a mailto: link when the clipboard API is unavailable.
 * Colour comes from difference blending (see the CSS module), so it reads as
 * a black circle on light sections and white on dark ones.
 */
export default function MailButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), COPIED_MS);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  }

  return (
    <button
      type="button"
      className={styles.button}
      data-copied={copied ? '' : undefined}
      onClick={handleClick}
      aria-label={`Copy email address ${site.email}`}
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
      <span className={`${styles.label} t-mono t-mono-sm`} aria-hidden="true">
        Copied
      </span>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? 'Email copied' : ''}
      </span>
    </button>
  );
}
