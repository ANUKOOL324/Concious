import { useState } from "react";
import { RefreshIcon } from "../Icon/RefreshIcon";
import { TwitterIcon } from "../Icon/TwitterIcon";
import { YoutubeIcon } from "../Icon/YoutubeIcon";
import { Nbutton } from "./Nbutton";
import { SpotifyIcon } from "../Icon/SpotifyIcon";

export function Sidebar({
  onSelect,
  darkMode = false,
}: {
  onSelect: (type: "ALL" | "Twitter" | "Youtube" | "Spotify") => void;
  darkMode?: boolean;
  // isFetching:boolean;
}) {
  const [rotate, setRotate] = useState(false);
  return (
    <div
      className={`relative z-10 mt-3 mb-2 flex min-h-[18rem] w-full max-w-sm flex-col rounded-2xl p-5 shadow-lg lg:ml-5 lg:w-56 ${
        darkMode
          ? "border border-white/10 bg-slate-950/70 shadow-black/30"
          : "border-2 border-dashed border-r-purple-400/40 border-l-black border-t-purple-300 bg-white shadow-purple-200/40"
      }`}
    >
      <div className="flex justify-end pr-5 pt-3 ">
        <Nbutton
          ProvoFunc={function () {
            setRotate(true);
            setTimeout(() => setRotate(false), 500);
            onSelect("ALL");
          }}
          css={`
    rounded-full
    ${darkMode ? "bg-slate-900 border border-white/10 text-stone-200 hover:bg-slate-800" : "bg-gray-100 border border-gray-200"}
    shadow-sm
    hover:shadow-lg
    ${darkMode ? "hover:shadow-black/20" : "hover:bg-gray-50"}
    active:scale-90
    transition-all duration-300 ease-out
    ${rotate ? "animate-spin" : ""}
  `}
          soundSrc="src/assets/mixkit-retro-game-notification-212.wav"
          StartIcon={<RefreshIcon />}
        />
      </div>
      <div className="mt-6 flex flex-col items-center justify-center gap-3">
        <div className={`flex max-w-30 w-25 items-center rounded-xl px-2 py-2 cursor-pointer transition-all duration-200 ease-out active:scale-[0.97] focus:outline-none ${darkMode ? "text-stone-200 hover:bg-white/6 hover:shadow-lg hover:shadow-black/20 focus:ring-2 focus:ring-violet-400/30" : "hover:bg-[#0000000d] hover:shadow-lg hover:shadow-purple-300/40 focus:ring-2 focus:ring-purple-300/40"}`}>
          <Nbutton
            ProvoFunc={() => onSelect("Twitter")}
            StartIcon={
              <TwitterIcon color={darkMode ? "#e7e5e4" : "#111827"} />
            }
          />
          <Nbutton
            ProvoFunc={() => onSelect("Twitter")}
            css={`ml-3 flex justify-start ${darkMode ? "text-stone-200" : "text-black"}`}
            text={"Twitter"}
          />
        </div>
        <div className={`flex max-w-30 w-27 items-center rounded-xl px-2 py-2 cursor-pointer transition-all duration-200 ease-out active:scale-[0.97] focus:outline-none ${darkMode ? "text-stone-200 hover:bg-white/6 hover:shadow-lg hover:shadow-black/20 focus:ring-2 focus:ring-violet-400/30" : "hover:bg-[#0000000d] hover:shadow-lg hover:shadow-purple-300/40 focus:ring-2 focus:ring-purple-300/40"}`}>
          <Nbutton
            ProvoFunc={() => onSelect("Youtube")}
            StartIcon={<YoutubeIcon />}
          />
          <Nbutton
            ProvoFunc={() => onSelect("Youtube")}
            css={`ml-3 flex justify-start ${darkMode ? "text-stone-200" : "text-black"}`}
            text={"Youtube"}
          />
        </div>
        <div className={`flex h-10 max-w-30 w-27 items-center gap-2 rounded-xl px-2 py-2 cursor-pointer transition-all duration-200 ease-out active:scale-[0.97] focus:outline-none ${darkMode ? "text-stone-200 hover:bg-white/6 hover:shadow-lg hover:shadow-black/20 focus:ring-2 focus:ring-violet-400/30" : "hover:bg-[#0000000d] hover:shadow-lg hover:shadow-purple-300/40 focus:ring-2 focus:ring-purple-300/40"}`}>
          <Nbutton
            ProvoFunc={() => onSelect("Spotify")}
            StartIcon={
              <div className={darkMode ? "text-stone-200" : "text-black"}>
                <SpotifyIcon />
              </div>
            }
            css=" flex-justify-start"
          />
          <Nbutton
            ProvoFunc={() => onSelect("Spotify")}
            css={`pl-2 flex justify-start ${darkMode ? "text-stone-200" : "text-black"}`}
            text={"Spotify"}
          />
        </div>
      </div>
    </div>
  );
}
