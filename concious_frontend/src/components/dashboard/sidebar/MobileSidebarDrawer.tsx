import { SidebarFilterList } from "./SidebarFilterList";
import { BrandLogo } from "./BrandLogo";
import { SidebarUserProfile } from "./SidebarUserProfile";
import { ThemeToggle } from "../header/ThemeToggle";
import type { FilterType } from "../../../types/content";

interface MobileSidebarDrawerProps {
  darkMode: boolean;
  isLoggedIn: boolean;
  username: string;
  activeFilter: FilterType;
  onClose: () => void;
  onGoHome: () => void;
  onFilterSelect: (filter: FilterType) => void;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export function MobileSidebarDrawer({
  darkMode,
  isLoggedIn,
  username,
  activeFilter,
  onClose,
  onGoHome,
  onFilterSelect,
  onToggleTheme,
  onLogout,
}: MobileSidebarDrawerProps) {
  const shellClass = darkMode
    ? "border-white/10 bg-[#0b0d12]/96"
    : "border-stone-200/80 bg-white/96";

  return (
    <div className="fixed inset-0 z-[140] lg:hidden">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
      />

      <aside
        className={`relative flex h-full w-[min(18rem,88vw)] flex-col border-r shadow-[0_24px_80px_rgba(15,23,42,0.28)] backdrop-blur-xl ${shellClass}`}
        aria-label="Mobile navigation"
      >
        <div
          className={`flex items-center justify-between border-b px-4 py-3 ${
            darkMode ? "border-white/8" : "border-stone-200/70"
          }`}
        >
          <BrandLogo
            darkMode={darkMode}
            size="sm"
            onClick={() => {
              onGoHome();
              onClose();
            }}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className={`rounded-xl p-2 transition ${
              darkMode
                ? "text-stone-400 hover:bg-white/8 hover:text-stone-100"
                : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-3">
          <div className="shrink-0">
            <SidebarFilterList
              onSelect={(filter) => {
                onFilterSelect(filter);
              }}
              activeFilter={activeFilter}
              darkMode={darkMode}
            />
          </div>

          <div
            className={`mt-auto shrink-0 space-y-3 border-t pt-3 ${
              darkMode ? "border-white/8" : "border-stone-200/70"
            }`}
          >
            <div
              className={`space-y-1.5 rounded-2xl border p-2 ${
                darkMode ? "border-white/10 bg-white/4" : "border-stone-200 bg-stone-50/90"
              }`}
            >
              <ThemeToggle
                darkMode={darkMode}
                onToggle={onToggleTheme}
                showLabel
                className={`flex h-10 w-full cursor-pointer items-center justify-between rounded-xl px-3 text-sm font-medium transition ${
                  darkMode
                    ? "bg-white/6 text-stone-100 hover:bg-white/10"
                    : "bg-white text-stone-700 hover:bg-stone-100"
                }`}
              />

              {isLoggedIn && (
                <>
                  <SidebarUserProfile
                    expanded
                    darkMode={darkMode}
                    username={username}
                  />
                  <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className={`flex h-10 w-full cursor-pointer items-center justify-between rounded-xl px-3 text-sm font-medium transition ${
                    darkMode
                      ? "bg-white/6 text-stone-100 hover:bg-white/10"
                      : "bg-white text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  <span>Logout</span>
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
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3 0 3-3m0 0 3 3m-3-3H9"
                    />
                  </svg>
                </button>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
