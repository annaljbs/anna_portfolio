'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import styles from './ResumeModal.module.css';

type Props = {
  open: boolean;
  onClose: () => void;
  image: { src: string; alt: string; width: number; height: number };
};

/**
 * Resume viewer: a native modal <dialog> (top layer, so it sits above the
 * nav, frame and mail button) over a blurred page. The sheet stays fixed and
 * fits the window whole; scrolling keeps moving the page behind the blur.
 * Closes on the X, Escape or a click beside the sheet.
 */
export default function ResumeModal({ open, onClose, image }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialog.current;
    if (!el || !open) return;
    el.showModal();
    // Focus the dialog, not the X, so the X shows no focus ring on open.
    el.focus();
    return () => {
      if (el.open) el.close();
    };
  }, [open]);

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-label={image.alt}
      tabIndex={-1}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button type="button" className={styles.close} onClick={onClose} aria-label="Close resume">
        <Image src="/images/close.svg" alt="" width={16} height={16} unoptimized className={styles.closeIcon} />
      </button>
      <div className={styles.sheet}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(max-width: 640px) 100vw, 900px"
          quality={90}
          className={styles.image}
        />
      </div>
    </dialog>
  );
}
