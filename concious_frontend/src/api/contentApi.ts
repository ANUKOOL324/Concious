import axios from "axios";
import { Backendurl } from "../config";
import { getAuthHeaders } from "./authHeaders";
import type { Content } from "../types/content";

export async function fetchContentList(): Promise<Content[]> {
  const response = await axios.get(`${Backendurl}/api/v1/content`, {
    headers: getAuthHeaders(),
  });

  return response.data.content;
}
