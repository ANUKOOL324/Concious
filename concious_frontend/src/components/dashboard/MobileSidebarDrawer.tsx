import { Sidebar } from "../Sidebar";
import { BrandLogo } from "./BrandLogo";
import { ThemeToggle } from "./ThemeToggle";
import type { FilterType } from "../../types/content";

interface MobileSidebarDrawerProps {
  darkMode: boolean;
  isLoggedIn: boolean;
  onClose: () => void;
  onGoHome: () => void;
  onFilterSelect: (filter: FilterType) => void;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export function MobileSidebarDrawer({
  darkMode,
  isLoggedIn,
  onClose,
  onGoHome,
  onFilterSelect,
  onToggleTheme,
  onLogout,
}: MobileSidebarDrawerProps) {
  return (
    <div className="fixed inset-0 z-140 lg:hidden">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/32 backdrop-blur-[3px]"
      />
      <div
        className={`relative ml-auto flex h-full w-[min(20rem,88vw)] flex-col border-l px-4 py-4 shadow-[0_30px_100px_rgba(15,23,42,0.34)] backdrop-blur-xl ${
          darkMode
            ? "border-white/10 bg-[#0d1017]/98"
            : "border-white/80 bg-white/98"
        }`}
      >
        <div
          className={`mb-4 flex items-center justify-between border-b pb-4 ${
            darkMode ? "border-white/10" : "border-black/5"
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
            className={`cursor-pointer rounded-full p-2 transition ${
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6 6 18"
              />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <Sidebar onSelect={onFilterSelect} darkMode={darkMode} />

          <div
            className={`mt-4 space-y-2 rounded-3xl border p-2 ${
              darkMode
                ? "border-white/10 bg-white/3"
                : "border-stone-200 bg-stone-50/90"
            }`}
          >
            <ThemeToggle
              darkMode={darkMode}
              onToggle={onToggleTheme}
              showLabel
              className={`flex w-full cursor-pointer items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition ${
                darkMode
                  ? "bg-slate-900 text-stone-100 hover:bg-slate-800"
                  : "bg-white text-stone-700 hover:bg-stone-100"
              }`}
            />

            {isLoggedIn && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className={`flex w-full cursor-pointer items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition ${
                  darkMode
                    ? "bg-slate-900 text-stone-100 hover:bg-slate-800"
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
