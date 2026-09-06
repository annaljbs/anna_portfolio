'use client';

import { useRef, useState } from 'react';
import { site } from '@/content/site';
import { useSectionReveal } from './useSectionReveal';
import { useExpandable } from './useExpandable';
import styles from './Skills.module.css';

type Group = (typeof site.skills.groups)[number];

const HOVER_QUERY = '(hover: hover) and (pointer: fine)';

/**
 * (04) Skills (§3.6, russellnumo "Services"): one row per skill group with a
 * ( ) marker and an alternating "click me" hint. Click (or hover with a
 * fine pointer) opens a row — the marker becomes (●), the hint fades and the
 * sub-skills expand with a height-auto tween and staggered fade. One row
 * open at a time; dividers draw in on scroll.
 */
export default function Skills() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  useSectionReveal(root);

  return (
    <section ref={root} id="skills" className={styles.skills} data-section-theme="light">
      <header className={styles.head}>
        <span className={`${styles.number} t-mono`} data-reveal>
          ({site.skills.number})
        </span>
        <h2 className="t-display" data-reveal>
          {site.skills.title}
        </h2>
      </header>

      <ul className={styles.list}>
        {site.skills.groups.map((group, i) => (
          <SkillRow
            key={group.name}
            index={i}
            group={group}
            open={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
            onOpen={() => setOpen(i)}
          />
        ))}
      </ul>
      <span className={styles.rule} data-rule aria-hidden="true" />
    </section>
  );
}

type RowProps = {
  index: number;
  group: Group;
  open: boolean;
  onToggle: () => void;
  onOpen: () => void;
};

function SkillRow({ index, group, open, onToggle, onOpen }: RowProps) {
  const panel = useRef<HTMLDivElement>(null);
  useExpandable(panel, open);
  const id = `skills-panel-${index}`;
  // Even rows: "click me →" before the marker; odd rows: marker, then "← click me".
  const hintBefore = index % 2 === 0;

  function hover() {
    if (window.matchMedia(HOVER_QUERY).matches) onOpen();
  }

  return (
    <li className={styles.row} data-open={open || undefined}>
      <span className={styles.rule} data-rule aria-hidden="true" />
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
        onMouseEnter={hover}
      >
        <span className={styles.name}>{group.name}</span>
        <span className={styles.control}>
          {hintBefore && <span className={`${styles.hint} t-mono`}>{site.skills.hints.before}</span>}
          <span className={`${styles.marker} t-mono`} aria-hidden="true">
            {open ? '(●)' : '( )'}
          </span>
          {!hintBefore && <span className={`${styles.hint} t-mono`}>{site.skills.hints.after}</span>}
        </span>
      </button>
      <div id={id} ref={panel} className={styles.panel} role="region" aria-label={group.name} aria-hidden={!open}>
        <ul className={styles.items}>
          {group.items.map((item) => (
            <li key={item} className={styles.item} data-stagger>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
