import { Card } from "../../content/Card";
import type { Content } from "../../../types/content";

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
      <div className="mt-5 flex min-h-[12rem] items-center justify-center">
        <div className="flex flex-col items-center gap-3 py-12">
          <span
            aria-hidden="true"
            className={`inline-block size-10 animate-spin rounded-full border-[3px] border-t-transparent ${
              darkMode
                ? "border-violet-400/25 border-t-violet-300"
                : "border-violet-200 border-t-violet-500"
            }`}
          />
          <p
            className={`text-sm font-medium tracking-wide ${
              darkMode ? "text-stone-400" : "text-stone-500"
            }`}
          >
            Brain..
          </p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="mt-3 sm:mt-4">
        <p className={textClass}>Something went wrong</p>
      </div>
    );
  }

  return (
    <div className="mt-2 sm:mt-2.5">
      <div className="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] sm:gap-5 lg:gap-6">
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
            fileMetadata={item.fileMetadata}
            darkMode={darkMode}
          />
        ))}
      </div>
    </div>
  );
}
