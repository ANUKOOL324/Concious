import { extractReadableArticle } from "./03_scraper.js";
import { detectPlatform, getHostname, normalizeUrl, type PlatformType } from "./01_platform.js";
import { fetchYoutubeTranscript, parseYoutubeVideoId } from "./04_youtube.js";
import {
  buildSpotifyArtifactText,
  buildSpotifyBodyText,
  fetchSpotifyMetadata,
  parseSpotifyUrl,
} from "./05_spotify.js";
import {
  buildTwitterArtifactText,
  buildTwitterBodyText,
  fetchTwitterMetadata,
  parseTwitterUrl,
} from "./06_twitter.js";

const MIN_BODY_TEXT_LENGTH = 100;
const MIN_SPOTIFY_BODY_LENGTH = 40;
const MIN_TWITTER_BODY_LENGTH = 40;

export type ContentForExtraction = {
  title: string;
  link?: string | null | undefined;
  type: string;
  summary?: string | null | undefined;
  description?: string | null | undefined;
  personalNote?: string | null | undefined;
  whySaved?: string | null | undefined;
  tags?: string[] | null | undefined;
  collection?: string | null | undefined;
};

export type ArtifactExtractionStatus = "success" | "failed" | "skipped";

export interface SourceArtifactExtractionResult {
  artifactType:
    | "metadata"
    | "article"
    | "youtube_transcript"
    | "youtube_description"
    | "spotify_metadata"
    | "twitter_thread"
    | "pdf_text"
    | "other";
  provider: "user" | "scraper" | "youtube" | "spotify" | "twitter" | "pdf" | "system";
  sourceUrl: string | null;
  rawText?: string;
  extractionStatus: ArtifactExtractionStatus;
  extractionError?: string;
  extractionQuality?: string;
  charLength?: number;
  metadata: {
    platform: PlatformType;
    hostname?: string | null;
    sourceType: PlatformType;
    originalUrl?: string | null;
    normalizedUrl?: string | null;
    contentType?: string | null;
    videoId?: string | null;
    title?: string | null;
    description?: string | null;
    siteName?: string | null;
    author?: string | null;
    publishedAt?: string | null;
    image?: string | null;
    spotifyType?: string | null;
    spotifyId?: string | null;
    artist?: string | null;
    album?: string | null;
    provider?: string | null;
    username?: string | null;
    tweetId?: string | null;
  };
  bodyText?: string;
  chunkSourceType: string;
  minBodyLength?: number;
  sourceMetadata?: {
    title?: string;
    description?: string;
    siteName?: string;
    author?: string;
    publishedAt?: string;
    image?: string;
    hostname?: string;
    spotifyType?: string;
    spotifyId?: string;
    artist?: string;
    album?: string;
    provider?: string;
    username?: string;
    tweetId?: string;
  };
}

function buildArtifactMetadata(
  content: ContentForExtraction,
  platform: PlatformType
): SourceArtifactExtractionResult["metadata"] {
  const originalUrl = content.link?.trim() || null;

  return {
    platform,
    hostname: originalUrl ? getHostname(originalUrl) : null,
    sourceType: platform,
    originalUrl,
    normalizedUrl: originalUrl ? normalizeUrl(originalUrl) : null,
    contentType: content.type ?? null,
  };
}

async function fetchJsonWithTimeout(
  url: string,
  timeoutMs = 5000
): Promise<Record<string, unknown> | null> {
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
    console.warn(`Metadata fetch failed for ${url}:`, error);
    return null;
  }
}

function buildPlatformContextText(
  content: ContentForExtraction,
  extraLines: string[] = []
): string {
  const parts: string[] = [];

  if (content.title) {
    parts.push(`Title: ${content.title}`);
  }

  if (content.link) {
    parts.push(`Link: ${content.link}`);
  }

  parts.push(...extraLines);

  if (content.summary) {
    parts.push(`Summary: ${content.summary}`);
  }

  if (content.description) {
    parts.push(`Description: ${content.description}`);
  }

  if (content.personalNote) {
    parts.push(`Personal note: ${content.personalNote}`);
  }

  if (content.whySaved) {
    parts.push(`Remember this for: ${content.whySaved}`);
  }

  if (content.tags?.length) {
    parts.push(`Tags: ${content.tags.join(", ")}`);
  }

  return parts.join("\n").trim();
}

