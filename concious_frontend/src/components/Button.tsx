import { useRef, type ReactElement } from "react";

interface ButtonProps {
  variety: "Primary" | "Secondary" | "Tri" | "Sign";
  text: string;
  StartIcon?: ReactElement;
  onClose?: () => void;
  soundSrc?: string;
  fullWidth?: boolean;
  Loading?: boolean;
  ProvoFunc?: () => void;
  TypeFunc?: () => void;
  className?: string;
}

const varientClasses = {
  Primary: `
    bg-white
    text-black text-sm font-medium
    px-4 py-2
    rounded-xl
    cursor-pointer

    shadow-lg shadow-purple-200/30
    hover:bg-[#8d80bc]/90
    hover:shadow-xl 

    active:scale-[0.97]
    transition-all duration-200 ease-out

    focus:outline-none
    focus:ring-2 focus:ring-[#8d80bc]/40
  `,

  Secondary: `
    text-purple-600 text-sm font-medium
    px-4 py-2
    rounded-xl

    bg-gray-100
    border border-gray-400
    shadow-md shadow-purple-200/30

    hover:shadow-lg hover:shadow-purple-300/40
    hover:bg-gray-50

    active:scale-[0.97]
    transition-all duration-200 ease-out

    focus:outline-none
    focus:ring-2 focus:ring-purple-300/40
  `,

  Tri: `
    bg-slate-400
    text-black text-sm
  `,
  Sign: `border border-gray-400 bg-white
    text-black text-sm font-medium
    px-4 py-2
    rounded-xl
    cursor-pointer

    shadow-lg shadow-purple-200/30
    hover:bg-[#8d80bc]/90
    hover:shadow-xl 

    active:scale-[0.97]
    transition-all duration-200 ease-out

    focus:outline-none
    focus:ring-2 focus:ring-[#8d80bc]/40 `,
};

const defaultStyles = "px-4 py-2 rounded-md flex items-center justify-center";

export function Button({
  variety,
  text,
  StartIcon,
  onClose,
  soundSrc,
  fullWidth,
  Loading,
  ProvoFunc,
  TypeFunc,
  className,
}: ButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = () => {
    audioRef.current?.play();
    onClose?.();
    ProvoFunc?.();
    TypeFunc?.();
  };

  return (
    <>
      <audio ref={audioRef} src={soundSrc} preload="auto" />
      <button
        className={`${varientClasses[variety]}${defaultStyles}${
          fullWidth ? " w-full flex justify-center items-center" : ""
        } ${className ?? ""}`}
        onClick={playSound}
      >
        <div className="pr-1 ml-1">{StartIcon}</div>
        <div className="mr-1">{Loading ? "Loading..." : text}</div>
      </button>
    </>
  );
}
