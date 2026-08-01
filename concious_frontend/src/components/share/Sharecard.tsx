import toast from "react-hot-toast";
import { Sharebutton } from "./Sharebutton";
import { Backendurl } from "../../config";
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
      className={`absolute right-0 top-[calc(100%+0.65rem)] z-[80] w-[min(14rem,calc(100vw-2rem))] rounded-[1.3rem] border px-4 py-4 shadow-[0_24px_60px_rgba(15,23,42,0.18)] sm:w-56 ${
        darkMode
          ? "border-white/10 bg-slate-950 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
          : "border-stone-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.14)]"
      }`}
    >
      <p
        className={`text-center text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${
          darkMode ? "text-[#c7bee6]" : "text-[#8d80bc]"
        }`}
      >
        Share brain
      </p>

      <div className="mt-4 flex justify-center">
        <Sharebutton
          darkMode={darkMode}
          css={
            darkMode
              ? "!inline-flex !w-auto !items-center !justify-center !whitespace-nowrap !rounded-2xl !border !border-[#8d80bc]/40 !bg-[#8d80bc]/18 !px-5 !py-2.5 !text-sm !font-semibold !text-[#f3f0fa] !shadow-none hover:!bg-[#8d80bc]/28 hover:!text-white focus:!ring-[#8d80bc]/35"
              : "!inline-flex !w-auto !items-center !justify-center !whitespace-nowrap !rounded-2xl !border !border-[#8d80bc]/35 !bg-[#8d80bc]/10 !px-5 !py-2.5 !text-sm !font-semibold !text-[#6f6499] !shadow-none hover:!bg-[#8d80bc]/16 hover:!text-[#5a5080] focus:!ring-[#8d80bc]/30"
          }
          text="Copy link"
          onClose={() => shareMutation.mutate()}
        />
      </div>
    </div>
  );
}
