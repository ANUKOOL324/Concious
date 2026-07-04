import axios from "axios";
import { Backendurl } from "../config";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "./Card";
import type { Content } from "../types/content";

async function fetchSharedBrainContent(hash: string) {
  const response = await axios.get(`${Backendurl}/api/v1/brain/${hash}`);
  return response.data;
}

export function Sharedbrain() {
  const { hash } = useParams<{ hash: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["shared-brain", hash],
    queryFn: () => fetchSharedBrainContent(hash!),
    enabled: !!hash,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-stone-100 px-4">
        <p className="text-sm text-stone-600">Loading shared brain...</p>
      </div>
    );
  }

  if (error || !data || !data.content) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-stone-100 px-4">
        <p className="text-sm text-stone-600">Invalid link</p>
      </div>
    );
  }

  const contentList: Content[] = data.content;
  const itemCount = contentList.length;

  return (
    <div className="min-h-dvh bg-[linear-gradient(180deg,#ffffff_0%,#f8f8fb_45%,#f3f4f6_100%)]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-6 border-b border-stone-200/80 pb-5 sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-500 sm:text-sm">
            Shared brain
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl lg:text-4xl">
            {data.username}
          </h1>
          <p className="mt-2 text-sm text-stone-500 sm:text-base">
            {itemCount} saved {itemCount === 1 ? "item" : "items"}
          </p>
        </header>

        {itemCount === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-12 text-center">
            <p className="text-sm text-stone-500 sm:text-base">
              This brain has no public content yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 min-[480px]:grid-cols-2 min-[480px]:gap-x-4 min-[480px]:gap-y-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
            {contentList.map((item) => (
              <div key={item._id} className="min-w-0 w-full">
                <Card
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
                  readOnly={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
