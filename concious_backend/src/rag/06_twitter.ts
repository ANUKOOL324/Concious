import { normalizeUrl } from "./01_platform.js";

export type ParsedTwitterUrl = {
  username?: string | undefined;
  tweetId?: string | undefined;
  normalizedUrl: string;
  platform: "twitter";
};

export interface TwitterMetadataFields {
  username?: string | undefined;
  tweetId?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
  image?: string | undefined;
  siteName?: string | undefined;
  provider?: string | undefined;
}

const TWITTER_HOSTS = new Set(["twitter.com", "x.com", "mobile.twitter.com"]);

// twitter.com/:username/status/:tweetId
// x.com/:username/status/:tweetId
// mobile.twitter.com/:username/status/:tweetId
export function parseTwitterUrl(url: string): ParsedTwitterUrl | null {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");

    if (!TWITTER_HOSTS.has(host)) {
      return null;
    }

    const parts = parsed.pathname.split("/").filter(Boolean);
    const statusIndex = parts.findIndex((part) => part.toLowerCase() === "status");
    const username = statusIndex > 0 ? parts[statusIndex - 1] : undefined;
    const tweetId = statusIndex >= 0 ? parts[statusIndex + 1]?.split("?")[0] : undefined;

    const normalized =
      normalizeUrl(url.trim()) ??
      `${parsed.origin}${parsed.pathname.split("?")[0] ?? parsed.pathname}`;

    const result: ParsedTwitterUrl = {
      normalizedUrl: normalized,
      platform: "twitter",
    };

    if (username) {
      result.username = username;
    }
    if (tweetId && /^\d+$/.test(tweetId)) {
      result.tweetId = tweetId;
    }

    return result;
  } catch {
    return null;
  }
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMetaTag(html: string, key: string) {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["']`,
      "i"
    ),
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(html);
    if (match?.[1]) {
      return decodeHtmlEntities(match[1]);
    }
  }

  return undefined;
}

async function fetchHtmlWithTimeout(url: string, timeoutMs = 5000) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ConciousBot/1.0; +https://concious.app)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
      return null;
    }

    return response.text();
  } catch (error) {
    console.warn(`Twitter page fetch failed for ${url}:`, error);
    return null;
  }
}

async function fetchJsonWithTimeout(url: string, timeoutMs = 5000) {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (compatible; ConciousBot/1.0; +https://concious.app)",
      },
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
    console.warn(`Twitter oEmbed fetch failed for ${url}:`, error);
    return null;
  }
}

function stripHtml(value: string) {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
}

async function fetchTwitterOEmbed(url: string): Promise<TwitterMetadataFields | null> {
  const oEmbedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=true`;
  const payload = await fetchJsonWithTimeout(oEmbedUrl);

  if (!payload) {
    return null;
  }

  const fields: TwitterMetadataFields = {
    provider: "twitter-oembed",
  };

  if (typeof payload.author_name === "string") {
    fields.username = payload.author_name.replace(/^@/, "");
  }

  if (typeof payload.html === "string") {
    const text = stripHtml(payload.html);
    if (text) {
      fields.description = text;
    }
  }

  if (typeof payload.url === "string" && !fields.description) {
    fields.description = payload.url;
  }

  return fields;
}

async function fetchTwitterOpenGraph(url: string): Promise<TwitterMetadataFields | null> {
  const html = await fetchHtmlWithTimeout(url);
  if (!html) {
    return null;
  }

  const title =
    extractMetaTag(html, "og:title") ?? extractMetaTag(html, "twitter:title");
  const description =
    extractMetaTag(html, "og:description") ??
    extractMetaTag(html, "twitter:description");
  const image =
    extractMetaTag(html, "og:image") ?? extractMetaTag(html, "twitter:image");
  const siteName = extractMetaTag(html, "og:site_name");

  if (!title && !description && !image && !siteName) {
    return null;
  }

  const fields: TwitterMetadataFields = {
    provider: "open-graph",
  };

  if (title) fields.title = title;
  if (description) fields.description = description;
  if (image) fields.image = image;
  if (siteName) fields.siteName = siteName;

  return fields;
}

function mergeTwitterFields(
  parsed: ParsedTwitterUrl | null,
  primary: TwitterMetadataFields | null,
  secondary: TwitterMetadataFields | null
): TwitterMetadataFields {
  const merged: TwitterMetadataFields = {
    provider: primary?.provider ?? secondary?.provider ?? "twitter",
  };

  const username = parsed?.username ?? primary?.username ?? secondary?.username;
  const tweetId = parsed?.tweetId ?? primary?.tweetId ?? secondary?.tweetId;
  const title = primary?.title ?? secondary?.title;
  const description = primary?.description ?? secondary?.description;
  const image = primary?.image ?? secondary?.image;
  const siteName = primary?.siteName ?? secondary?.siteName;

  if (username) merged.username = username;
  if (tweetId) merged.tweetId = tweetId;
  if (title) merged.title = title;
  if (description) merged.description = description;
  if (image) merged.image = image;
  if (siteName) merged.siteName = siteName;

  return merged;
}

export function buildTwitterBodyText(fields: TwitterMetadataFields): string {
  const lines: string[] = [];

  if (fields.username) {
    lines.push(`Twitter User: @${fields.username}`);
  }
  if (fields.tweetId) {
    lines.push(`Tweet ID: ${fields.tweetId}`);
  }
  if (fields.title) {
    lines.push(`Title: ${fields.title}`);
  }
  if (fields.description) {
    lines.push(`Description: ${fields.description}`);
  }
  if (fields.siteName) {
    lines.push(`Site: ${fields.siteName}`);
  }

  return lines.join("\n").trim();
}

export function buildTwitterArtifactText(
  fields: TwitterMetadataFields,
  userContext: {
    summary?: string | null | undefined;
    description?: string | null | undefined;
    personalNote?: string | null | undefined;
    whySaved?: string | null | undefined;
    tags?: string[] | null | undefined;
    collection?: string | null | undefined;
  },
  sourceUrl?: string | null
): string {
  const lines: string[] = [];

  const body = buildTwitterBodyText(fields);
  if (body) {
    lines.push(body);
  }

  if (sourceUrl) {
    lines.push(`Link: ${sourceUrl}`);
  }

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

export async function fetchTwitterMetadata(
  url: string
): Promise<{ parsed: ParsedTwitterUrl | null; fields: TwitterMetadataFields }> {
  const parsed = parseTwitterUrl(url);

  const [oEmbedFields, openGraphFields] = await Promise.all([
    fetchTwitterOEmbed(url),
    fetchTwitterOpenGraph(url),
  ]);

  const fields = mergeTwitterFields(parsed, openGraphFields, oEmbedFields);

  if (parsed?.username && !fields.username) {
    fields.username = parsed.username;
  }
  if (parsed?.tweetId && !fields.tweetId) {
    fields.tweetId = parsed.tweetId;
  }

  return { parsed, fields };
}
