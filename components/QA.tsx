'use client';

import { useRef, useState } from 'react';
import { site } from '@/content/site';
import { useSectionReveal } from './useSectionReveal';
import { useExpandable } from './useExpandable';
import styles from './QA.module.css';

type Item = (typeof site.qa.items)[number];

/**
 * (05) Q&A (§3.7, billchien): accordion of questions. Closed: question with a
 * + on the right. Open: the + rotates 45° into ×, the answer expands with a
 * height-auto tween and fades in. One open at a time; dividers draw in on
 * scroll. Content lives in site.ts.
 */
export default function QA() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  useSectionReveal(root);

  return (
    <section ref={root} id="qa" className={styles.qa} data-section-theme="dark">
      <header className={styles.head}>
        <span className={`${styles.number} t-mono`} data-reveal>
          ({site.qa.number})
        </span>
        <h2 className="t-display" data-reveal>
          {site.qa.title}
        </h2>
      </header>

      <ul className={styles.list}>
        {site.qa.items.map((item, i) => (
          <QAItem
            key={item.q}
            index={i}
            item={item}
            open={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
          />
        ))}
      </ul>
      <span className={styles.rule} data-rule aria-hidden="true" />
    </section>
  );
}

type ItemProps = {
  index: number;
  item: Item;
  open: boolean;
  onToggle: () => void;
};

function QAItem({ index, item, open, onToggle }: ItemProps) {
  const panel = useRef<HTMLDivElement>(null);
  useExpandable(panel, open);
  const id = `qa-panel-${index}`;

  return (
    <li className={styles.item} data-open={open || undefined}>
      <span className={styles.rule} data-rule aria-hidden="true" />
      <h3 className={styles.question}>
        <button type="button" className={styles.toggle} aria-expanded={open} aria-controls={id} onClick={onToggle}>
          <span>{item.q}</span>
          <span className={styles.icon} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </h3>
      <div id={id} ref={panel} className={styles.panel} role="region" aria-hidden={!open}>
        <p className={`${styles.answer} t-body`} data-stagger>
          {item.a}
        </p>
      </div>
    </li>
  );
}
