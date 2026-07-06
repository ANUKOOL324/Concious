import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { formatContentType } from "../../../../types/content";
import { runSemanticSearch } from "./api";

interface SemanticSearchDropdownProps {
  query: string;
  darkMode: boolean;
}

function matchBadgeClass(score: number, darkMode: boolean) {
  if (score >= 0.8) {
    return darkMode
      ? "bg-emerald-500/18 text-emerald-200"
      : "bg-emerald-50 text-emerald-700";
  }
  if (score >= 0.5) {
    return darkMode
      ? "bg-violet-500/18 text-violet-200"
      : "bg-violet-50 text-violet-700";
  }
  return darkMode
    ? "bg-white/8 text-stone-400"
    : "bg-stone-100 text-stone-600";
}

export function SemanticSearchDropdown({
  query,
  darkMode,
}: SemanticSearchDropdownProps) {
  const searchMutation = useMutation({
    mutationFn: (searchQuery: string) => runSemanticSearch(searchQuery),
  });
  const { mutate, reset, isPending, data } = searchMutation;

  const trimmedQuery = query.trim();

  useEffect(() => {
    if (!trimmedQuery) {
      reset();
      return;
    }

    const timer = window.setTimeout(() => {
      mutate(trimmedQuery);
    }, 320);

    return () => window.clearTimeout(timer);
  }, [trimmedQuery, mutate, reset]);

  if (!trimmedQuery) {
    return null;
  }

  const activeData = data?.query === trimmedQuery ? data : undefined;
  const searchResults = activeData?.results ?? [];
  const resultCount = searchResults.length;

  const panelClass = darkMode
    ? "border-white/12 bg-[#0f1218]/96 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
    : "border-stone-200/90 bg-white/96 shadow-[0_18px_45px_rgba(15,23,42,0.14)]";

  return (
    <div
      className={`absolute left-0 right-0 top-[calc(100%+0.45rem)] z-50 overflow-hidden rounded-2xl border backdrop-blur-xl ${panelClass}`}
      role="listbox"
      aria-label="Search suggestions"
    >
      <div
        className={`flex items-center gap-3 border-b px-3 py-2 text-xs ${
          darkMode
            ? "border-white/8 bg-white/3 text-stone-400"
            : "border-stone-100 bg-stone-50/80 text-stone-500"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          {isPending ? (
            <>
              <span
                className={`inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-t-transparent ${
                  darkMode ? "border-violet-300" : "border-violet-500"
                }`}
              />
              <span>Searching...</span>
            </>
          ) : (
            <span>
              {resultCount > 0
                ? `${resultCount} result${resultCount === 1 ? "" : "s"}`
                : "No matches"}
            </span>
          )}
        </div>
      </div>

      <ul className="max-h-72 overflow-y-auto py-1">
        {!isPending && resultCount === 0 && (
          <li
            className={`px-3 py-3 text-sm ${
              darkMode ? "text-stone-400" : "text-stone-500"
            }`}
          >
            Try words from a title, tag, or personal note in your brain.
          </li>
        )}

        {searchResults.map((result, index) => {
          const score =
            typeof result.similarity === "number" ? result.similarity : 0;
          const scoreLabel =
            typeof result.similarity === "number"
              ? `${(result.similarity * 100).toFixed(0)}%`
              : "--";

          return (
            <li key={`${result._id ?? result.link ?? index}`}>
              <a
                href={result.link ?? "#"}
                target="_blank"
                rel="noreferrer"
                role="option"
                className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 transition ${
                  darkMode
                    ? "hover:bg-white/6"
                    : "hover:bg-violet-50/70"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[0.65rem] font-bold uppercase ${
                    darkMode
                      ? "bg-white/8 text-stone-300"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {formatContentType(result.type).slice(0, 2)}
                </span>

                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm font-medium ${
                      darkMode ? "text-stone-100" : "text-stone-900"
                    }`}
                  >
                    {result.title?.trim() || "Untitled content"}
                  </p>
                  <p
                    className={`truncate text-xs ${
                      darkMode ? "text-stone-500" : "text-stone-500"
                    }`}
                  >
                    {formatContentType(result.type)}
                    {result.link ? ` - ${result.link}` : ""}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${matchBadgeClass(score, darkMode)}`}
                >
                  {scoreLabel}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
