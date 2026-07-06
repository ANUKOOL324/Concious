import type { ContentSortOrder } from "../../../types/content";

interface ContentSortBarProps {
  darkMode: boolean;
  sortOrder: ContentSortOrder;
  onSortOrderChange: (order: ContentSortOrder) => void;
}

const SORT_OPTIONS: { value: ContentSortOrder; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
];

export function ContentSortBar({
  darkMode,
  sortOrder,
  onSortOrderChange,
}: ContentSortBarProps) {
  return (
    <div className="mt-4 flex items-center justify-end gap-2 sm:mt-5">
      <div
        role="group"
        aria-label="Sort saved content"
        className={`inline-flex items-center gap-1 rounded-full border p-1 ${
          darkMode
            ? "border-white/10 bg-white/5"
            : "border-stone-200/90 bg-white/80"
        }`}
      >
        {SORT_OPTIONS.map((option) => {
          const isActive = sortOrder === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSortOrderChange(option.value)}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition active:scale-[0.98] sm:px-4 sm:py-2 ${
                isActive
                  ? darkMode
                    ? "bg-stone-100 text-stone-950 shadow-sm"
                    : "bg-stone-950 text-white shadow-sm"
                  : darkMode
                    ? "text-stone-300 hover:bg-white/8 hover:text-stone-100"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
