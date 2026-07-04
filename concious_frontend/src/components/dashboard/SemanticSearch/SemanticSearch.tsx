import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { runSemanticSearch } from "./api";

interface SemanticSearchProps {
  open: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export function SemanticSearch({ open, onClose, darkMode }: SemanticSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const searchMutation = useMutation({
    mutationFn: (query: string) => runSemanticSearch(query),
  });

  function handleSearchSubmit() {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery || searchMutation.isPending) {
      return;
    }

    searchMutation.mutate(trimmedQuery);
  }

  // Search while user types (small delay so we do not call API on every key press)
  useEffect(() => {
    if (!open) {
      return;
    }

    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      searchMutation.reset();
      return;
    }

    const timer = window.setTimeout(() => {
      searchMutation.mutate(trimmedQuery);
    }, 220);

    return () => window.clearTimeout(timer);
  }, [open, searchQuery]);

  if (!open) {
    return null;
  }

  const searchResults = searchMutation.data?.results ?? [];
  const hasResults = searchResults.length > 0;

  return (
    <div className="fixed inset-0 z-40 bg-black/18 backdrop-blur-[2px]">
      <div
        className={`mx-auto mt-4 w-[min(94vw,44rem)] rounded-4xl p-3 shadow-[0_28px_80px_rgba(15,23,42,0.16)] lg:mt-5 ${
          darkMode
            ? "border border-white/10 bg-[#0f1218]/96"
            : "border border-white/80 bg-white/96"
        }`}
      >
        <div
          className={`flex items-center gap-3 rounded-2xl px-4 py-3 shadow-sm ${
            darkMode
              ? "border border-white/10 bg-slate-950/90"
              : "border border-stone-200 bg-white"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5 text-stone-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearchSubmit();
              }
              if (event.key === "Escape") {
                onClose();
              }
            }}
            placeholder="Search your brain semantically..."
            className={`min-w-0 flex-1 bg-transparent text-base outline-none ${
              darkMode
                ? "text-stone-100 placeholder:text-stone-500"
                : "text-stone-900 placeholder:text-stone-400"
            }`}
            autoFocus
          />
          <button
            type="button"
            onClick={onClose}
            className={`cursor-pointer rounded-full p-2 transition ${
              darkMode
                ? "text-stone-500 hover:bg-white/5 hover:text-stone-200"
                : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6 6 18"
              />
            </svg>
          </button>
        </div>

        <div
          className={`mt-3 max-h-[60vh] overflow-y-auto rounded-2xl ${
            darkMode
              ? "border border-white/10 bg-slate-950/80"
              : "border border-stone-200 bg-white"
          }`}
        >
          {searchMutation.isPending && (
            <p
              className={`px-5 py-4 text-sm ${
                darkMode ? "text-stone-400" : "text-stone-500"
              }`}
            >
              Searching your saved content...
            </p>
          )}

          {!searchMutation.isPending && !hasResults && (
            <p
              className={`px-5 py-4 text-sm ${
                darkMode ? "text-stone-400" : "text-stone-500"
              }`}
            >
              Search suggestions will appear here as ranked results.
            </p>
          )}

          {searchResults.map((result, index) => (
            <a
              key={`${result._id ?? result.link ?? index}`}
              href={result.link ?? "#"}
              target="_blank"
              rel="noreferrer"
              className={`flex items-start gap-3 px-5 py-4 transition last:border-b-0 ${
                darkMode
                  ? "border-b border-white/6 hover:bg-white/5"
                  : "border-b border-stone-100 hover:bg-stone-50"
              }`}
            >
              <span
                className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full ${
                  darkMode
                    ? "bg-white/8 text-stone-300"
                    : "bg-stone-100 text-stone-700"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-sm font-semibold ${
                    darkMode ? "text-stone-100" : "text-stone-900"
                  }`}
                >
                  {result.title?.trim() || "Untitled content"}
                </p>
                <p
                  className={`mt-1 text-xs ${
                    darkMode ? "text-stone-400" : "text-stone-500"
                  }`}
                >
                  {result.type || "Unknown"} •{" "}
                  {typeof result.similarity === "number"
                    ? `${(result.similarity * 100).toFixed(1)}% match`
                    : "ranked result"}
                </p>
                {result.link && (
                  <p
                    className={`mt-1 truncate text-xs ${
                      darkMode ? "text-violet-300" : "text-violet-600"
                    }`}
                  >
                    {result.link}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
