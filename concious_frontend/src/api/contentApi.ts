import axios from "axios";
import { Backendurl } from "../config";
import { getAuthHeaders } from "./authHeaders";
import {
  mapContentFromApi,
  toApiContentType,
  type Content,
  type ContentType,
  type Importance,
} from "../types/content";

export interface CreateContentInput {
  title: string;
  link: string;
  type: ContentType;
  personalNote?: string;
  summary?: string;
  tags: string[];
  collection?: string;
  whySaved?: string;
  importance: Importance;
}

export interface UploadPdfInput {
  file: File;
  title: string;
  tags: string[];
  personalNote?: string;
  summary?: string;
  collection?: string;
  whySaved?: string;
  importance: Importance;
}

interface CreateContentResponse {
  content: Record<string, unknown>;
}

export async function fetchContentList(): Promise<Content[]> {
  const response = await axios.get(`${Backendurl}/api/v1/content`, {
    headers: getAuthHeaders(),
  });

  const items = Array.isArray(response.data.content)
    ? response.data.content
    : [];

  return items.map((item: Record<string, unknown>) => mapContentFromApi(item));
}

export async function createContent(
  input: CreateContentInput
): Promise<Content> {
  const response = await axios.post<CreateContentResponse>(
    `${Backendurl}/api/v1/content`,
    {
      ...input,
      type: toApiContentType(input.type),
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return mapContentFromApi(response.data.content);
}

export async function uploadPdfContent(
  input: UploadPdfInput
): Promise<Content> {
  const formData = new FormData();
  formData.append("file", input.file);
  formData.append("title", input.title);
  formData.append("importance", input.importance);

  if (input.tags.length > 0) {
    formData.append("tags", input.tags.join(","));
  }
  if (input.personalNote) {
    formData.append("personalNote", input.personalNote);
  }
  if (input.summary) {
    formData.append("summary", input.summary);
  }
  if (input.collection) {
    formData.append("collection", input.collection);
  }
  if (input.whySaved) {
    formData.append("whySaved", input.whySaved);
  }

  const response = await axios.post<CreateContentResponse>(
    `${Backendurl}/api/v1/content/pdf`,
    formData,
    {
      headers: getAuthHeaders(),
    }
  );

  return mapContentFromApi(response.data.content);
}
