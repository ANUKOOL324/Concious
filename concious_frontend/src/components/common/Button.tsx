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

const BASE =
  "inline-flex h-10 min-h-10 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-medium whitespace-nowrap cursor-pointer transition-all duration-200 ease-out active:scale-[0.98] focus:outline-none focus:ring-2";

const variantClasses: Record<ButtonProps["variety"], string> = {
  Primary:
    "bg-stone-900 text-white shadow-md shadow-stone-900/10 hover:bg-stone-800 focus:ring-stone-400/30",
  Secondary:
    "border border-violet-200 bg-violet-50 text-violet-700 shadow-sm hover:bg-violet-100 focus:ring-violet-300/40",
  Tri: "border border-stone-200 bg-stone-100 text-stone-700 hover:bg-stone-200 focus:ring-stone-300/40",
  Sign: "border border-stone-300 bg-white text-stone-900 shadow-md shadow-purple-200/20 hover:bg-violet-50 focus:ring-violet-300/40",
};

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
      {soundSrc && <audio ref={audioRef} src={soundSrc} preload="auto" />}
      <button
        type="button"
        aria-label={text}
        className={`${BASE} ${variantClasses[variety]}${fullWidth ? " w-full" : ""} ${className ?? ""}`}
        onClick={playSound}
      >
        {StartIcon && <span className="shrink-0 [&_svg]:size-4">{StartIcon}</span>}
        <span>{Loading ? "Loading..." : text}</span>
      </button>
    </>
  );
}
