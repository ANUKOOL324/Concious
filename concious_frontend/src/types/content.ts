export type Importance = "low" | "medium" | "high";
export type IndexingStatus = "not_indexed" | "pending" | "indexed" | "failed";
export type FilterType = "ALL" | "Twitter" | "Youtube" | "Spotify";

export interface Content {
  _id: string;
  title: string;
  link: string;
  type: "Youtube" | "Twitter" | "Spotify" | "Other";
  personalNote?: string | null;
  summary?: string | null;
  tags?: string[];
  collection?: string | null;
  whySaved?: string | null;
  importance?: Importance;
  indexingStatus?: IndexingStatus;
}
