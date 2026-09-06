'use client';

import { useEffect, useRef, useState } from 'react';
import type { ProjectVideo as VideoSources } from '@/content/projects';
import { prefersReducedMotion } from '@/lib/gsap';

type Props = {
  video: VideoSources;
  poster: string;
  className?: string;
};

/**
 * Autoplaying, muted, looping preview (§3.4, charly). Plays only while near
 * the viewport (IntersectionObserver) so off-screen clips cost nothing, and
 * unmounts itself if no source can load so the poster image underneath shows.
 * Reduced motion: never plays; the poster stays.
 */
export default function ProjectVideo({ video, poster, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    // The property, not the attribute, is what autoplay policies check.
    el.muted = true;
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
  }, []);

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
      preload="metadata"
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
