// Step 2 of RAG: scrape readable text from a saved link URL
export async function extractReadableTextFromUrl(url: string): Promise<string> {
  if (!url) return "";
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`HTTP Status ${response.status}`);
    }

    const html = await response.text();

    let cleanText = html
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
      .replace(/<svg[^>]*>([\s\S]*?)<\/svg>/gi, "")
      .replace(/<noscript[^>]*>([\s\S]*?)<\/noscript>/gi, "")
      .replace(/<iframe[^>]*>([\s\S]*?)<\/iframe>/gi, "");

    const paragraphs: string[] = [];
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let match;
    while ((match = pRegex.exec(cleanText)) !== null) {
      const matchGroup = match[1] || "";
      const pText = matchGroup
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (pText.length > 20) {
        paragraphs.push(pText);
      }
    }

    let text = paragraphs.join("\n\n");

    if (!text || text.length < 150) {
      text = cleanText
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    return text.slice(0, 12000);
  } catch (error) {
    console.error(`Web scraping failed for ${url}:`, error);
    return "";
  }
}
