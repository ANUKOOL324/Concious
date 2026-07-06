export const SPOTIFY_EMBED_HEIGHT = 152;

export function Spotifydrag() {
  const embedSrc =
    "https://open.spotify.com/embed/album/20lOt6G8MHv8ZO7ViOmiP7?utm_source=generator&theme=1";

  return (
    <iframe
      src={embedSrc}
      title="Spotify focus track"
      width="100%"
      height={SPOTIFY_EMBED_HEIGHT}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="eager"
      className="block w-full max-w-full shrink-0 rounded-xl border-0"
      style={{
        height: SPOTIFY_EMBED_HEIGHT,
        minHeight: SPOTIFY_EMBED_HEIGHT,
      }}
    />
  );
}
