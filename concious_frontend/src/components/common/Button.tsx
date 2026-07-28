import type { ReactElement } from "react";
import { playSound, playUiClickSound } from "../../HelperFunction/sounds";

interface ButtonProps {
  variety: "Primary" | "Secondary" | "Tri" | "Sign";
  text: string;
  StartIcon?: ReactElement;
  onClose?: () => void;
  soundSrc?: string;
  withSound?: boolean;
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
  withSound = false,
  fullWidth,
  Loading,
  ProvoFunc,
  TypeFunc,
  className,
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
      aria-label={text}
      className={`${BASE} ${variantClasses[variety]}${fullWidth ? " w-full" : ""} ${className ?? ""}`}
      onClick={playClick}
    >
      {StartIcon && <span className="shrink-0 [&_svg]:size-4">{StartIcon}</span>}
      <span>{Loading ? "Loading..." : text}</span>
    </button>
  );
}
