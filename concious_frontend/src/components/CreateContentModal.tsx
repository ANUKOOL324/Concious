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
}

interface Content {
  _id: string;
  title: string;
  link: string;
  type: string;
}

type Types = "Youtube" | "Twitter" | "Spotify" | "Other" | "initial";

export function CreateContentModal({ open, onClose }: CreateProps) {
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
      <div className="fixed bg-slate-900 top-0 left-0 w-full h-dvh opacity-60" />
      <div className="fixed h-screen w-screen top-0 left-0 flex justify-center items-center">
        <span className="bg-white p-4 rounded w-120">
          <div className="flex justify-end" onClick={onClose}>
            <CrossIcon />
          </div>
          <Input reference={titleRef} placeholder="Title" />
          <Input reference={linkRef} placeholder="Link" />
          <h1 className="mt-2">Type</h1>
          <div className="flex gap-3 my-2">
            <Button
              text="Youtube"
              variety={type === "Youtube" ? "Primary" : "Tri"}
              TypeFunc={() => setType("Youtube")}
            />
            <Button
              text="Twitter"
              variety={type === "Twitter" ? "Primary" : "Tri"}
              TypeFunc={() => setType("Twitter")}
            />
            <Button
              text="Spotify"
              variety={type === "Spotify" ? "Primary" : "Tri"}
              TypeFunc={() => setType("Spotify")}
            />
            <Button
              text="Other"
              variety={type === "Other" ? "Primary" : "Tri"}
              TypeFunc={() => setType("Other")}
            />
          </div>
          <Button
            variety="Primary"
            text={mutation.isPending ? "Creating..." : "Submit"}
            ProvoFunc={() => mutation.mutate()}
            fullWidth
          />
        </span>
      </div>
    </div>
  );
}
