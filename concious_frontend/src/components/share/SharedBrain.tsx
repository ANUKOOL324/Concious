import axios from "axios";
import { Backendurl } from "../../config";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "../content/Card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getUsername, logged } from "../../HelperFunction/authcheck";
import { mapContentFromApi, type Content } from "../../types/content";

async function fetchSharedBrainContent(hash: string) {
  const response = await axios.get(`${Backendurl}/api/v1/brain/${hash}`);
  const content = Array.isArray(response.data.content)
    ? response.data.content.map((item: Record<string, unknown>) =>
        mapContentFromApi(item)
      )
    : [];

  return {
    ...response.data,
    content,
  };
}

function getInitials(username: string) {
  const trimmed = username.trim();
  if (!trimmed) {
    return "U";
  }

  return trimmed.slice(0, 2).toUpperCase();
}

function getAvatarImageUrl(username: string) {
  const seed = encodeURIComponent(username.trim() || "concious-user");
  return `https://api.dicebear.com/9.x/notionists/png?seed=${seed}&size=64&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc`;
}

function SharedBrainUserBadge({
  username,
  size = "md",
}: {
  username: string;
  size?: "sm" | "md";
}) {
  const avatarSize = size === "sm" ? "size-8" : "size-10";

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span
        className={`truncate font-semibold text-stone-900 ${
          size === "sm" ? "max-w-[5.5rem] text-xs" : "max-w-[8rem] text-sm sm:text-base"
        }`}
      >
        {username}
      </span>
      <Avatar className={`${avatarSize} shrink-0 ring-1 ring-stone-200/80`}>
        <AvatarImage
          src={getAvatarImageUrl(username)}
          alt={`${username} avatar`}
        />
        <AvatarFallback className="bg-violet-100 text-violet-700">
          {getInitials(username)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
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
  const ownerUsername = String(data.username ?? "User");
  const viewerUsername = getUsername();
  const showViewerBadge =
    logged() && viewerUsername.toLowerCase() !== ownerUsername.toLowerCase();

  return (
    <div className="min-h-dvh bg-[linear-gradient(180deg,#ffffff_0%,#f8f8fb_45%,#f3f4f6_100%)]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <header className="mb-4 flex items-center justify-between gap-4 border-b border-stone-200/80 pb-3 sm:mb-5">
          <div className="min-w-0">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-violet-500">
              Shared brain
            </p>
            <p className="mt-0.5 text-sm text-stone-500">
              {itemCount} saved {itemCount === 1 ? "item" : "items"}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            {showViewerBadge ? (
              <SharedBrainUserBadge username={viewerUsername} size="sm" />
            ) : null}
            <SharedBrainUserBadge username={ownerUsername} />
          </div>
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
                  fileMetadata={item.fileMetadata}
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
