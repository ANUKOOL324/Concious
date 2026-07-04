import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TwitterIcon } from "../Icon/TwitterIcon";
import { ShareIcon } from "../Icon/ShareIcon";
import { Sbutton } from "./Sbutton";
import { Backendurl } from "../config";
import { SpotifyIcon } from "../Icon/SpotifyIcon";
import { OtherIcon } from "./OtherIcon";
import { YoutubecardIcon } from "../Icon/YotubecardIcon";
import { Trashicon } from "../Icon/Trashicon";

type Importance = "low" | "medium" | "high";
type IndexingStatus = "not_indexed" | "pending" | "indexed" | "failed";

export interface Content {
  _id: string;
  title: string;
  link: string;
  type: "Youtube" | "Twitter" | "Spotify" | "Other";
  personalNote?: string | null;
  summary?: string | null;
  tags?: string[];
  collection?: string | null;
  whySaved?: string | null;
  importance?: Importance;
  indexingStatus?: IndexingStatus;
}

interface CardProps extends Content {
  darkMode?: boolean;
  readOnly?: boolean;
}

interface UpdateContentArgs {
  id: string;
  title: string;
  personalNote?: string;
  summary?: string;
  tags: string[];
  collection?: string;
  whySaved?: string;
  importance: Importance;
}

function getYouTubeEmbedUrl(link: string): string | null {
  try {
    const url = new URL(link);

    if (url.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${url.pathname}`;
    }

    if (url.hostname.includes("youtube.com")) {
      const videoId = url.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    return null;
  } catch {
    return null;
  }
}

function getSpotifyEmbedUrl(link: string): string | null {
  try {
    const url = new URL(link);

    if (url.hostname.includes("open.spotify.com")) {
      return `https://open.spotify.com/embed${url.pathname}`;
    }

    return null;
  } catch {
    return null;
  }
}

