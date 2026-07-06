import mongoose from "mongoose";
import { ContentChunkModel, ContentModel } from "../db.js";
import { askOpenRouter, askOpenRouterConversational } from "../providers.js";
import {
  buildChunkContextLine,
  chunkToSearchItem,
  dedupeSourcesByContent,
  hasEnoughContextForChat,
  NO_CONTEXT_MESSAGE,
  retrieveRerankedChunksForUser,
  selectDiverseChunksForChat,
} from "../rag/index.js";
import {
  detectContentCategory,
  filterItemsByCategory,
  findExactTitleMatch,
  findSpecificContentMatch,
  isExplainRequest,
  isFullInventoryRequest,
  isTypeListRequest,
  matchesContentCategory,
  parseExplainContentRequest,
  responseIndicatesInsufficientContext,
  sanitizeSourcesForCategory,
  type ContentCategoryFilter,
} from "../utils/contentQuery.js";
import {
  getStaticGeneralResponse,
  isGeneralConversation,
  shouldUseStaticGeneralResponse,
} from "../utils/conversational.js";
import { lexicalSearch } from "./search.service.js";
import type { SearchItem } from "../types/search.js";

type ChatMode =
  | "vector-chunk"
  | "lexical-fallback"
  | "conversational"
  | "inventory-list"
  | "content-picker";

export type ChatResponse = {
  mode: ChatMode;
  response: string;
  sources: SearchItem[];
  listLabel?: string;
};

const FULL_BRAIN_SAMPLE_SIZE = 10;

function toUserObjectId(userId: string) {
  return mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : userId;
}

function contentDocToSearchItem(doc: {
  _id: unknown;
  title: string;
  link?: string | null;
  type: string;
}): SearchItem {
  return {
    _id: String(doc._id),
    title: doc.title,
    link: doc.link ?? null,
    type: doc.type,
    retrievalType: "lexical",
  };
}

function pickRandomSample(items: SearchItem[], size: number) {
  if (items.length <= size) {
    return items;
  }

  return [...items].sort(() => Math.random() - 0.5).slice(0, size);
}

function buildContentListResponse(options: {
  items: SearchItem[];
  label: string;
  intro: string;
  mode: "inventory-list" | "content-picker";
  category?: ContentCategoryFilter;
}): ChatResponse {
  const items = options.category
    ? sanitizeSourcesForCategory(options.items, options.category)
    : options.items;

  return {
    mode: options.mode,
    listLabel: options.label,
    response: options.intro,
    sources: items,
  };
}

function finalizeResponse(
  response: ChatResponse,
  category?: ContentCategoryFilter | null
): ChatResponse {
  if (!category || !response.sources.length) {
    return response;
  }

  return {
    ...response,
    sources: sanitizeSourcesForCategory(response.sources, category),
  };
}

async function loadAllContent(userId: string) {
  const docs = await ContentModel.find({ userId: toUserObjectId(userId) }).sort({
    createdAt: -1,
  });

  return docs.map((doc) => contentDocToSearchItem(doc));
}

async function loadContentByCategory(
  userId: string,
  category: ContentCategoryFilter
) {
  const docs = await ContentModel.find({ userId: toUserObjectId(userId) }).sort({
    createdAt: -1,
  });

  return docs
    .filter((doc) => matchesContentCategory(doc, category))
    .map((doc) => contentDocToSearchItem(doc));
}

function buildLexicalContext(items: SearchItem[]) {
  return items
    .map((item, index) => {
      const title = item.title?.trim() || `Saved item ${index + 1}`;
      const type = item.type || "content";
      const link = item.link || "no external link";
      const snippet = item.snippet?.trim();

      if (snippet) {
        return `- ${title} (${type}) -> ${link}\n  Context snippet: "${snippet}"`;
      }

      return `- ${title} (${type}) -> ${link}`;
    })
    .join("\n");
}

