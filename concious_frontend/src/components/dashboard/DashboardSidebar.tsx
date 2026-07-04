import { Sidebar } from "../Sidebar";
import { Dragspotify } from "../Dragspotify";
import { BrandLogo } from "./BrandLogo";
import { SidebarToggleButton } from "./SidebarToggleButton";
import type { FilterType } from "../../types/content";

interface DashboardSidebarProps {
  darkMode: boolean;
  sidebarOpen: boolean;
  onGoHome: () => void;
  onToggleSidebar: () => void;
  onFilterSelect: (filter: FilterType) => void;
}

export function DashboardSidebar({
  darkMode,
  sidebarOpen,
  onGoHome,
  onToggleSidebar,
  onFilterSelect,
}: DashboardSidebarProps) {
  return (
    <div
      className={`relative shrink-0 border-b backdrop-blur-xl lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-72 lg:min-h-0 lg:flex-col lg:border-r lg:border-b-0 lg:overflow-hidden ${
        darkMode
          ? "border-white/8 bg-[#0b0d12]/88"
          : "border-white/60 bg-white/60"
      }`}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-4 lg:block lg:px-0 lg:py-0">
        <div className="lg:ml-5 lg:pt-4">
          <BrandLogo darkMode={darkMode} onClick={onGoHome} />
        </div>

        <div className="lg:hidden">
          <SidebarToggleButton darkMode={darkMode} onClick={onToggleSidebar} />
        </div>
      </div>

      <div className="hidden flex-col gap-4 px-4 pb-4 lg:mt-3 lg:flex lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:px-3 lg:pb-4">
        <div className="lg:ml-2">
          <SidebarToggleButton darkMode={darkMode} onClick={onToggleSidebar} />
        </div>

        {sidebarOpen && <Sidebar onSelect={onFilterSelect} darkMode={darkMode} />}

        <div className="flex items-center justify-center">
          <Dragspotify darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}
