'use client';

import { useSyncExternalStore } from 'react';
import { site } from '@/content/site';

/** Flip to true for a 12-hour clock (1:57:23 PM) instead of 13:57:23. */
const HOUR_12 = false;

const timeFormat = new Intl.DateTimeFormat(HOUR_12 ? 'en-US' : 'en-GB', {
  timeZone: site.timezone,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: HOUR_12,
});

const dateFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: site.timezone,
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

// A one-second ticker as an external store: the server snapshot is null, so
// SSR and hydration render blank cells and the client fills them right after.
function subscribe(onTick: () => void) {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
}
const getSeconds = () => Math.floor(Date.now() / 1000);
const getServerSeconds = () => null;

type Props = {
  cellClassName?: string;
  /** Which cells to render; the hero shows both, the footer echoes the time. */
  show?: 'both' | 'date' | 'time';
};

/**
 * Date ("Sep 6, 2026") and live time ("13:57:23") in the owner's timezone
 * (§3.2). Client-only values, so server and client markup match.
 */
export default function Clock({ cellClassName, show = 'both' }: Props) {
  const seconds = useSyncExternalStore(subscribe, getSeconds, getServerSeconds);
  const now = seconds === null ? null : new Date(seconds * 1000);

  return (
    <>
      {show !== 'time' && (
        <span className={cellClassName} data-clock="date">
          {now ? dateFormat.format(now) : ' '}
        </span>
      )}
      {show !== 'date' && (
        <span className={cellClassName} data-clock="time">
          {now ? timeFormat.format(now) : ' '}
        </span>
      )}
    </>
  );
}
