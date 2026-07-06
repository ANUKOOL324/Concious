import axios from "axios";
import { Backendurl } from "../../../../config";
import { getAuthHeaders } from "../../../../api/authHeaders";
import type { AshqnorChatResponse } from "./types";

export async function runAshqnorChat(message: string) {
  const response = await axios.post<AshqnorChatResponse>(
    `${Backendurl}/api/v1/chat`,
    { message },
    { headers: getAuthHeaders() }
  );

  return response.data;
}
