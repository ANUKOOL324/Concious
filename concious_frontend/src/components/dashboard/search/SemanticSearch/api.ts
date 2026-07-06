import axios from "axios";
import { Backendurl } from "../../../../config";
import { getAuthHeaders } from "../../../../api/authHeaders";
import type { SemanticSearchResponse } from "./types";

export async function runSemanticSearch(query: string) {
  const response = await axios.post<SemanticSearchResponse>(
    `${Backendurl}/api/v1/search`,
    { query, limit: 6 },
    { headers: getAuthHeaders() }
  );

  return response.data;
}
