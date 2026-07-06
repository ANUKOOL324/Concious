import { useRef, type ReactElement } from "react";

interface ButtonProps {
  css?: string;
  text?: string;
  StartIcon?: ReactElement;
  onClose?: () => void;
  soundSrc?: string;
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
  ProvoFunc,
  TypeFunc,
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
      <button className={css} onClick={playSound}>
        <div className="cursor-pointer">{StartIcon}</div>
        <div className="cursor-pointer">{text}</div>
      </button>
    </>
  );
}
