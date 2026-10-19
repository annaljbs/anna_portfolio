type Props = {
  /** Embeddable player URL from toEmbedUrl(). */
  src: string;
  title: string;
  className?: string;
};

/**
 * Full YouTube/Vimeo video on the detail page (§3.9). No autoplay: the
 * visitor starts it, with sound. Fills its parent box (see .cover[data-embed]).
 */
export default function ProjectEmbed({ src, title, className }: Props) {
  return (
    <iframe
      src={src}
      title={title}
      className={className}
      loading="lazy"
      allow="fullscreen; picture-in-picture; encrypted-media"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}
