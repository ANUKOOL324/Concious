import toast from "react-hot-toast";
import { Sharebutton } from "./Sharebutton";
import { Backendurl } from "../config";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

async function fetchsharelink() {
  const res = await axios.post(
    `${Backendurl}/api/v1/brain/share`,
    {
      status: true,
    },
    {
      headers: {
        authorization: localStorage.getItem("Token"),
      },
    }
  );

  return res.data;
}

export function Sharecard({ darkMode = false }: { darkMode?: boolean }) {
  const shareMutation = useMutation({
    mutationFn: fetchsharelink,
    onSuccess: (data) => {
      const shareUrl = `${window.location.origin}/brain/${data.hash}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Brain link copied!");
    },
    onError: () => {
      toast.error("Failed to share brain");
    },
  });

  return (
    <div
      className={`absolute right-0 top-[calc(100%+0.75rem)] z-40 flex h-100 w-[min(22rem,calc(100vw-2rem))] flex-col items-center rounded-2xl p-5 shadow-lg sm:w-72 ${
        darkMode
          ? "border border-white/10 bg-slate-950/95 shadow-black/30"
          : "border-2 border-dashed border-black-400/40 bg-white shadow-black-200/40"
      }`}
    >
      <h2
        className={`text-center text-xl font-medium tracking-wide ${
          darkMode ? "text-violet-300" : "text-purple-500"
        }`}
      >
        Live collaboration
      </h2>
      <p className={`mt-3 text-center text-base ${darkMode ? "text-stone-100" : "text-gray-900"}`}>
        Invite people to collaborate.
      </p>
      <p
        className={`mt-2 max-w-xl text-center text-sm ${
          darkMode ? "text-stone-400" : "text-gray-500"
        }`}
      >
        Don&apos;t worry, the session is end-to-end encrypted and fully private.
      </p>
      <h2
        className={`mt-5 text-center text-xl font-medium tracking-wide ${
          darkMode ? "text-violet-300" : "text-purple-500"
        }`}
      >
        Shareable link
      </h2>
      <div className="mt-5" />
      <Sharebutton
        darkMode={darkMode}
        css={darkMode ? "bg-violet-500/20 text-violet-100" : "text-white bg-purple-500"}
        text="Get Link"
        onClose={() => shareMutation.mutate()}
      />
    </div>
  );
}
