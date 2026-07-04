import axios from "axios";

export function getAuthErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return "Something went wrong. Please try again in a moment.";
  }

  const status = error.response?.status;
  const data = error.response?.data;

  // 409: duplicate username
  if (status === 409) {
    return data?.message ?? "This username is already taken. Try another one.";
  }

  // 401: unauthorized / invalid credentials
  if (status === 401) {
    return "Invalid username or password. Please try again.";
  }

  // 400: bad request / validation error
  if (status === 400) {
    if (data?.issues && Array.isArray(data.issues)) {
      return data.issues.join("\n");
    }
    return data?.message ?? "Please check your details and try again.";
  }

  // 500: internal server error
  if (status && status >= 500) {
    return "Something went wrong. Please try again in a moment.";
  }

  // Network error (no status / response)
  if (!error.response) {
    return "A network error occurred. Please check your internet connection.";
  }

  return data?.message ?? "Something went wrong. Please try again in a moment.";
}
