// Shared auth header for dashboard API calls
export function getAuthHeaders() {
  return {
    authorization: localStorage.getItem("Token"),
  };
}