async function buildContextForContent(
  userId: string,
  contentId: string,
  message: string
) {
  const rankedChunks = await retrieveRerankedChunksForUser(userId, message, 12);
  const contentChunks = rankedChunks.filter(
    (chunk) => String(chunk.contentId) === contentId
  );

  if (contentChunks.length > 0) {
    return contentChunks
      .slice(0, 4)
      .map((chunk, index) => buildChunkContextLine(chunk, index))
      .join("\n\n");
  }

  const chunks = await ContentChunkModel.find({
    userId: toUserObjectId(userId),
    contentId: new mongoose.Types.ObjectId(contentId),
  })
    .sort({ chunkIndex: 1 })
    .limit(4)
    .lean();

  if (chunks.length > 0) {
    return chunks
      .map((chunk, index) => {
        const mapped = {
          contentId,
          title: typeof chunk.title === "string" ? chunk.title : null,
          link: typeof chunk.link === "string" ? chunk.link : null,
          type: typeof chunk.type === "string" ? chunk.type : null,
          body: typeof chunk.body === "string" ? chunk.body : null,
          metadataText:
            typeof chunk.metadataText === "string" ? chunk.metadataText : null,
          chunkText: typeof chunk.chunkText === "string" ? chunk.chunkText : null,
          snippet:
            typeof chunk.chunkText === "string"
              ? chunk.chunkText
              : typeof chunk.body === "string"
                ? chunk.body
                : "",
          retrievalType: "lexical" as const,
        };

        return buildChunkContextLine(mapped, index);
      })
      .join("\n\n");
  }

  const content = await ContentModel.findOne({
    _id: contentId,
    userId: toUserObjectId(userId),
  });

  if (!content) {
    return "";
  }

  return buildLexicalContext([contentDocToSearchItem(content)]);
}

async function explainSingleContent(
  userId: string,
  message: string,
  target: SearchItem
): Promise<ChatResponse> {
  const contentId = target._id;
  if (!contentId) {
    return {
      mode: "lexical-fallback",
      response: NO_CONTEXT_MESSAGE,
      sources: [],
    };
  }

  const context = await buildContextForContent(userId, contentId, message);
  if (!context.trim()) {
    return {
      mode: "lexical-fallback",
      response: NO_CONTEXT_MESSAGE,
      sources: [],
    };
  }

  const llmResponse = await askOpenRouter(message, context);
  const title = target.title?.trim() || "this item";

  return {
    mode: "vector-chunk",
    response:
      llmResponse ??
      `I found "${title}" in your brain, but I couldn't generate a summary right now.`,
    sources: [target],
  };
}

async function handleExplainRequest(
  userId: string,
  message: string
): Promise<ChatResponse> {
  const category = parseExplainContentRequest(message);
  const candidates = category
    ? await loadContentByCategory(userId, category)
    : await loadAllContent(userId);

  if (!candidates.length) {
    return {
      mode: "lexical-fallback",
      response: category
        ? `I couldn't find any saved ${category.label.toLowerCase()} in your brain.`
        : "You don't have any saved content yet.",
      sources: [],
    };
  }

  const specificMatch = findSpecificContentMatch(message, candidates);

  if (candidates.length === 1 || specificMatch) {
    return explainSingleContent(userId, message, specificMatch ?? candidates[0]!);
  }

  return buildContentListResponse({
    mode: "content-picker",
    label: category?.label ?? "Saved content",
    intro: `You have ${candidates.length} saved ${(category?.label ?? "items").toLowerCase()}. Which one should I explain? Reply with the title or tap one below.`,
    items: candidates,
    ...(category ? { category } : {}),
  });
}

async function handleFullBrainList(userId: string): Promise<ChatResponse> {
  const allItems = await loadAllContent(userId);

  if (!allItems.length) {
    return {
      mode: "inventory-list",
      response: "You don't have any saved content yet.",
      sources: [],
    };
  }

  const sample = pickRandomSample(allItems, FULL_BRAIN_SAMPLE_SIZE);

  return buildContentListResponse({
    mode: "inventory-list",
    label: "All saved content",
    intro:
      allItems.length > FULL_BRAIN_SAMPLE_SIZE
        ? `Showing ${sample.length} items from your brain (${allItems.length} total saved).`
        : `All saved content (${allItems.length}).`,
    items: sample,
  });
}

async function handleTypeList(
  userId: string,
  category: ContentCategoryFilter
): Promise<ChatResponse> {
  const items = await loadContentByCategory(userId, category);

  if (!items.length) {
    return {
      mode: "content-picker",
      response: `I couldn't find any saved ${category.label.toLowerCase()} in your brain.`,
      sources: [],
    };
  }

  return buildContentListResponse({
    mode: "content-picker",
    label: category.label,
    intro: `Here are your saved ${category.label.toLowerCase()} (${items.length}).`,
    items,
    category,
  });
}

