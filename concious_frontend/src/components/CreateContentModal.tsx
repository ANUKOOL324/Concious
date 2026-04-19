import { useRef, useState } from "react";
import { CrossIcon } from "../Icon/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import { Backendurl } from "../config";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateProps {
  open: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

interface Content {
  _id: string;
  title: string;
  link: string;
  type: string;
}

type Types = "Youtube" | "Twitter" | "Spotify" | "Other" | "initial";

export function CreateContentModal({
  open,
  onClose,
  darkMode = false,
}: CreateProps) {
  const titleRef = useRef<HTMLInputElement | null>(null);
  const linkRef = useRef<HTMLInputElement | null>(null);
  const [type, setType] = useState<Types>("initial");

  const queryClient = useQueryClient();

  async function createContent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;

    const res = await axios.post(
      `${Backendurl}/api/v1/content`,
      {
        title,
        link,
        type,
      },
      {
        headers: {
          authorization: localStorage.getItem("Token"),
        },
      }
    );

    return res.data;
  }

  const mutation = useMutation({
    mutationFn: createContent,
    onSuccess: (newContent: Content) => {
      queryClient.setQueryData<Content[]>(["content"], (old = []) => [
        ...old,
        newContent,
      ]);
      onClose();
      setType("initial");
    },
  });

  if (!open) return null;

  return (
    <div>
      <div className={`fixed top-0 left-0 h-dvh w-full ${darkMode ? "bg-black/70" : "bg-slate-900/60"}`} />
      <div className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center px-4">
        <div
          className={`w-full max-w-xl rounded-[1.7rem] p-5 shadow-[0_30px_80px_rgba(15,23,42,0.25)] ${
            darkMode
              ? "border border-white/10 bg-slate-950/95 text-stone-100"
              : "border border-stone-200 bg-white text-stone-900"
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className={`text-[0.68rem] font-semibold uppercase tracking-[0.28em] ${darkMode ? "text-violet-300" : "text-violet-500"}`}>
                Create content
              </p>
              <h2 className="mt-1 text-xl font-semibold">Save something worth revisiting</h2>
            </div>
            <button className="cursor-pointer rounded-full p-2" onClick={onClose}>
              <CrossIcon />
            </button>
          </div>

          <Input darkMode={darkMode} reference={titleRef} placeholder="Title" />
          <Input darkMode={darkMode} reference={linkRef} placeholder="Link" />
          <h1 className={`mt-4 px-2 text-sm font-medium ${darkMode ? "text-stone-300" : "text-stone-700"}`}>
            Type
          </h1>
          <div className="my-3 flex flex-wrap gap-3 px-2">
            <Button
              text="Youtube"
              variety={type === "Youtube" ? "Primary" : "Tri"}
              TypeFunc={() => setType("Youtube")}
              className={darkMode ? (type === "Youtube" ? "!bg-violet-500 !text-white" : "!bg-slate-900 !text-stone-200 !border !border-white/10") : ""}
            />
            <Button
              text="Twitter"
              variety={type === "Twitter" ? "Primary" : "Tri"}
              TypeFunc={() => setType("Twitter")}
              className={darkMode ? (type === "Twitter" ? "!bg-violet-500 !text-white" : "!bg-slate-900 !text-stone-200 !border !border-white/10") : ""}
            />
            <Button
              text="Spotify"
              variety={type === "Spotify" ? "Primary" : "Tri"}
              TypeFunc={() => setType("Spotify")}
              className={darkMode ? (type === "Spotify" ? "!bg-violet-500 !text-white" : "!bg-slate-900 !text-stone-200 !border !border-white/10") : ""}
            />
            <Button
              text="Other"
              variety={type === "Other" ? "Primary" : "Tri"}
              TypeFunc={() => setType("Other")}
              className={darkMode ? (type === "Other" ? "!bg-violet-500 !text-white" : "!bg-slate-900 !text-stone-200 !border !border-white/10") : ""}
            />
          </div>
          <Button
            variety="Primary"
            text={mutation.isPending ? "Creating..." : "Submit"}
            ProvoFunc={() => mutation.mutate()}
            fullWidth
            className={darkMode ? "!bg-violet-500 !text-white hover:!bg-violet-400" : ""}
          />
        </div>
      </div>
    </div>
  );
}
