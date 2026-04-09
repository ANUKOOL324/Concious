import { useState } from "react";
import { RefreshIcon } from "../Icon/RefreshIcon";
import { TwitterIcon } from "../Icon/TwitterIcon";
import { YoutubeIcon } from "../Icon/YoutubeIcon";
import { Nbutton } from "./Nbutton";
import { SpotifyIcon } from "../Icon/SpotifyIcon";

export function Sidebar({
  onSelect,
}: {
  onSelect: (type: "ALL" | "Twitter" | "Youtube" | "Spotify") => void;
  // isFetching:boolean;
}) {
  const [rotate, setRotate] = useState(false);
  return (
    <div
      className="flex relative flex-col mt-3 ml-5 mb-2 z-10  w-56 h-72 bg-white rounded-2xl shadow-lg shadow-purple-200/40 
  border-2
  border-dashed
  border-r-purple-400/40
  border-l-black
  border-t-purple-300
  p-5"
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
    bg-gray-100
    border border-gray-200
    shadow-sm
    hover:shadow-lg
    hover:bg-gray-50
    active:scale-90
    transition-all duration-300 ease-out
    ${rotate ? "animate-spin" : ""}
  `}
          soundSrc="src/assets/mixkit-retro-game-notification-212.wav"
          StartIcon={<RefreshIcon />}
        />
      </div>
      <div className="mt-6 flex flex-col gap-3 items-center justify-center">
        <div className="flex  max-w-30 w-25 hover:bg-[#0000000d] cursor-pointer hover:shadow-lg hover:shadow-purple-300/40 active:scale-[0.97] transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-purple-300/40">
          <Nbutton
            ProvoFunc={() => onSelect("Twitter")}
            StartIcon={<TwitterIcon />}
          />
          <Nbutton
            ProvoFunc={() => onSelect("Twitter")}
            css="ml-3 flex justify-start"
            text={"Twitter"}
          />
        </div>
        <div className="flex  max-w-30 w-27 hover:bg-[#0000000d] cursor-pointer hover:shadow-lg hover:shadow-purple-300/40 active:scale-[0.97] transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-purple-300/40">
          <Nbutton
            ProvoFunc={() => onSelect("Youtube")}
            StartIcon={<YoutubeIcon />}
          />
          <Nbutton
            ProvoFunc={() => onSelect("Youtube")}
            css="ml-3 flex justify-start"
            text={"Youtube"}
          />
        </div>
        <div className="flex  gap-2 h-8 max-w-30 w-27 hover:bg-[#0000000d] cursor-pointer hover:shadow-lg hover:shadow-purple-300/40 active:scale-[0.97] transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-purple-300/40">
          <Nbutton
            ProvoFunc={() => onSelect("Spotify")}
            StartIcon={<SpotifyIcon />}
            css=" flex-justify-start"
          />
          <Nbutton
            ProvoFunc={() => onSelect("Spotify")}
            css=" pl-2 flex justify-start"
            text={"Spotify"}
          />
        </div>
      </div>
    </div>
  );
}
