import { IoMusicalNotesOutline } from "react-icons/io5";

interface SpotifyFloatingButtonProps {
  darkMode: boolean;
  active: boolean;
  onToggle: () => void;
}

export function SpotifyFloatingButton({
  darkMode,
  active,
  onToggle,
}: SpotifyFloatingButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={active ? "Hide music player" : "Open music player"}
      aria-expanded={active}
      aria-pressed={active}
      className={`fixed right-4 bottom-[4.75rem] z-[118] flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl border shadow-[0_20px_50px_rgba(15,23,42,0.18)] transition hover:shadow-[0_24px_60px_rgba(15,23,42,0.22)] lg:right-5 lg:bottom-6 lg:h-14 lg:w-14 ${
        active
          ? darkMode
            ? "border-violet-400/35 bg-violet-500/20 text-violet-200 ring-1 ring-violet-400/30"
            : "border-violet-300 bg-violet-50 text-violet-700 ring-1 ring-violet-200"
          : darkMode
            ? "border-white/10 bg-slate-950/95 text-emerald-500"
            : "border-white/80 bg-white/95 text-emerald-600"
      }`}
    >
      <IoMusicalNotesOutline size={28} aria-hidden />
    </button>
  );
}
