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

export interface Content {
  _id: string;
  title: string;
  link: string;
  type: "Youtube" | "Twitter" | "Spotify" | "Other";
}

interface CardProps {
  _id: string;
  title: string;
  link: string;
  type: "Youtube" | "Twitter" | "Spotify" | "Other";
  darkMode?: boolean;
}

interface UpdateTitleArgs {
  id: string;
  title: string;
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

async function updateTitle({ id, title }: UpdateTitleArgs) {
  const res = await axios.patch(
    `${Backendurl}/api/v1/content/${id}`,
    { title },
    {
      headers: {
        authorization: localStorage.getItem("Token"),
      },
    }
  );

  return res.data;
}

async function deleteContent(id: string) {
  await axios.delete(`${Backendurl}/api/v1/content/${id}`, {
    headers: {
      authorization: localStorage.getItem("Token"),
    },
  });
}

export function Card({ _id, title, link, type, darkMode = false }: CardProps) {
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

  const queryClient = useQueryClient();

  const mutation = useMutation<Content, Error, UpdateTitleArgs>({
    mutationFn: updateTitle,
    onSuccess: (updatedContent) => {
      queryClient.setQueryData<Content[]>(["content"], (old = []) =>
        old.map((item) =>
          item._id === updatedContent._id ? updatedContent : item
        )
      );
      toast.success("Title updated!");
      setEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      toast.success("Content deleted");
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

  function saveTitle() {
    if (!newTitle.trim() || newTitle === title) {
      setEditing(false);
      return;
    }

    mutation.mutate({ id: _id, title: newTitle });
  }

  return (
    <div
      className={`min-h-[260px] w-full rounded-[1.6rem] border p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(15,23,42,0.12)] ${
        darkMode
          ? "border-white/8 bg-slate-950/76 text-stone-100"
          : "border-stone-200/80 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-md">
          {typeIcon}

          {editing ? (
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => e.key === "Enter" && saveTitle()}
              className={`rounded border px-2 py-1 text-sm focus:outline-none ${
                darkMode
                  ? "border-white/10 bg-slate-800 text-white"
                  : "border-stone-300 bg-white text-stone-900"
              }`}
              autoFocus
            />
          ) : (
            <span
              onClick={() => setEditing(true)}
              className={`cursor-pointer hover:underline ${
                darkMode ? "text-stone-100" : "text-stone-900"
              }`}
            >
              {title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Sbutton
            ProvoFunc={copyLink}
            css={
              darkMode
                ? "text-stone-400 hover:text-violet-300"
                : "text-gray-500 hover:text-purple-600"
            }
            StartIcon={<ShareIcon />}
          />
          <Sbutton
            ProvoFunc={() => deleteMutation.mutate(_id)}
            css={
              darkMode
                ? "text-stone-400 hover:text-violet-300"
                : "text-gray-500 hover:text-purple-600"
            }
            StartIcon={<Trashicon />}
          />
        </div>
      </div>

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
