import { Button } from "../Button";
import { Sharecard } from "../Sharecard";
import { PlusIcon } from "../../Icon/PlusIcon";
import { ThemeToggle } from "./ThemeToggle";

interface DashboardHeaderProps {
  darkMode: boolean;
  isLoggedIn: boolean;
  shareOpen: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onOpenAddContent: () => void;
  onToggleShare: () => void;
  onLogout: () => void;
}

export function DashboardHeader({
  darkMode,
  isLoggedIn,
  shareOpen,
  onToggleTheme,
  onOpenSearch,
  onOpenAddContent,
  onToggleShare,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <div
      className={`z-30 rounded-4xl px-4 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-5 ${
        darkMode
          ? "border border-white/10 bg-[#10131b]/92"
          : "border border-white/80 bg-white/90"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p
            className={`text-[0.7rem] font-semibold uppercase tracking-[0.34em] ${
              darkMode ? "text-violet-300" : "text-violet-500"
            }`}
          >
            Dashboard
          </p>
          <h1
            className={`mt-1 text-[1.7rem] font-semibold tracking-tight sm:text-[2rem] ${
              darkMode ? "text-stone-100" : "text-stone-950"
            }`}
          >
            Your saved thinking space
          </h1>
        </div>

        <div className="relative grid w-full grid-cols-2 gap-3 lg:flex lg:w-auto lg:flex-wrap lg:items-center lg:justify-end lg:gap-3">
          <ThemeToggle
            darkMode={darkMode}
            onToggle={onToggleTheme}
            className={`hidden h-12 w-full cursor-pointer items-center justify-center rounded-2xl transition lg:flex lg:w-12 ${
              darkMode
                ? "border border-white/10 bg-slate-900 text-amber-300 hover:bg-slate-800"
                : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
            }`}
          />

          <button
            type="button"
            onClick={onOpenSearch}
            className={`col-span-2 flex h-12 w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm shadow-sm transition lg:col-span-1 lg:min-w-56 lg:w-auto lg:flex-none ${
              darkMode
                ? "border border-white/10 bg-slate-900 text-stone-400 hover:border-violet-400/30 hover:bg-slate-800"
                : "border border-stone-200 bg-white text-stone-500 hover:border-violet-200 hover:bg-violet-50/60"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>
            <span>Search semantically...</span>
          </button>

          <Button
            variety="Primary"
            text="Add Content"
            StartIcon={<PlusIcon />}
            onClose={onOpenAddContent}
            soundSrc="src/assets/mixkit-retro-game-notification-212.wav"
            className={`col-span-1 h-12 w-full lg:h-12! lg:min-w-37! lg:w-auto ${
              darkMode
                ? "bg-white! text-stone-950! hover:bg-stone-200! shadow-black/20!"
                : ""
            }`}
          />

          <Button
            variety="Secondary"
            text="Share Brain"
            onClose={onToggleShare}
            className={`col-span-1 h-12 w-full lg:h-12! lg:min-w-37! lg:w-auto ${
              darkMode
                ? "border-white/10! bg-violet-500/14! text-violet-100! hover:bg-violet-500/24! shadow-black/20!"
                : ""
            }`}
          />

          {isLoggedIn && (
            <Button
              variety="Primary"
              text="Logout"
              onClose={onLogout}
              className={`col-span-1 hidden w-full lg:inline-flex! lg:h-12! lg:min-w-37! lg:w-auto ${
                darkMode
                  ? "bg-slate-900! text-stone-100! hover:bg-slate-800! shadow-black/20!"
                  : ""
              }`}
            />
          )}

          {shareOpen && <Sharecard darkMode={darkMode} />}
        </div>
      </div>
    </div>
  );
}
