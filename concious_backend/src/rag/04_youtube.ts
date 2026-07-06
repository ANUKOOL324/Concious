const YOUTUBE_VIDEO_ID_PATTERN = /^[\w-]{11}$/;

function isValidYoutubeVideoId(value: string | undefined | null): value is string {
  return Boolean(value && YOUTUBE_VIDEO_ID_PATTERN.test(value));
}

export function parseYoutubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");

    if (host === "youtu.be") {
      const candidate = parsed.pathname.split("/").filter(Boolean)[0];
      return isValidYoutubeVideoId(candidate) ? candidate : null;
    }

    if (!host.endsWith("youtube.com")) {
      return null;
    }

    const queryId = parsed.searchParams.get("v");
    if (isValidYoutubeVideoId(queryId)) {
      return queryId;
    }

    const pathParts = parsed.pathname.split("/").filter(Boolean);
    const route = pathParts[0];
    const pathId = pathParts[1];

    if (
      (route === "shorts" || route === "embed" || route === "live") &&
      isValidYoutubeVideoId(pathId)
    ) {
      return pathId;
    }
  } catch {
    return null;
  }

  return null;
}

export type YoutubeTranscriptFetchResult =
  | {
      ok: true;
      text: string;
      segmentCount: number;
    }
  | {
      ok: false;
      reason: string;
      skipped?: boolean;
    };

type TranscriptSegment = {
  text?: string;
};

export async function fetchYoutubeTranscript(
  videoId: string
): Promise<YoutubeTranscriptFetchResult> {
  if (!isValidYoutubeVideoId(videoId)) {
    return {
      ok: false,
      reason: "Invalid YouTube video ID",
      skipped: true,
    };
  }

  try {
    const { YoutubeTranscript } = await import("youtube-transcript");
    const segments = (await YoutubeTranscript.fetchTranscript(videoId)) as TranscriptSegment[];

    if (!Array.isArray(segments) || segments.length === 0) {
      return {
        ok: false,
        reason: "No transcript segments were returned",
        skipped: true,
      };
    }

    const text = segments
      .map((segment) => segment.text?.trim() || "")
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (text.length < 50) {
      return {
        ok: false,
        reason: "Transcript text was too short to index",
        skipped: true,
      };
    }

    return {
      ok: true,
      text: text.slice(0, 50000),
      segmentCount: segments.length,
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Transcript fetch failed";
    console.warn(`YouTube transcript fetch failed for ${videoId}:`, reason);

    return {
      ok: false,
      reason,
    };
  }
}
