import { Card } from "../Card";
import type { Content } from "../../types/content";

interface ContentGridProps {
  items?: Content[];
  isLoading: boolean;
  hasError: boolean;
  darkMode: boolean;
}

export function ContentGrid({
  items,
  isLoading,
  hasError,
  darkMode,
}: ContentGridProps) {
  const textClass = darkMode ? "text-stone-300" : "text-stone-600";

  if (isLoading) {
    return (
      <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
        <p className={textClass}>Loading...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
        <p className={textClass}>Something went wrong</p>
      </div>
    );
  }

  return (
    <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
      <div className="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] sm:gap-8">
        {items?.map((item) => (
          <Card
            key={item._id}
            _id={item._id}
            title={item.title}
            link={item.link}
            type={item.type}
            personalNote={item.personalNote}
            summary={item.summary}
            tags={item.tags}
            collection={item.collection}
            whySaved={item.whySaved}
            importance={item.importance}
            indexingStatus={item.indexingStatus}
            darkMode={darkMode}
          />
        ))}
      </div>
    </div>
  );
}
