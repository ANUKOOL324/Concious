import type { ReactElement } from "react";
import { playSound, playUiClickSound } from "../../HelperFunction/sounds";

interface ButtonProps {
  css?: string;
  text?: string;
  StartIcon?: ReactElement;
  onClose?: () => void;
  soundSrc?: string;
  withSound?: boolean;
  fullWidth?: boolean;
  Loading?: boolean;
  ProvoFunc?: () => void;
  TypeFunc?: () => void;
  darkMode?: boolean;
}

export function Sharebutton({
  css,
  text,
  StartIcon,
  onClose,
  soundSrc,
  withSound = true,
  Loading,
  ProvoFunc,
  TypeFunc,
  darkMode = false,
}: ButtonProps) {
  const playClick = () => {
    if (soundSrc) {
      playSound(soundSrc);
    } else if (withSound) {
      playUiClickSound();
    }
    onClose?.();
    ProvoFunc?.();
    TypeFunc?.();
  };

  return (
    <button
      type="button"
      className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ease-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-300/40 ${
        darkMode
          ? "border border-violet-400/25 bg-violet-500/15 text-violet-100 shadow-md shadow-black/20 hover:bg-violet-500/25 hover:shadow-lg"
          : "border border-gray-400 bg-gray-100 text-purple-600 shadow-md shadow-purple-200/30 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-300/40"
      } ${css ?? ""}`}
      onClick={playClick}
    >
      {StartIcon ? <div className="ml-1 pr-1">{StartIcon}</div> : null}
      {text || Loading ? (
        <div className="mr-1">{Loading ? "Loading..." : text}</div>
      ) : null}
    </button>
  );
}
