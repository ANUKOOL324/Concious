import axios from "axios";

export function getAuthErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return "Something went wrong. Please try again in a moment.";
  }

  const status = error.response?.status;
  const data = error.response?.data;

  if (status === 409) {
    return data?.message ?? "This username is already taken. Try another one.";
  }

  if (status === 401) {
    return "Invalid username or password. Please try again.";
  }

  if (status === 400) {
    if (data?.issues && Array.isArray(data.issues)) {
      return data.issues.join("\n");
    }
    return data?.message ?? "Please check your details and try again.";
  }

  if (status && status >= 500) {
    return "Something went wrong. Please try again in a moment.";
  }

  if (!error.response) {
    return "A network error occurred. Please check your internet connection.";
  }

  return data?.message ?? "Something went wrong. Please try again in a moment.";
}
