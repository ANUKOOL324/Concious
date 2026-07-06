import { Button } from "../../common/Button";
import { Sharecard } from "../../share/Sharecard";
import { PlusIcon } from "../../../Icon/PlusIcon";
import { ShareIcon } from "../../../Icon/ShareIcon";
import { ThemeToggle } from "./ThemeToggle";
import { SemanticSearchDropdown } from "../search/SemanticSearch/SemanticSearch";
import {
  NAV_BTN,
  NAV_ICON_BTN,
  navGhostBtnClass,
  navSearchClass,
  navShellClass,
} from "./navbarStyles";

interface DashboardHeaderProps {
  darkMode: boolean;
  shareOpen: boolean;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onToggleTheme: () => void;
  onOpenAddContent: () => void;
  onToggleShare: () => void;
}

export function DashboardHeader({
  darkMode,
  shareOpen,
  searchQuery,
  onSearchQueryChange,
  onToggleTheme,
  onOpenAddContent,
  onToggleShare,
}: DashboardHeaderProps) {
  const ghostBtn = navGhostBtnClass(darkMode);
  const searchActive = searchQuery.trim().length > 0;
  const compactActionBtn =
    "w-10 min-w-10 px-0 sm:w-auto sm:min-w-[8.5rem] sm:px-4 [&>span:last-child]:hidden sm:[&>span:last-child]:inline";

  return (
    <header
      className={`rounded-3xl border px-4 py-3.5 backdrop-blur-2xl sm:px-5 sm:py-4 ${
        searchActive ? "z-40" : "z-30"
      } ${navShellClass(darkMode)}`}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0 shrink-0">
          <p
            className={`text-[0.65rem] font-semibold uppercase tracking-[0.3em] ${
              darkMode ? "text-violet-300" : "text-violet-500"
            }`}
          >
            Dashboard
          </p>
          <h1
            className={`mt-0.5 text-xl font-semibold tracking-tight sm:text-[1.65rem] ${
              darkMode ? "text-stone-100" : "text-stone-900"
            }`}
          >
            Your saved thinking space
          </h1>
        </div>

        <div className="relative w-full min-w-0 xl:max-w-3xl xl:flex-1">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
            <div className="relative min-w-0 flex-1 lg:max-w-md xl:max-w-lg">
              <label
                className={`${NAV_BTN} w-full border ${navSearchClass(darkMode)} ${
                  searchActive
                    ? darkMode
                      ? "ring-2 ring-violet-400/30"
                      : "ring-2 ring-violet-200"
                    : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4 shrink-0 opacity-65"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
                <input
                  value={searchQuery}
                  onChange={(event) => onSearchQueryChange(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      onSearchQueryChange("");
                    }
                  }}
                  placeholder="Search semantically..."
                  className="min-w-0 flex-1 cursor-text bg-transparent text-sm outline-none"
                  role="combobox"
                  aria-expanded={searchActive}
                  aria-autocomplete="list"
                  aria-label="Search your brain semantically"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchQueryChange("")}
                    aria-label="Clear search"
                    className={`cursor-pointer rounded-lg p-1 transition ${
                      darkMode
                        ? "text-stone-500 hover:bg-white/8 hover:text-stone-300"
                        : "text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-3.5 w-3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 6l12 12M18 6 6 18"
                      />
                    </svg>
                  </button>
                )}
              </label>

              <SemanticSearchDropdown
                query={searchQuery}
                darkMode={darkMode}
              />
            </div>

            <div className="flex min-w-0 shrink-0 items-center justify-end gap-2 sm:gap-2.5">
              <div className="hidden shrink-0 lg:contents">
                <ThemeToggle
                  darkMode={darkMode}
                  onToggle={onToggleTheme}
                  iconClassName="h-[1.35rem] w-[1.35rem]"
                  className={`${NAV_ICON_BTN} border ${ghostBtn}`}
                />
              </div>

              <Button
                variety="Primary"
                text="Add Content"
                StartIcon={<PlusIcon />}
                onClose={onOpenAddContent}
                soundSrc="src/assets/mixkit-retro-game-notification-212.wav"
                className={`${NAV_BTN} ${compactActionBtn} ${
                  darkMode ? "!bg-white !text-stone-950 hover:!bg-stone-200" : ""
                }`}
              />

              <Button
                variety="Secondary"
                text="Share Brain"
                StartIcon={<ShareIcon />}
                onClose={onToggleShare}
                className={`${NAV_BTN} ${compactActionBtn} ${
                  darkMode
                    ? "!border-violet-400/25 !bg-violet-500/16 !text-violet-100 hover:!bg-violet-500/26"
                    : ""
                }`}
              />
            </div>
          </div>

          {shareOpen && <Sharecard darkMode={darkMode} />}
        </div>
      </div>
    </header>
  );
}
