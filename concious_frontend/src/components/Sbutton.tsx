import { useRef, type ReactElement } from "react";

interface ButtonProps {
    css?:string;
    text?:string;
    StartIcon?:ReactElement;
    onClose?:()=>void;
    soundSrc?:string;
    fullWidth?:boolean;
    Loading?:boolean;
    ProvoFunc?:()=>void;
    TypeFunc?:()=>void;
}

export function Sbutton({css,text , StartIcon , onClose , soundSrc , Loading , ProvoFunc ,TypeFunc}:ButtonProps){
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = () => {
    audioRef.current?.play();
    onClose?.()
    ProvoFunc?.()
    TypeFunc?.()
  };
    return <>
    <audio ref={audioRef} src={soundSrc} preload="auto"/>
    <button className={css} onClick={playSound} >
        <div className="pr-1 ml-1">{StartIcon}</div>
        <div className="mr-1">{Loading?"Loading...":text}</div>
    </button>
    </>
}