function buildYoutubeMetadata(
  content: ContentForExtraction,
  platform: PlatformType,
  videoId: string | null
): SourceArtifactExtractionResult["metadata"] {
  return {
    ...buildArtifactMetadata(content, platform),
    videoId,
  };
}

async function buildYoutubeDescriptionArtifact(
  content: ContentForExtraction,
  platform: PlatformType,
  videoId: string | null
): Promise<SourceArtifactExtractionResult> {
  const sourceUrl = content.link?.trim() || null;
  const metadata = buildYoutubeMetadata(content, platform, videoId);
  const extraLines: string[] = [];

  if (sourceUrl) {
    const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(sourceUrl)}&format=json`;
    const oEmbed = await fetchJsonWithTimeout(oEmbedUrl);

    if (oEmbed) {
      if (typeof oEmbed.title === "string") {
        extraLines.push(`Video title: ${oEmbed.title}`);
      }
      if (typeof oEmbed.author_name === "string") {
        extraLines.push(`Channel: ${oEmbed.author_name}`);
      }
    }
  }

  const rawText = buildPlatformContextText(content, extraLines);
  const hasUsefulMetadata = extraLines.length > 0 || rawText.length > MIN_BODY_TEXT_LENGTH;

  if (!hasUsefulMetadata) {
    return {
      artifactType: "metadata",
      provider: "youtube",
      sourceUrl,
      extractionStatus: "skipped",
      extractionError: "No YouTube description or public metadata was available",
      metadata,
      chunkSourceType: "youtube_description",
    };
  }

  const result: SourceArtifactExtractionResult = {
    artifactType: "youtube_description",
    provider: "youtube",
    sourceUrl,
    rawText,
    extractionStatus: "success",
    extractionQuality: extraLines.length > 0 ? "oembed+user-context" : "user-context",
    charLength: rawText.length,
    metadata,
    chunkSourceType: "youtube_description",
  };

  if (rawText.length > MIN_BODY_TEXT_LENGTH) {
    result.bodyText = rawText;
  }

  return result;
}

async function extractYoutube(
  content: ContentForExtraction,
  platform: PlatformType
): Promise<SourceArtifactExtractionResult[]> {
  const sourceUrl = content.link?.trim() || null;
  const videoId = sourceUrl ? parseYoutubeVideoId(sourceUrl) : null;
  const artifacts: SourceArtifactExtractionResult[] = [];

  if (videoId) {
    const transcriptResult = await fetchYoutubeTranscript(videoId);

    if (transcriptResult.ok) {
      artifacts.push({
        artifactType: "youtube_transcript",
        provider: "youtube",
        sourceUrl,
        rawText: transcriptResult.text,
        extractionStatus: "success",
        extractionQuality: "captions",
        charLength: transcriptResult.text.length,
        metadata: buildYoutubeMetadata(content, platform, videoId),
        bodyText: transcriptResult.text,
        chunkSourceType: "youtube_transcript",
      });

      return artifacts;
    }

    artifacts.push({
      artifactType: "youtube_transcript",
      provider: "youtube",
      sourceUrl,
      extractionStatus: transcriptResult.skipped ? "skipped" : "failed",
      extractionError: transcriptResult.reason,
      metadata: buildYoutubeMetadata(content, platform, videoId),
      chunkSourceType: "youtube_transcript",
    });
  }

  artifacts.push(await buildYoutubeDescriptionArtifact(content, platform, videoId));
  return artifacts;
}

async function extractSpotify(
  content: ContentForExtraction,
  platform: PlatformType
): Promise<SourceArtifactExtractionResult> {
  const sourceUrl = content.link?.trim() || null;
  const baseMetadata = buildArtifactMetadata(content, platform);
  const parsedUrl = sourceUrl ? parseSpotifyUrl(sourceUrl) : null;

  let spotifyFields = sourceUrl ? await fetchSpotifyMetadata(sourceUrl) : null;

  if (!spotifyFields && parsedUrl) {
    spotifyFields = {
      spotifyType: parsedUrl.spotifyType,
      provider: "spotify",
    };

    if (parsedUrl.spotifyId) {
      spotifyFields.spotifyId = parsedUrl.spotifyId;
    }
  }

  const enrichedMetadata: SourceArtifactExtractionResult["metadata"] = {
    ...baseMetadata,
    normalizedUrl: parsedUrl?.normalizedUrl ?? baseMetadata.normalizedUrl ?? null,
    spotifyType: spotifyFields?.spotifyType ?? parsedUrl?.spotifyType ?? null,
    spotifyId: spotifyFields?.spotifyId ?? parsedUrl?.spotifyId ?? null,
    title: spotifyFields?.title ?? null,
    artist: spotifyFields?.artist ?? null,
    album: spotifyFields?.album ?? null,
    description: spotifyFields?.description ?? null,
    image: spotifyFields?.image ?? null,
    provider: spotifyFields?.provider ?? "spotify",
  };

  const hasSpotifyDetails = Boolean(
    spotifyFields?.title ||
      spotifyFields?.artist ||
      spotifyFields?.album ||
      spotifyFields?.description
  );

  const spotifyBodyText = spotifyFields ? buildSpotifyBodyText(spotifyFields) : "";
  const rawText = spotifyFields
    ? buildSpotifyArtifactText(spotifyFields, {
        summary: content.summary,
        description: content.description,
        personalNote: content.personalNote,
        whySaved: content.whySaved,
        tags: content.tags,
        collection: content.collection,
      })
    : buildPlatformContextText(content);

  const sourceMetadata: NonNullable<SourceArtifactExtractionResult["sourceMetadata"]> =
    {
      provider: spotifyFields?.provider ?? "spotify",
    };

  if (enrichedMetadata.title) sourceMetadata.title = enrichedMetadata.title;
  if (enrichedMetadata.description) sourceMetadata.description = enrichedMetadata.description;
  if (enrichedMetadata.image) sourceMetadata.image = enrichedMetadata.image;
  if (enrichedMetadata.hostname) sourceMetadata.hostname = enrichedMetadata.hostname;
  if (enrichedMetadata.spotifyType) sourceMetadata.spotifyType = enrichedMetadata.spotifyType;
  if (enrichedMetadata.spotifyId) sourceMetadata.spotifyId = enrichedMetadata.spotifyId;
  if (enrichedMetadata.artist) sourceMetadata.artist = enrichedMetadata.artist;
  if (enrichedMetadata.album) sourceMetadata.album = enrichedMetadata.album;

  const result: SourceArtifactExtractionResult = {
    artifactType: "spotify_metadata",
    provider: "spotify",
    sourceUrl,
    rawText,
    extractionStatus: hasSpotifyDetails || rawText ? "success" : "skipped",
    extractionQuality: hasSpotifyDetails
      ? spotifyFields?.provider === "spotify-web-api"
        ? "spotify-api+oembed"
        : "oembed+user-context"
      : "user-context",
    charLength: rawText.length,
    metadata: enrichedMetadata,
    chunkSourceType: "spotify_metadata",
    minBodyLength: MIN_SPOTIFY_BODY_LENGTH,
  };

  if (!hasSpotifyDetails && !rawText) {
    result.extractionStatus = "skipped";
    result.extractionError = "No Spotify metadata was available";
  }

  if (spotifyBodyText.length >= MIN_SPOTIFY_BODY_LENGTH) {
    result.bodyText = spotifyBodyText;
  }

  if (Object.keys(sourceMetadata).length > 1) {
    result.sourceMetadata = sourceMetadata;
  }

  return result;
}

async function extractTwitter(
  content: ContentForExtraction,
  platform: PlatformType
): Promise<SourceArtifactExtractionResult> {
  const sourceUrl = content.link?.trim() || null;
  const baseMetadata = buildArtifactMetadata(content, platform);
  const parsedUrl = sourceUrl ? parseTwitterUrl(sourceUrl) : null;

  let twitterFields: import("./06_twitter.js").TwitterMetadataFields = {
    provider: "twitter",
  };

  if (sourceUrl) {
    const fetched = await fetchTwitterMetadata(sourceUrl);
    twitterFields = fetched.fields;
  }

  const enrichedMetadata: SourceArtifactExtractionResult["metadata"] = {
    ...baseMetadata,
    normalizedUrl: parsedUrl?.normalizedUrl ?? baseMetadata.normalizedUrl ?? null,
    username: twitterFields.username ?? parsedUrl?.username ?? null,
    tweetId: twitterFields.tweetId ?? parsedUrl?.tweetId ?? null,
    title: twitterFields.title ?? null,
    description: twitterFields.description ?? null,
    image: twitterFields.image ?? null,
    siteName: twitterFields.siteName ?? null,
    provider: twitterFields.provider ?? "twitter",
  };

  const hasTwitterDetails = Boolean(
    twitterFields.title ||
      twitterFields.description ||
      twitterFields.username ||
      twitterFields.tweetId
  );

  const twitterBodyText = buildTwitterBodyText(twitterFields);
  const rawText = buildTwitterArtifactText(
    twitterFields,
    {
      summary: content.summary,
      description: content.description,
      personalNote: content.personalNote,
      whySaved: content.whySaved,
      tags: content.tags,
      collection: content.collection,
    },
    sourceUrl
  );

  const sourceMetadata: NonNullable<SourceArtifactExtractionResult["sourceMetadata"]> =
    {
      provider: twitterFields.provider ?? "twitter",
    };

  if (enrichedMetadata.title) sourceMetadata.title = enrichedMetadata.title;
  if (enrichedMetadata.description) sourceMetadata.description = enrichedMetadata.description;
  if (enrichedMetadata.image) sourceMetadata.image = enrichedMetadata.image;
  if (enrichedMetadata.siteName) sourceMetadata.siteName = enrichedMetadata.siteName;
  if (enrichedMetadata.hostname) sourceMetadata.hostname = enrichedMetadata.hostname;
  if (enrichedMetadata.username) sourceMetadata.username = enrichedMetadata.username;
  if (enrichedMetadata.tweetId) sourceMetadata.tweetId = enrichedMetadata.tweetId;

  const result: SourceArtifactExtractionResult = {
    artifactType: "twitter_thread",
    provider: "twitter",
    sourceUrl,
    rawText,
    extractionStatus: hasTwitterDetails || rawText.length >= MIN_TWITTER_BODY_LENGTH ? "success" : "skipped",
    extractionQuality: hasTwitterDetails
      ? twitterFields.provider === "open-graph"
        ? "open-graph+user-context"
        : "twitter-oembed+user-context"
      : "user-context",
    charLength: rawText.length,
    metadata: enrichedMetadata,
    chunkSourceType: "twitter_thread",
    minBodyLength: MIN_TWITTER_BODY_LENGTH,
  };

  if (!hasTwitterDetails && rawText.length < MIN_TWITTER_BODY_LENGTH) {
    result.extractionError = "No public Twitter metadata was available";
  }

  if (twitterBodyText.length >= MIN_TWITTER_BODY_LENGTH) {
    result.bodyText = twitterBodyText;
  } else if (rawText.length >= MIN_TWITTER_BODY_LENGTH) {
    result.bodyText = twitterBodyText || rawText;
  }

  if (Object.keys(sourceMetadata).length > 1) {
    result.sourceMetadata = sourceMetadata;
  }

  return result;
}

function buildPdfExtraction(
  content: ContentForExtraction,
  platform: PlatformType
): SourceArtifactExtractionResult {
  return {
    artifactType: "pdf_text",
    provider: "pdf",
    sourceUrl: content.link?.trim() || null,
    extractionStatus: "skipped",
    extractionError: "PDF text extraction is not enabled yet",
    metadata: buildArtifactMetadata(content, platform),
    chunkSourceType: "pdf_text",
  };
}

async function extractArticleLike(
  content: ContentForExtraction,
  platform: PlatformType
): Promise<SourceArtifactExtractionResult> {
  const sourceUrl = content.link?.trim() || null;
  const metadata = buildArtifactMetadata(content, platform);

  if (!sourceUrl) {
    return {
      artifactType: "article",
      provider: "system",
      sourceUrl: null,
      extractionStatus: "skipped",
      extractionError: "No link available for scraping",
      metadata,
      chunkSourceType: "article",
    };
  }

  const article = await extractReadableArticle(sourceUrl);

  if (article.ok && article.text.length > MIN_BODY_TEXT_LENGTH) {
    const enrichedMetadata: SourceArtifactExtractionResult["metadata"] = {
      ...metadata,
      hostname: article.hostname ?? metadata.hostname ?? null,
      title: article.title ?? null,
      description: article.description ?? null,
      siteName: article.siteName ?? null,
      author: article.author ?? null,
      publishedAt: article.publishedAt ?? null,
      image: article.image ?? null,
    };

    const sourceMetadata: NonNullable<SourceArtifactExtractionResult["sourceMetadata"]> =
      {};

    if (article.title) sourceMetadata.title = article.title;
    if (article.description) sourceMetadata.description = article.description;
    if (article.siteName) sourceMetadata.siteName = article.siteName;
    if (article.author) sourceMetadata.author = article.author;
    if (article.publishedAt) sourceMetadata.publishedAt = article.publishedAt;
    if (article.image) sourceMetadata.image = article.image;
    if (article.hostname) sourceMetadata.hostname = article.hostname;

    const result: SourceArtifactExtractionResult = {
      artifactType: "article",
      provider: "scraper",
      sourceUrl,
      rawText: article.text,
      extractionStatus: "success",
      extractionQuality: article.title ? "readability" : "html-scrape-fallback",
      charLength: article.text.length,
      metadata: enrichedMetadata,
      bodyText: article.mainBody ?? article.text,
      chunkSourceType: "article",
    };

    if (Object.keys(sourceMetadata).length > 0) {
      result.sourceMetadata = sourceMetadata;
    }

    return result;
  }

  if (article.text.length > 0) {
    return {
      artifactType: "article",
      provider: "scraper",
      sourceUrl,
      extractionStatus: "skipped",
      extractionError: article.error || "Scraped text was too short to use",
      charLength: article.text.length,
      metadata,
      chunkSourceType: "article",
    };
  }

  return {
    artifactType: "article",
    provider: "scraper",
    sourceUrl,
    extractionStatus: "failed",
    extractionError: article.error || "URL scraping failed",
    metadata,
    chunkSourceType: "article",
  };
}

export async function extractSourceArtifactInputs(
  content: ContentForExtraction
): Promise<SourceArtifactExtractionResult[]> {
  const platform = detectPlatform(content);

  switch (platform) {
    case "pdf":
      return [buildPdfExtraction(content, platform)];
    case "youtube":
      return extractYoutube(content, platform);
    case "spotify":
      return [await extractSpotify(content, platform)];
    case "twitter":
      return [await extractTwitter(content, platform)];
    case "article":
      return [await extractArticleLike(content, platform)];
    case "other":
      if (!content.link?.trim()) {
        return [];
      }
      return [await extractArticleLike(content, platform)];
    default:
      return [];
  }
}

export async function extractSourceArtifactInput(
  content: ContentForExtraction
): Promise<SourceArtifactExtractionResult | null> {
  const artifacts = await extractSourceArtifactInputs(content);
  return artifacts[0] ?? null;
}
