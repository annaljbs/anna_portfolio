'use client';

import { useEffect, useRef, useState } from 'react';
import type { ProjectVideo as VideoSources } from '@/content/projects';
import { prefersReducedMotion } from '@/lib/gsap';

type Props = {
  video: VideoSources;
  /** Omit for a clip with no still image (it shows its first frame). */
  poster?: string;
  className?: string;
  /** Play only while the surrounding [data-media] box is hovered or focused;
   *  otherwise show the first frame. Leaving rewinds to the start. */
  hover?: boolean;
};

/**
 * Autoplaying, muted, looping preview (§3.4, charly). Plays only while near
 * the viewport (IntersectionObserver) so off-screen clips cost nothing, and
 * unmounts itself if no source can load so the poster image underneath shows.
 * Reduced motion: never plays; the poster stays.
 */
export default function ProjectVideo({ video, poster, className, hover = false }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    // The property, not the attribute, is what autoplay policies check.
    el.muted = true;

    if (hover) {
      const target = el.closest<HTMLElement>('[data-media]') ?? el.parentElement;
      if (!target) return;
      const start = () => el.play().catch(() => {});
      const stop = () => {
        el.pause();
        el.currentTime = 0;
      };
      target.addEventListener('pointerenter', start);
      target.addEventListener('pointerleave', stop);
      target.addEventListener('focusin', start);
      target.addEventListener('focusout', stop);
      return () => {
        target.removeEventListener('pointerenter', start);
        target.removeEventListener('pointerleave', stop);
        target.removeEventListener('focusin', start);
        target.removeEventListener('focusout', stop);
        el.pause();
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.pause();
    };
  }, [hover]);

  if (failed) return null;

  const fail = () => setFailed(true);
  const sources = video.webm
    ? [
        { src: video.webm, type: 'video/webm' },
        { src: video.mp4, type: 'video/mp4' },
      ]
    : [{ src: video.mp4, type: 'video/mp4' }];

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload={hover || !poster ? 'auto' : 'metadata'}
      poster={poster}
      aria-hidden="true"
      tabIndex={-1}
      onError={fail}
    >
      {sources.map((s, i) => (
        // The browser reports "no playable source" on the last <source>.
        <source key={s.src} src={s.src} type={s.type} onError={i === sources.length - 1 ? fail : undefined} />
      ))}
    </video>
  );
}
