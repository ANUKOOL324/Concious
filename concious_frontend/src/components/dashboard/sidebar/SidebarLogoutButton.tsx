import { useRef } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { SidebarNavItem } from "./SidebarNavItem";

interface SidebarLogoutButtonProps {
  expanded: boolean;
  darkMode: boolean;
  onLogout: () => void;
}

export function SidebarLogoutButton({
  expanded,
  darkMode,
  onLogout,
}: SidebarLogoutButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const btnClass = darkMode
    ? "border-white/10 bg-white/6 text-stone-200 hover:bg-white/10"
    : "border-stone-200/90 bg-white/80 text-stone-600 hover:bg-white";

  function handleClick() {
    audioRef.current?.play();
    onLogout();
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="src/assets/mixkit-retro-game-notification-212.wav"
        preload="auto"
      />
      <SidebarNavItem
        expanded={expanded}
        icon={<IoLogOutOutline size={18} aria-hidden />}
        label="Logout"
        labelMaxWidth="max-w-[6rem]"
        title="Logout"
        aria-label="Logout"
        onClick={handleClick}
        className={`border text-sm font-medium ${btnClass}`}
      />
    </>
  );
}
