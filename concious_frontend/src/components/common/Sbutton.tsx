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

export function Sbutton({
  css,
  text,
  StartIcon,
  onClose,
  soundSrc,
  withSound = false,
  Loading,
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
      {StartIcon ? <div className="ml-1 pr-1">{StartIcon}</div> : null}
      {text || Loading ? (
        <div className="mr-1">{Loading ? "Loading..." : text}</div>
      ) : null}
    </button>
  );
}
