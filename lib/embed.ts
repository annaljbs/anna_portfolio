/**
 * Turns a YouTube or Vimeo page link into its embeddable player URL.
 * Accepts youtube.com/watch?v=…, youtu.be/…, youtube.com/shorts/… and
 * vimeo.com/<id>. Anything else (search pages, playlists, typos) → null,
 * so the caller can fall back to the cover image.
 */
export function toEmbedUrl(link: string | undefined): string | null {
  if (!link) return null;
  let url: URL;
  try {
    url = new URL(link);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.)/, '');
  const id = (value: string | null | undefined) =>
    value && /^[\w-]+$/.test(value) ? value : null;

  if (host === 'youtube.com') {
    const yt =
      url.pathname === '/watch'
        ? id(url.searchParams.get('v'))
        : id(url.pathname.match(/^\/shorts\/([^/]+)/)?.[1]);
    return yt ? `https://www.youtube-nocookie.com/embed/${yt}?rel=0` : null;
  }
  if (host === 'youtu.be') {
    const yt = id(url.pathname.slice(1));
    return yt ? `https://www.youtube-nocookie.com/embed/${yt}?rel=0` : null;
  }
  if (host === 'vimeo.com') {
    const vm = url.pathname.match(/^\/(\d+)/)?.[1];
    return vm ? `https://player.vimeo.com/video/${vm}` : null;
  }
  return null;
}
