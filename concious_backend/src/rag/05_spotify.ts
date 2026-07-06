import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} from "../config.js";
import { normalizeUrl } from "./01_platform.js";

export type SpotifyResourceType =
  | "track"
  | "album"
  | "playlist"
  | "artist"
  | "episode"
  | "show"
  | "unknown";

const SPOTIFY_RESOURCE_TYPES = new Set<SpotifyResourceType>([
  "track",
  "album",
  "playlist",
  "artist",
  "episode",
  "show",
]);

export interface ParsedSpotifyUrl {
  spotifyType: SpotifyResourceType;
  spotifyId?: string;
  normalizedUrl: string;
}

export interface SpotifyMetadataFields {
  spotifyType: SpotifyResourceType;
  spotifyId?: string | undefined;
  title?: string | undefined;
  artist?: string | undefined;
  album?: string | undefined;
  description?: string | undefined;
  image?: string | undefined;
  provider?: string | undefined;
}

type SpotifyOEmbedResponse = {
  title?: string;
  thumbnail_url?: string;
  provider_name?: string;
  author_name?: string;
};

type SpotifyTokenCache = {
  token: string;
  expiresAt: number;
};

let spotifyTokenCache: SpotifyTokenCache | null = null;

// open.spotify.com/{type}/{id}
export function parseSpotifyUrl(url: string): ParsedSpotifyUrl | null {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");

    if (!host.endsWith("spotify.com")) {
      return null;
    }

    const parts = parsed.pathname.split("/").filter(Boolean);
    const resourceType = parts[0]?.toLowerCase();
    const resourceId = parts[1]?.split("?")[0];

    const spotifyType = SPOTIFY_RESOURCE_TYPES.has(resourceType as SpotifyResourceType)
      ? (resourceType as SpotifyResourceType)
      : "unknown";

    const normalized = normalizeUrl(url.trim()) ?? `${parsed.origin}${parsed.pathname}`;
    const result: ParsedSpotifyUrl = {
      spotifyType,
      normalizedUrl: normalized,
    };

    if (resourceId) {
      result.spotifyId = resourceId;
    }

    return result;
  } catch {
    return null;
  }
}

async function fetchJsonWithTimeout(
  url: string,
  init?: RequestInit,
  timeoutMs = 5000
): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as unknown;
    if (!payload || typeof payload !== "object") {
      return null;
    }

    return payload as Record<string, unknown>;
  } catch (error) {
    console.warn(`Spotify metadata fetch failed for ${url}:`, error);
    return null;
  }
}

async function fetchSpotifyOEmbed(url: string): Promise<SpotifyMetadataFields | null> {
  const oEmbedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`;
  const payload = (await fetchJsonWithTimeout(oEmbedUrl)) as SpotifyOEmbedResponse | null;

  if (!payload) {
    return null;
  }

  const parsed = parseSpotifyUrl(url);
  const fields: SpotifyMetadataFields = {
    spotifyType: parsed?.spotifyType ?? "unknown",
    provider: payload.provider_name || "Spotify",
  };

  if (parsed?.spotifyId) fields.spotifyId = parsed.spotifyId;
  if (payload.title) fields.title = payload.title;
  if (payload.author_name) fields.artist = payload.author_name;
  if (payload.thumbnail_url) fields.image = payload.thumbnail_url;

  return fields;
}

async function getSpotifyAccessToken(): Promise<string | null> {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    return null;
  }

  if (spotifyTokenCache && Date.now() < spotifyTokenCache.expiresAt) {
    return spotifyTokenCache.token;
  }

  try {
    const credentials = Buffer.from(
      `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
    ).toString("base64");

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      access_token?: string;
      expires_in?: number;
    };

    if (!payload.access_token) {
      return null;
    }

    const expiresInMs = (payload.expires_in ?? 3600) * 1000;
    spotifyTokenCache = {
      token: payload.access_token,
      expiresAt: Date.now() + expiresInMs - 60_000,
    };

    return payload.access_token;
  } catch (error) {
    console.warn("Spotify token fetch failed:", error);
    return null;
  }
}

function joinArtists(value: unknown): string | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const names = value
    .map((artist) => {
      if (artist && typeof artist === "object" && "name" in artist) {
        return typeof artist.name === "string" ? artist.name : "";
      }
      return "";
    })
    .filter(Boolean);

  return names.length > 0 ? names.join(", ") : undefined;
}

function mapSpotifyApiPayload(
  parsed: ParsedSpotifyUrl,
  payload: Record<string, unknown>
): SpotifyMetadataFields {
  const fields: SpotifyMetadataFields = {
    spotifyType: parsed.spotifyType,
    provider: "spotify-web-api",
  };

  if (parsed.spotifyId) {
    fields.spotifyId = parsed.spotifyId;
  }

  if (typeof payload.name === "string") {
    fields.title = payload.name;
  }

  if (typeof payload.description === "string" && payload.description.trim()) {
    fields.description = payload.description.trim();
  }

  const artists = joinArtists(payload.artists);
  if (artists) {
    fields.artist = artists;
  }

  if (payload.album && typeof payload.album === "object" && "name" in payload.album) {
    const albumName = payload.album.name;
    if (typeof albumName === "string") {
      fields.album = albumName;
    }
  }

  if (parsed.spotifyType === "episode" && payload.show && typeof payload.show === "object") {
    const showName = "name" in payload.show ? payload.show.name : undefined;
    if (typeof showName === "string") {
      fields.album = showName;
    }
  }

  if (typeof payload.publisher === "string") {
    fields.artist = payload.publisher;
  }

  const images = payload.images;
  if (Array.isArray(images) && images[0] && typeof images[0] === "object" && "url" in images[0]) {
    const imageUrl = images[0].url;
    if (typeof imageUrl === "string") {
      fields.image = imageUrl;
    }
  }

  return fields;
}

