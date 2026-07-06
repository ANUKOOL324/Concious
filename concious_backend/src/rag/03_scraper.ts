import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { getHostname } from "./01_platform.js";

export const MAX_ARTICLE_TEXT_LENGTH = 15000;
const FETCH_TIMEOUT_MS = 8000;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export interface ArticleExtractionResult {
  ok: boolean;
  text: string;
  mainBody?: string;
  title?: string;
  description?: string;
  siteName?: string;
  author?: string;
  publishedAt?: string;
  image?: string;
  url?: string;
  hostname?: string;
  error?: string;
}

function normalizeArticleText(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[\u00a0]+/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function capArticleText(text: string, maxLength = MAX_ARTICLE_TEXT_LENGTH) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}...`;
}

function getMetaContent(document: Document, selectors: string[]) {
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    const value = element?.getAttribute("content")?.trim();
    if (value) {
      return value;
    }
  }

  return undefined;
}

function extractDocumentMeta(document: Document) {
  return {
    title: getMetaContent(document, [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
    ]),
    description: getMetaContent(document, [
      'meta[property="og:description"]',
      'meta[name="description"]',
    ]),
    siteName: getMetaContent(document, ['meta[property="og:site_name"]']),
    image: getMetaContent(document, ['meta[property="og:image"]']),
    publishedAt: getMetaContent(document, [
      'meta[property="article:published_time"]',
      'meta[name="article:published_time"]',
      'meta[property="og:published_time"]',
    ]),
    author: getMetaContent(document, [
      'meta[name="author"]',
      'meta[property="article:author"]',
    ]),
  };
}

function buildStructuredArticleText(
  fields: {
    title?: string;
    author?: string;
    publishedAt?: string;
    siteName?: string;
    description?: string;
  },
  body: string
) {
  const header: string[] = [];

  if (fields.title) {
    header.push(`Title: ${fields.title}`);
  }
  if (fields.author) {
    header.push(`Author: ${fields.author}`);
  }
  if (fields.publishedAt) {
    header.push(`Published: ${fields.publishedAt}`);
  }
  if (fields.siteName) {
    header.push(`Site: ${fields.siteName}`);
  }
  if (fields.description) {
    header.push(`Summary: ${fields.description}`);
  }

  const normalizedBody = normalizeArticleText(body);
  if (header.length === 0) {
    return capArticleText(normalizedBody);
  }

  return capArticleText(`${header.join("\n")}\n\n${normalizedBody}`);
}

function stripHtmlToText(html: string) {
  let cleanHtml = html
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
    .replace(/<svg[^>]*>([\s\S]*?)<\/svg>/gi, "")
    .replace(/<noscript[^>]*>([\s\S]*?)<\/noscript>/gi, "")
    .replace(/<iframe[^>]*>([\s\S]*?)<\/iframe>/gi, "");

  const paragraphs: string[] = [];
  const paragraphRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match: RegExpExecArray | null;

  while ((match = paragraphRegex.exec(cleanHtml)) !== null) {
    const paragraphText = (match[1] || "")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (paragraphText.length > 20) {
      paragraphs.push(paragraphText);
    }
  }

  let text = paragraphs.join("\n\n");

  if (!text || text.length < 150) {
    text = cleanHtml
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  return capArticleText(normalizeArticleText(text));
}

function buildArticleResult(
  base: ArticleExtractionResult,
  fields: {
    title?: string;
    description?: string;
    siteName?: string;
    author?: string;
    publishedAt?: string;
    image?: string;
  }
): ArticleExtractionResult {
  const result: ArticleExtractionResult = { ...base };

  if (fields.title) result.title = fields.title;
  if (fields.description) result.description = fields.description;
  if (fields.siteName) result.siteName = fields.siteName;
  if (fields.author) result.author = fields.author;
  if (fields.publishedAt) result.publishedAt = fields.publishedAt;
  if (fields.image) result.image = fields.image;

  return result;
}

function parseWithReadability(html: string, pageUrl: string) {
  const dom = new JSDOM(html, { url: pageUrl });
  const document = dom.window.document;
  const pageMeta = extractDocumentMeta(document);
  const reader = new Readability(document);
  const parsed = reader.parse();

  if (!parsed?.textContent || parsed.textContent.trim().length < 100) {
    return null;
  }

  const title = parsed.title || pageMeta.title;
  const author = parsed.byline || pageMeta.author;
  const description = parsed.excerpt || pageMeta.description;
  const siteName = parsed.siteName || pageMeta.siteName;
  const mainBody = normalizeArticleText(parsed.textContent);
  const structuredFields: {
    title?: string;
    author?: string;
    publishedAt?: string;
    siteName?: string;
    description?: string;
  } = {};

  if (title) structuredFields.title = title;
  if (author) structuredFields.author = author;
  if (pageMeta.publishedAt) structuredFields.publishedAt = pageMeta.publishedAt;
  if (siteName) structuredFields.siteName = siteName;
  if (description) structuredFields.description = description;

  return {
    title,
    author,
    description,
    siteName,
    publishedAt: pageMeta.publishedAt,
    image: pageMeta.image,
    mainBody,
    rawText: buildStructuredArticleText(structuredFields, mainBody),
  };
}

function withHostname(
  result: ArticleExtractionResult,
  hostname: string | undefined
): ArticleExtractionResult {
  if (hostname) {
    result.hostname = hostname;
  }

  return result;
}

export async function extractReadableArticle(url: string): Promise<ArticleExtractionResult> {
  const trimmedUrl = url.trim();
  const hostname = getHostname(trimmedUrl) ?? undefined;

  if (!trimmedUrl) {
    return withHostname(
      {
        ok: false,
        text: "",
        error: "Missing URL",
      },
      hostname
    );
  }

  try {
    const response = await fetch(trimmedUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`HTTP Status ${response.status}`);
    }

    const html = await response.text();
    const finalUrl = response.url || trimmedUrl;
    const resolvedHostname = getHostname(finalUrl) ?? hostname;

    try {
      const parsed = parseWithReadability(html, finalUrl);

      if (parsed) {
        const articleFields: {
          title?: string;
          description?: string;
          siteName?: string;
          author?: string;
          publishedAt?: string;
          image?: string;
        } = {};

        if (parsed.title) articleFields.title = parsed.title;
        if (parsed.description) articleFields.description = parsed.description;
        if (parsed.siteName) articleFields.siteName = parsed.siteName;
        if (parsed.author) articleFields.author = parsed.author;
        if (parsed.publishedAt) articleFields.publishedAt = parsed.publishedAt;
        if (parsed.image) articleFields.image = parsed.image;

        return buildArticleResult(
          withHostname(
            {
              ok: true,
              text: parsed.rawText,
              mainBody: parsed.mainBody,
              url: finalUrl,
            },
            resolvedHostname
          ),
          articleFields
        );
      }
    } catch (readabilityError) {
      console.warn(`Readability parse failed for ${finalUrl}:`, readabilityError);
    }

    const fallbackText = stripHtmlToText(html);
    if (fallbackText.length > 100) {
      return withHostname(
        {
          ok: true,
          text: fallbackText,
          url: finalUrl,
        },
        resolvedHostname
      );
    }

    return withHostname(
      {
        ok: false,
        text: "",
        error: "Article text was too short to use",
        url: finalUrl,
      },
      resolvedHostname
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "URL scraping failed";
    console.error(`Article extraction failed for ${trimmedUrl}:`, error);

    return withHostname(
      {
        ok: false,
        text: "",
        error: message,
      },
      hostname
    );
  }
}

export async function extractReadableTextFromUrl(url: string): Promise<string> {
  const result = await extractReadableArticle(url);
  return result.ok ? result.text : "";
}
