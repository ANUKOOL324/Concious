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
  personalNote?: string;
  summary?: string;
  tags?: string[];
  collection?: string;
  whySaved?: string;
  importance?: "low" | "medium" | "high";
}

interface CreateContentResponse {
  content: Content;
}

type Types = "Youtube" | "Twitter" | "Spotify" | "Other" | "initial";
type Importance = "low" | "medium" | "high";

function trimToLimit(value: string | undefined, maxLength: number) {
  return value?.trim().slice(0, maxLength) || undefined;
}

function parseTags(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 10);
}

export function CreateContentModal({
  open,
  onClose,
  darkMode = false,
}: CreateProps) {
  const titleRef = useRef<HTMLInputElement | null>(null);
  const linkRef = useRef<HTMLInputElement | null>(null);
  const personalNoteRef = useRef<HTMLTextAreaElement | null>(null);
  const summaryRef = useRef<HTMLTextAreaElement | null>(null);
  const tagsRef = useRef<HTMLInputElement | null>(null);
  const collectionRef = useRef<HTMLInputElement | null>(null);
  const whySavedRef = useRef<HTMLTextAreaElement | null>(null);
  const [type, setType] = useState<Types>("initial");
  const [importance, setImportance] = useState<Importance>("medium");
  const [formError, setFormError] = useState("");

  const queryClient = useQueryClient();

  function resetForm() {
    if (titleRef.current) titleRef.current.value = "";
    if (linkRef.current) linkRef.current.value = "";
    if (personalNoteRef.current) personalNoteRef.current.value = "";
    if (summaryRef.current) summaryRef.current.value = "";
    if (tagsRef.current) tagsRef.current.value = "";
    if (collectionRef.current) collectionRef.current.value = "";
    if (whySavedRef.current) whySavedRef.current.value = "";
    setType("initial");
    setImportance("medium");
    setFormError("");
  }

  async function createContent() {
    const title = titleRef.current?.value.trim();
    const link = linkRef.current?.value.trim();

    if (!title || !link || type === "initial") {
      setFormError("Title, link, and type are required.");
      throw new Error("Title, link, and type are required.");
    }

    const res = await axios.post<CreateContentResponse>(
      `${Backendurl}/api/v1/content`,
      {
        title,
        link,
        type,
        personalNote: trimToLimit(personalNoteRef.current?.value, 1000),
        summary: trimToLimit(summaryRef.current?.value, 1000),
        tags: parseTags(tagsRef.current?.value),
        collection: trimToLimit(collectionRef.current?.value, 80),
        whySaved: trimToLimit(whySavedRef.current?.value, 500),
        importance,
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
    onSuccess: (newContent) => {
      queryClient.setQueryData<Content[]>(["content"], (old = []) => [
        ...old,
        newContent.content,
      ]);
      resetForm();
      onClose();
    },
    onError: (error) => {
      if (!formError) {
        setFormError(error instanceof Error ? error.message : "Failed to create content.");
      }
    },
  });

  if (!open) return null;

  const fieldClass = `m-2 w-[calc(100%-1rem)] rounded-xl border px-4 py-3 text-sm outline-none transition ${
    darkMode
      ? "border-white/10 bg-slate-900/80 text-stone-100 placeholder:text-stone-500 focus:border-violet-400/50"
      : "border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:border-violet-300"
  }`;

  return (
    <div>
      <div className={`fixed top-0 left-0 h-dvh w-full ${darkMode ? "bg-black/70" : "bg-slate-900/60"}`} />
      <div className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center px-4">
        <div
          className={`max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[1.7rem] p-5 shadow-[0_30px_80px_rgba(15,23,42,0.25)] ${
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

          <div className={`my-4 rounded-2xl border p-3 ${darkMode ? "border-white/10 bg-slate-900/50" : "border-stone-200 bg-stone-50"}`}>
            <h3 className={`px-1 text-sm font-semibold ${darkMode ? "text-stone-200" : "text-stone-800"}`}>
              Add context for better AI search
            </h3>
            <textarea
              ref={personalNoteRef}
              maxLength={1000}
              placeholder="Personal note"
              className={`${fieldClass} min-h-[76px] resize-none`}
            />
            <textarea
              ref={summaryRef}
              maxLength={1000}
              placeholder="Summary"
              className={`${fieldClass} min-h-[76px] resize-none`}
            />
            <input
              ref={tagsRef}
              placeholder="Tags: ai, focus, habits"
              className={fieldClass}
            />
            <input
              ref={collectionRef}
              maxLength={80}
              placeholder="Collection"
              className={fieldClass}
            />
            <textarea
              ref={whySavedRef}
              maxLength={500}
              placeholder="Why saved"
              className={`${fieldClass} min-h-[68px] resize-none`}
            />
            <select
              value={importance}
              onChange={(event) => setImportance(event.target.value as Importance)}
              className={fieldClass}
            >
              <option value="low">Low importance</option>
              <option value="medium">Medium importance</option>
              <option value="high">High importance</option>
            </select>
          </div>

          {formError && (
            <p className="mb-3 px-2 text-sm text-rose-500">{formError}</p>
          )}

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