async function fetchSpotifyApiMetadata(
  parsed: ParsedSpotifyUrl
): Promise<SpotifyMetadataFields | null> {
  if (!parsed.spotifyId || parsed.spotifyType === "unknown") {
    return null;
  }

  const token = await getSpotifyAccessToken();
  if (!token) {
    return null;
  }

  const endpointByType: Partial<Record<SpotifyResourceType, string>> = {
    track: "tracks",
    album: "albums",
    playlist: "playlists",
    artist: "artists",
    episode: "episodes",
    show: "shows",
  };

  const endpoint = endpointByType[parsed.spotifyType];
  if (!endpoint) {
    return null;
  }

  const payload = await fetchJsonWithTimeout(
    `https://api.spotify.com/v1/${endpoint}/${parsed.spotifyId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!payload) {
    return null;
  }

  return mapSpotifyApiPayload(parsed, payload);
}

function mergeSpotifyFields(
  primary: SpotifyMetadataFields | null,
  secondary: SpotifyMetadataFields | null
): SpotifyMetadataFields | null {
  if (!primary && !secondary) {
    return null;
  }

  const merged: SpotifyMetadataFields = {
    spotifyType: primary?.spotifyType ?? secondary?.spotifyType ?? "unknown",
  };

  const spotifyId = primary?.spotifyId ?? secondary?.spotifyId;
  const title = primary?.title ?? secondary?.title;
  const artist = primary?.artist ?? secondary?.artist;
  const album = primary?.album ?? secondary?.album;
  const description = primary?.description ?? secondary?.description;
  const image = primary?.image ?? secondary?.image;
  const provider = primary?.provider ?? secondary?.provider;

  if (spotifyId) merged.spotifyId = spotifyId;
  if (title) merged.title = title;
  if (artist) merged.artist = artist;
  if (album) merged.album = album;
  if (description) merged.description = description;
  if (image) merged.image = image;
  if (provider) merged.provider = provider;

  return merged;
}

export function buildSpotifyBodyText(fields: SpotifyMetadataFields): string {
  const lines: string[] = [`Spotify Type: ${fields.spotifyType}`];

  if (fields.title) lines.push(`Title: ${fields.title}`);
  if (fields.artist) lines.push(`Artist: ${fields.artist}`);
  if (fields.album) lines.push(`Album: ${fields.album}`);
  if (fields.description) lines.push(`Description: ${fields.description}`);
  if (fields.provider) lines.push(`Provider: ${fields.provider}`);

  return lines.join("\n").trim();
}

export function buildSpotifyArtifactText(
  fields: SpotifyMetadataFields,
  userContext: {
    title?: string | undefined;
    summary?: string | null | undefined;
    description?: string | null | undefined;
    personalNote?: string | null | undefined;
    whySaved?: string | null | undefined;
    tags?: string[] | null | undefined;
    collection?: string | null | undefined;
  }
): string {
  const lines = [buildSpotifyBodyText(fields)];

  if (userContext.personalNote) {
    lines.push(`User note: ${userContext.personalNote}`);
  }
  if (userContext.summary) {
    lines.push(`User summary: ${userContext.summary}`);
  }
  if (userContext.whySaved) {
    lines.push(`Remember this for: ${userContext.whySaved}`);
  }
  if (userContext.tags?.length) {
    lines.push(`Tags: ${userContext.tags.join(", ")}`);
  }
  if (userContext.collection) {
    lines.push(`Collection: ${userContext.collection}`);
  }

  return lines.filter(Boolean).join("\n").trim();
}

export async function fetchSpotifyMetadata(
  url: string
): Promise<SpotifyMetadataFields | null> {
  const parsed = parseSpotifyUrl(url);
  if (!parsed) {
    return null;
  }

  const [apiFields, oEmbedFields] = await Promise.all([
    fetchSpotifyApiMetadata(parsed),
    fetchSpotifyOEmbed(url),
  ]);

  const merged = mergeSpotifyFields(apiFields, oEmbedFields);
  if (!merged) {
    const fallback: SpotifyMetadataFields = {
      spotifyType: parsed.spotifyType,
      provider: "spotify",
    };

    if (parsed.spotifyId) {
      fallback.spotifyId = parsed.spotifyId;
    }

    return fallback;
  }

  if (!merged.spotifyId && parsed.spotifyId) {
    merged.spotifyId = parsed.spotifyId;
  }
  if (merged.spotifyType === "unknown") merged.spotifyType = parsed.spotifyType;

  return merged;
}
