export type Importance = "low" | "medium" | "high";
export type IndexingStatus = "not_indexed" | "pending" | "indexed" | "failed";
export type ContentType =
  | "Youtube"
  | "Twitter"
  | "Spotify"
  | "Article"
  | "PDF"
  | "Other";
export type FilterType =
  | "ALL"
  | "Twitter"
  | "Youtube"
  | "Spotify"
  | "Article"
  | "PDF"
  | "Other";

export type ContentSortOrder = "latest" | "oldest";

export interface FileMetadata {
  provider?: string;
  publicId?: string;
  secureUrl?: string;
  resourceType?: string;
  format?: string;
  bytes?: number;
  originalFilename?: string;
  uploadedAt?: string;
}

export interface Content {
  _id: string;
  title: string;
  link: string;
  type: ContentType;
  personalNote?: string | null;
  summary?: string | null;
  tags?: string[];
  collection?: string | null;
  whySaved?: string | null;
  importance?: Importance;
  indexingStatus?: IndexingStatus;
  fileMetadata?: FileMetadata | null;
  createdAt?: string;
  updatedAt?: string;
}

function getContentTimestamp(item: Content): number {
  if (item.createdAt) {
    const parsed = Date.parse(item.createdAt);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  if (item._id.length === 24) {
    return parseInt(item._id.slice(0, 8), 16) * 1000;
  }

  return 0;
}

export function sortContentItems(
  items: Content[],
  order: ContentSortOrder
): Content[] {
  return [...items].sort((a, b) => {
    const aTime = getContentTimestamp(a);
    const bTime = getContentTimestamp(b);
    return order === "latest" ? bTime - aTime : aTime - bTime;
  });
}

export const PDF_MAX_BYTES = 10 * 1024 * 1024;

export function normalizeContentTypeFromApi(value: string): ContentType {
  switch (value?.toLowerCase().trim()) {
    case "youtube":
      return "Youtube";
    case "twitter":
      return "Twitter";
    case "spotify":
      return "Spotify";
    case "article":
      return "Article";
    case "pdf":
      return "PDF";
    default:
      return "Other";
  }
}

export function toApiContentType(type: ContentType): string {
  return type.toLowerCase();
}

export function formatContentType(value: string | null | undefined): string {
  if (!value?.trim()) {
    return "Unknown";
  }

  return normalizeContentTypeFromApi(value);
}

export function mapContentFromApi(raw: Record<string, unknown>): Content {
  const fileMetadata =
    raw.fileMetadata && typeof raw.fileMetadata === "object"
      ? (raw.fileMetadata as FileMetadata)
      : null;

  return {
    _id: String(raw._id ?? ""),
    title: String(raw.title ?? ""),
    link: String(raw.link ?? ""),
    type: normalizeContentTypeFromApi(String(raw.type ?? "other")),
    personalNote:
      typeof raw.personalNote === "string" ? raw.personalNote : null,
    summary: typeof raw.summary === "string" ? raw.summary : null,
    tags: Array.isArray(raw.tags)
      ? raw.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
    collection: typeof raw.collection === "string" ? raw.collection : null,
    whySaved: typeof raw.whySaved === "string" ? raw.whySaved : null,
    importance:
      raw.importance === "low" ||
      raw.importance === "medium" ||
      raw.importance === "high"
        ? raw.importance
        : undefined,
    indexingStatus:
      raw.indexingStatus === "not_indexed" ||
      raw.indexingStatus === "pending" ||
      raw.indexingStatus === "indexed" ||
      raw.indexingStatus === "failed"
        ? raw.indexingStatus
        : undefined,
    fileMetadata,
    createdAt:
      typeof raw.createdAt === "string"
        ? raw.createdAt
        : raw.createdAt instanceof Date
          ? raw.createdAt.toISOString()
          : undefined,
    updatedAt:
      typeof raw.updatedAt === "string"
        ? raw.updatedAt
        : raw.updatedAt instanceof Date
          ? raw.updatedAt.toISOString()
          : undefined,
  };
}
