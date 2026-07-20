export function getAuthHeaders() {
  return {
    authorization: localStorage.getItem("Token"),
  };
}