async function answerFromRetrieval(
  userId: string,
  message: string,
  category: ContentCategoryFilter | null
): Promise<ChatResponse> {
  let sources: SearchItem[] = [];
  let context = "";

  try {
    const rankedChunks = await retrieveRerankedChunksForUser(userId, message, 12);
    const scopedChunks = category
      ? rankedChunks.filter((chunk) =>
          matchesContentCategory(
            { type: chunk.type ?? null, link: chunk.link ?? null },
            category
          )
        )
      : rankedChunks;

    const chunks = selectDiverseChunksForChat(scopedChunks, 6, 1);
    sources = dedupeSourcesByContent(chunks.map(chunkToSearchItem)).slice(0, 1);

    if (sources.length > 0) {
      const primaryContentId = sources[0]?._id;
      const focusedChunks = primaryContentId
        ? chunks.filter((chunk) => String(chunk.contentId) === primaryContentId)
        : chunks.slice(0, 3);
      context = focusedChunks.map(buildChunkContextLine).join("\n\n");
    }
  } catch (error) {
    console.error("chat retrieval failed", error);
  }

  if (!hasEnoughContextForChat(sources)) {
    let lexicalItems = await lexicalSearch(userId, message, 8);
    if (category) {
      lexicalItems = filterItemsByCategory(lexicalItems, category);
    }

    if (hasEnoughContextForChat(lexicalItems)) {
      sources = dedupeSourcesByContent(lexicalItems).slice(0, 1);
      context = buildLexicalContext(sources);
    }
  }

  if (!hasEnoughContextForChat(sources)) {
    if (category) {
      return handleTypeList(userId, category);
    }

    return {
      mode: "lexical-fallback",
      response: NO_CONTEXT_MESSAGE,
      sources: [],
    };
  }

  const llmResponse = await askOpenRouter(message, context);
  let response =
    llmResponse ??
    `I found a relevant saved item: "${sources[0]?.title || "Untitled"}". What would you like to know about it?`;

  if (responseIndicatesInsufficientContext(response)) {
    let lexicalItems = await lexicalSearch(userId, message, 8);
    if (category) {
      lexicalItems = filterItemsByCategory(lexicalItems, category);
    }

    if (hasEnoughContextForChat(lexicalItems)) {
      const lexicalSources = dedupeSourcesByContent(lexicalItems).slice(0, 1);
      const lexicalContext = buildLexicalContext(lexicalSources);
      const retryResponse = await askOpenRouter(message, lexicalContext);

      if (retryResponse && !responseIndicatesInsufficientContext(retryResponse)) {
        return finalizeResponse(
          {
            mode: "lexical-fallback",
            response: retryResponse,
            sources: lexicalSources,
          },
          category
        );
      }
    }

    if (category) {
      return buildContentListResponse({
        mode: "content-picker",
        label: category.label,
        intro: `${response}\n\nHere are your saved ${category.label.toLowerCase()}:`,
        items: await loadContentByCategory(userId, category),
        category,
      });
    }

    return {
      mode: "lexical-fallback",
      response,
      sources: [],
    };
  }

  return finalizeResponse(
    {
      mode:
        sources[0]?.retrievalType === "lexical" ? "lexical-fallback" : "vector-chunk",
      response,
      sources: sources[0] ? [sources[0]] : [],
    },
    category
  );
}

export async function chatWithAshqnor(
  userId: string,
  message: string
): Promise<ChatResponse> {
  if (isFullInventoryRequest(message)) {
    return handleFullBrainList(userId);
  }

  const typeListCategory = isTypeListRequest(message);
  if (typeListCategory) {
    return handleTypeList(userId, typeListCategory);
  }

  const allContent = await loadAllContent(userId);
  const titlePick = findExactTitleMatch(message, allContent);
  if (titlePick) {
    return explainSingleContent(
      userId,
      `explain ${titlePick.title ?? "this item"}`,
      titlePick
    );
  }

  if (isExplainRequest(message)) {
    return handleExplainRequest(userId, message);
  }

  if (isGeneralConversation(message)) {
    if (shouldUseStaticGeneralResponse(message)) {
      return {
        mode: "conversational",
        response: getStaticGeneralResponse(message),
        sources: [],
      };
    }

    const llmResponse = await askOpenRouterConversational(message);
    return {
      mode: "conversational",
      response: llmResponse ?? getStaticGeneralResponse(message),
      sources: [],
    };
  }

  const category = detectContentCategory(message);
  return answerFromRetrieval(userId, message, category);
}
