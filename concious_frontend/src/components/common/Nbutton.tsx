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
}

export function Nbutton({
  css,
  text,
  StartIcon,
  onClose,
  soundSrc,
  withSound = false,
  ProvoFunc,
  TypeFunc,
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
    <button type="button" className={`cursor-pointer ${css ?? ""}`} onClick={playClick}>
      {StartIcon ? <span className="shrink-0">{StartIcon}</span> : null}
      {text ? <span>{text}</span> : null}
    </button>
  );
}
