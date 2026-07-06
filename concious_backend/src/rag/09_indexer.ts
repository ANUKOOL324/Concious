import { ContentModel, ContentChunkModel } from "../db.js";
import { getHfEmbedding } from "../providers.js";
import { buildMetadataText } from "./metadata.js";
import { extractReadableTextFromUrl } from "./scraper.js";
import { chunkText } from "./chunker.js";

// Step 4 of RAG: scrape → chunk → embed → save to contentchunks (runs on create/update)
export async function indexContentForRag(contentId: string): Promise<void> {
  const content = await ContentModel.findById(contentId);
  if (!content) return;

  content.indexingStatus = "pending";
  content.indexingError = "";
  await content.save();

  try {
    await ContentChunkModel.deleteMany({ contentId: content._id });

    let text = "";
    let source = "metadata";

    if (content.link) {
      text = await extractReadableTextFromUrl(content.link);
      if (text.length > 100) {
        source = "url-extraction";
        content.extractedText = text;
      }
    }

    const metadata = buildMetadataText({
      title: content.title,
      link: content.link,
      type: content.type,
      tags: content.tags,
      collection: content.collection,
      importance: content.importance,
      whySaved: content.whySaved,
      personalNote: content.personalNote,
      description: content.description,
      summary: content.summary,
      extractedText: text ? text.slice(0, 1200) : content.extractedText,
    });

    const rawChunks = chunkText(text, metadata);
    const chunkDocs = [];

    for (let i = 0; i < rawChunks.length; i++) {
      const chunk = rawChunks[i];
      if (!chunk) continue;
      const embedding = await getHfEmbedding(chunk, "document");

      if (embedding) {
        chunkDocs.push({
          contentId: content._id,
          userId: content.userId,
          title: content.title,
          link: content.link,
          type: content.type,
          chunkText: chunk,
          chunkIndex: i,
          embedding,
          source,
          charLength: chunk.length,
        });
      }
    }

    if (chunkDocs.length > 0) {
      await ContentChunkModel.insertMany(chunkDocs);
      content.indexingStatus = "indexed";
    } else {
      throw new Error("Failed to generate embeddings for any text chunks.");
    }

    content.lastIndexedAt = new Date();
    await content.save();
  } catch (error: any) {
    console.error(`RAG Indexing failure on content ${contentId}:`, error);
    content.indexingStatus = "failed";
    content.indexingError = error?.message || "Unknown error";
    await content.save();
  }
}
