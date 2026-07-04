import { Sbutton } from "../Sbutton";
import { SidebarIcon } from "../../Icon/SidebarIcon";

interface SidebarToggleButtonProps {
  darkMode: boolean;
  onClick: () => void;
}

export function SidebarToggleButton({
  darkMode,
  onClick,
}: SidebarToggleButtonProps) {
  return (
    <Sbutton
      onClose={onClick}
      soundSrc="src/assets/mixkit-retro-game-notification-212.wav"
      css={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-md transition-all duration-200 hover:shadow-lg active:scale-95 ${
        darkMode
          ? "border-white/10 bg-slate-900 text-stone-100 hover:bg-slate-800"
          : "border-gray-200 bg-gray-100 hover:bg-gray-50"
      }`}
      StartIcon={<SidebarIcon />}
    />
  );
}
