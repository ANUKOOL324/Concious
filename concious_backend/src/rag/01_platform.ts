export type PlatformType =
  | "youtube"
  | "spotify"
  | "twitter"
  | "article"
  | "pdf"
  | "other";

const KNOWN_PLATFORMS = new Set<PlatformType>([
  "youtube",
  "spotify",
  "twitter",
  "article",
  "pdf",
  "other",
]);

export function getHostname(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function normalizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return null;
  }
}

export function detectPlatform(content: {
  type?: string | null | undefined;
  link?: string | null | undefined;
}): PlatformType {
  const contentType = content.type?.toLowerCase().trim();

  if (contentType && KNOWN_PLATFORMS.has(contentType as PlatformType)) {
    return contentType as PlatformType;
  }

  const link = content.link?.trim();
  if (!link) {
    return "other";
  }

  const hostname = getHostname(link);
  if (!hostname) {
    return "other";
  }

  if (hostname === "youtu.be" || hostname.endsWith("youtube.com")) {
    return "youtube";
  }

  if (hostname.endsWith("spotify.com") || hostname === "open.spotify.com") {
    return "spotify";
  }

  if (hostname === "twitter.com" || hostname === "x.com" || hostname === "mobile.twitter.com") {
    return "twitter";
  }

  if (link.toLowerCase().includes(".pdf")) {
    return "pdf";
  }

  return "article";
}
