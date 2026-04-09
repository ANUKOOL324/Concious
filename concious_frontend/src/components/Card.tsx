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
}

interface UpdateTitleArgs {
  id: string;
  title: string;
}

const selectType = {
  Spotify: <SpotifyIcon />,
  Twitter: <TwitterIcon />,
  Youtube: <YoutubecardIcon />,
  Other: <OtherIcon />,
};

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

export function Card({ _id, title, link, type }: CardProps) {
  const embedUrl = type === "Youtube" ? getYouTubeEmbedUrl(link) : null;
  const spotifyEmbedUrl = type === "Spotify" ? getSpotifyEmbedUrl(link) : null;

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
      toast.success("Title updated !");
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
      toast.success("Link copied 🔗");
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
      className="p-4 min-h-[260px] bg-white rounded-md shadow-lg shadow-purple-200/40 w-95 border-2
  border-dashed
  border-gray-400/40
  "
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-md">
          {selectType[type]}

          {editing ? (
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => e.key === "Enter" && saveTitle()}
              className="border px-2 py-1 rounded text-sm focus:outline-none"
              autoFocus
            />
          ) : (
            <span
              onClick={() => setEditing(true)}
              className="cursor-pointer hover:underline"
            >
              {title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 ">
          {" "}
          <Sbutton
            ProvoFunc={copyLink}
            css="text-gray-500 hover:text-purple-600 "
            StartIcon={<ShareIcon />}
          />
          <Sbutton
            ProvoFunc={() => deleteMutation.mutate(_id)}
            css="text-gray-500 hover:text-purple-600"
            StartIcon={<Trashicon />}
          />
        </div>
      </div>
      <div className="pt-4">
        {type === "Youtube" && embedUrl && (
          <iframe
            className="w-full aspect-video rounded"
            src={embedUrl}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        {type === "Youtube" && !embedUrl && (
          <p className="text-sm text-red-500">Invalid YouTube link</p>
        )}

        {type === "Twitter" && (
          <div className="h-[200px] overflow-auto rounded bg-gray-100">
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
            className="rounded aspect-16/5"
          />
        )}

        {type === "Spotify" && !spotifyEmbedUrl && (
          <p className="text-sm text-red-500">Invalid Spotify link</p>
        )}
      </div>
    </div>
  );
}
