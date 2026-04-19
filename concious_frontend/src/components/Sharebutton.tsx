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
    darkMode?: boolean;
}

export function Sharebutton({css,text , StartIcon , onClose , soundSrc , Loading , ProvoFunc ,TypeFunc, darkMode = false}:ButtonProps){
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = () => {
    audioRef.current?.play();
    onClose?.()
    ProvoFunc?.()
    TypeFunc?.()
  };
    return <>
    <audio ref={audioRef} src={soundSrc} preload="auto"/>
    <button className={`text-sm font-medium
    px-4 py-2
    rounded-xl
    ${darkMode ? "text-violet-100 bg-violet-500/15 border border-violet-400/25 shadow-md shadow-black/20 hover:shadow-lg hover:bg-violet-500/25" : "text-purple-600 bg-gray-100 border border-gray-400 shadow-md shadow-purple-200/30 hover:shadow-lg hover:shadow-purple-300/40 hover:bg-purple-700"}

    active:scale-[0.97]
    transition-all duration-200 ease-out

    focus:outline-none
    focus:ring-2 focus:ring-purple-300/40 ${css ?? ""}`} onClick={playSound} >
        <div className="pr-1 ml-1">{StartIcon}</div>
        <div className="mr-1">{Loading?"Loading...":text}</div>
    </button>
    </>
}