function getHostname(link: string): string | null {
  try {
    const url = new URL(link);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function trimToLimit(value: string, maxLength: number) {
  return value.trim().slice(0, maxLength) || undefined;
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 10);
}

function getIndexingLabel(status?: IndexingStatus) {
  if (status === "pending") return "Indexing...";
  if (status === "indexed") return "AI-ready";
  if (status === "failed") return "Index failed";
  return "Not indexed";
}

async function updateContent({ id, ...payload }: UpdateContentArgs) {
  const res = await axios.patch(`${Backendurl}/api/v1/content/${id}`, payload, {
    headers: {
      authorization: localStorage.getItem("Token"),
    },
  });

  return res.data;
}

async function deleteContent(id: string) {
  await axios.delete(`${Backendurl}/api/v1/content/${id}`, {
    headers: {
      authorization: localStorage.getItem("Token"),
    },
  });
}

export function Card({
  _id,
  title,
  link,
  type,
  personalNote,
  summary,
  tags = [],
  collection,
  whySaved,
  importance = "medium",
  indexingStatus,
  darkMode = false,
  readOnly = false,
}: CardProps) {
  const embedUrl = type === "Youtube" ? getYouTubeEmbedUrl(link) : null;
  const spotifyEmbedUrl = type === "Spotify" ? getSpotifyEmbedUrl(link) : null;
  const articleHost = type === "Other" ? getHostname(link) : null;
  const typeIcon =
    type === "Spotify" ? (
      <SpotifyIcon />
    ) : type === "Twitter" ? (
      <TwitterIcon color={darkMode ? "#f5f5f4" : "#111827"} />
    ) : type === "Youtube" ? (
      <YoutubecardIcon />
    ) : (
      <OtherIcon darkMode={darkMode} />
    );

  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newPersonalNote, setNewPersonalNote] = useState(personalNote ?? "");
  const [newSummary, setNewSummary] = useState(summary ?? "");
  const [newTags, setNewTags] = useState(tags.join(", "));
  const [newCollection, setNewCollection] = useState(collection ?? "");
  const [newWhySaved, setNewWhySaved] = useState(whySaved ?? "");
  const [newImportance, setNewImportance] = useState<Importance>(importance);

  const queryClient = useQueryClient();
  const visibleTags = tags.filter(Boolean).slice(0, 4);
  const indexingLabel = getIndexingLabel(indexingStatus);

  const mutation = useMutation<Content, Error, UpdateContentArgs>({
    mutationFn: updateContent,
    onSuccess: (updatedContent) => {
      queryClient.setQueryData<Content[]>(["content"], (old = []) =>
        old.map((item) =>
          item._id === updatedContent._id ? updatedContent : item
        )
      );
      toast.success("Content updated!");
      setEditing(false);
    },
    onError: () => {
      toast.error("Failed to update content");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      toast.success("Content deleted");
    },
    onError: () => {
      toast.error("Failed to delete content");
    },
  });

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  }

  function openEditor() {
    setNewTitle(title);
    setNewPersonalNote(personalNote ?? "");
    setNewSummary(summary ?? "");
    setNewTags(tags.join(", "));
    setNewCollection(collection ?? "");
    setNewWhySaved(whySaved ?? "");
    setNewImportance(importance);
    setEditing(true);
  }

  function saveContent() {
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) {
      toast.error("Title is required");
      return;
    }

    mutation.mutate({
      id: _id,
      title: trimmedTitle,
      personalNote: trimToLimit(newPersonalNote, 1000),
      summary: trimToLimit(newSummary, 1000),
      tags: parseTags(newTags),
      collection: trimToLimit(newCollection, 80),
      whySaved: trimToLimit(newWhySaved, 500),
      importance: newImportance,
    });
  }

  const inputClass = `w-full rounded-xl border px-3 py-2 text-sm outline-none transition ${
    darkMode
      ? "border-white/10 bg-slate-900/80 text-stone-100 placeholder:text-stone-500 focus:border-violet-400/50"
      : "border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:border-violet-300"
  }`;

  const badgeClass = darkMode
    ? "border-white/10 bg-white/6 text-stone-300"
    : "border-stone-200 bg-stone-50 text-stone-600";

  return (
    <div
      className={`min-h-[260px] w-full rounded-[1.6rem] border p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(15,23,42,0.12)] ${
        darkMode
          ? "border-white/8 bg-slate-950/76 text-stone-100"
          : "border-stone-200/80 bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-md">
          {typeIcon}
          {readOnly ? (
            <span
              className={`min-w-0 truncate ${
                darkMode ? "text-stone-100" : "text-stone-900"
              }`}
            >
              {title}
            </span>
          ) : (
            <button
              type="button"
              onClick={openEditor}
              className={`min-w-0 cursor-pointer truncate text-left hover:underline ${
                darkMode ? "text-stone-100" : "text-stone-900"
              }`}
            >
              {title}
            </button>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Sbutton
            ProvoFunc={copyLink}
            css={
              darkMode
                ? "text-stone-400 hover:text-violet-300"
                : "text-gray-500 hover:text-purple-600"
            }
            StartIcon={<ShareIcon />}
          />
          {!readOnly && (
            <Sbutton
              ProvoFunc={() => deleteMutation.mutate(_id)}
              css={
                darkMode
                  ? "text-stone-400 hover:text-violet-300"
                  : "text-gray-500 hover:text-purple-600"
              }
              StartIcon={<Trashicon />}
            />
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass}`}>
          {indexingLabel}
        </span>
        {collection && (
          <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass}`}>
            {collection}
          </span>
        )}
        {importance === "high" && (
          <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${darkMode ? "border-rose-300/20 bg-rose-400/10 text-rose-200" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
            High importance
          </span>
        )}
        {visibleTags.map((tag) => (
          <span key={tag} className={`rounded-full border px-2.5 py-1 text-xs ${badgeClass}`}>
            #{tag}
          </span>
        ))}
      </div>

      {!readOnly && editing && (
        <div className={`mt-4 rounded-2xl border p-3 ${darkMode ? "border-white/10 bg-slate-900/50" : "border-stone-200 bg-stone-50"}`}>
          <div className="space-y-2">
            <input
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              placeholder="Title"
              className={inputClass}
            />
            <textarea
              value={newPersonalNote}
              onChange={(event) => setNewPersonalNote(event.target.value)}
              maxLength={1000}
              placeholder="Personal note"
              className={`${inputClass} min-h-[70px] resize-none`}
            />
            <textarea
              value={newSummary}
              onChange={(event) => setNewSummary(event.target.value)}
              maxLength={1000}
              placeholder="Summary"
              className={`${inputClass} min-h-[70px] resize-none`}
            />
            <input
              value={newTags}
              onChange={(event) => setNewTags(event.target.value)}
              placeholder="Tags: ai, focus, habits"
              className={inputClass}
            />
            <input
              value={newCollection}
              onChange={(event) => setNewCollection(event.target.value)}
              maxLength={80}
              placeholder="Collection"
              className={inputClass}
            />
            <textarea
              value={newWhySaved}
              onChange={(event) => setNewWhySaved(event.target.value)}
              maxLength={500}
              placeholder="Why saved"
              className={`${inputClass} min-h-[64px] resize-none`}
            />
            <select
              value={newImportance}
              onChange={(event) => setNewImportance(event.target.value as Importance)}
              className={inputClass}
            >
              <option value="low">Low importance</option>
              <option value="medium">Medium importance</option>
              <option value="high">High importance</option>
            </select>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className={`cursor-pointer rounded-xl px-3 py-2 text-sm font-medium transition ${
                darkMode
                  ? "border border-white/10 bg-slate-950 text-stone-200 hover:bg-slate-800"
                  : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-100"
              }`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveContent}
              disabled={mutation.isPending}
              className={`cursor-pointer rounded-xl px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                darkMode
                  ? "bg-violet-500 text-white hover:bg-violet-400"
                  : "bg-stone-950 text-white hover:bg-stone-800"
              }`}
            >
              {mutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      <div className="pt-4">
        {type === "Youtube" && embedUrl && (
          <iframe
            className="aspect-video w-full rounded-xl"
            src={embedUrl}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        {type === "Youtube" && !embedUrl && (
          <p className="text-sm text-rose-500">Invalid YouTube link</p>
        )}

        {type === "Twitter" && (
          <div
            className={`h-[200px] overflow-auto rounded-xl ${
              darkMode ? "bg-slate-900" : "bg-stone-100"
            }`}
          >
            <blockquote className="twitter-tweet">
              <a href={link.replace("x.com", "twitter.com")}></a>
            </blockquote>
            <script
              async
              src="https://platform.twitter.com/widgets.js"
              charSet="utf-8"
            />
          </div>
        )}

        {type === "Spotify" && spotifyEmbedUrl && (
          <iframe
            src={spotifyEmbedUrl}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="aspect-16/5 rounded-xl"
          />
        )}

        {type === "Spotify" && !spotifyEmbedUrl && (
          <p className="text-sm text-rose-500">Invalid Spotify link</p>
        )}

        {type === "Other" && (
          <div
            className={`rounded-xl border p-4 ${
              darkMode
                ? "border-white/10 bg-slate-900/70"
                : "border-stone-200 bg-stone-50"
            }`}
          >
            <p
              className={`text-xs uppercase tracking-[0.22em] ${
                darkMode ? "text-stone-400" : "text-stone-500"
              }`}
            >
              Article
            </p>
            <p
              className={`mt-2 text-sm font-semibold ${
                darkMode ? "text-stone-100" : "text-stone-900"
              }`}
            >
              {title?.trim() || "Untitled article"}
            </p>
            <p
              className={`mt-1 text-xs ${
                darkMode ? "text-stone-400" : "text-stone-600"
              }`}
            >
              {articleHost ?? "External website"}
            </p>
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className={`mt-4 inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition ${
                darkMode
                  ? "bg-violet-500/18 text-violet-100 hover:bg-violet-500/28"
                  : "bg-violet-100 text-violet-700 hover:bg-violet-200"
              }`}
            >
              Open article
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
