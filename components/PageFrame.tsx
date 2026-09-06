import styles from './PageFrame.module.css';

/**
 * Rounded page frame (§2.3): a fixed, click-through overlay whose large
 * solid box-shadow paints everything outside a 14px-radius rectangle inset
 * 6px from the window edge. The page scrolls underneath as normal.
 */
export default function PageFrame() {
  return <div className={styles.frame} aria-hidden="true" />;
}
