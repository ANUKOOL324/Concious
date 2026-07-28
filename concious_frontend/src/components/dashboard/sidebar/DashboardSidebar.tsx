import { SidebarFilterList } from "./SidebarFilterList";
import { Briansvg } from "../../../Icon/Brainsvg";
import { BrandLogo } from "./BrandLogo";
import { SidebarLogoutButton } from "./SidebarLogoutButton";
import { SidebarUserProfile } from "./SidebarUserProfile";
import { SidebarToggleButton } from "./SidebarToggleButton";
import {
  SIDEBAR_ICON,
  SIDEBAR_PAD,
  SIDEBAR_ROW,
  SIDEBAR_WIDTH_CLOSED,
  SIDEBAR_WIDTH_OPEN,
  SIDEBAR_WIDTH_TRANSITION,
  sidebarLabel,
} from "./sidebarMotion";

import type { FilterType } from "../../../types/content";

interface DashboardSidebarProps {
  darkMode: boolean;
  sidebarOpen: boolean;
  activeFilter: FilterType;
  isLoggedIn: boolean;
  username: string;
  onGoHome: () => void;
  onToggleSidebar: () => void;
  onFilterSelect: (filter: FilterType) => void;
  onLogout: () => void;
}

export function DashboardSidebar({
  darkMode,
  sidebarOpen,
  activeFilter,
  isLoggedIn,
  username,
  onGoHome,
  onToggleSidebar,
  onFilterSelect,
  onLogout,
}: DashboardSidebarProps) {
  const shellClass = darkMode
    ? "border-white/10 bg-[#0b0d12]/82"
    : "border-white/70 bg-white/68";

  return (
    <>
      <div
        className={`flex min-w-0 max-w-full items-center justify-between gap-2 overflow-hidden border-b px-3 py-2.5 backdrop-blur-xl sm:gap-3 sm:px-4 sm:py-3 lg:hidden ${shellClass}`}
      >
        <div className="min-w-0 flex-1 overflow-hidden">
          <BrandLogo darkMode={darkMode} size="sm" onClick={onGoHome} />
        </div>
        <SidebarToggleButton
          darkMode={darkMode}
          expanded={sidebarOpen}
          onClick={onToggleSidebar}
          controlsId="dashboard-sidebar-panel"
        />
      </div>

      <aside
        id="dashboard-sidebar-panel"
        aria-label="Dashboard sidebar"
        className={`relative z-20 hidden shrink-0 flex-col overflow-visible border-r backdrop-blur-2xl lg:flex lg:sticky lg:top-0 lg:h-dvh lg:min-h-0 ${
          sidebarOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED
        } ${SIDEBAR_WIDTH_TRANSITION} ${shellClass}`}
      >
        <div
          className={`flex h-14 shrink-0 items-center border-b ${SIDEBAR_PAD} ${
            darkMode ? "border-white/8" : "border-stone-200/70"
          }`}
        >
          <button
            type="button"
            onClick={onGoHome}
            aria-label="Go to home"
            className={`${SIDEBAR_ROW} min-w-0 flex-1 overflow-hidden pl-2`}
          >
            <span className={`${SIDEBAR_ICON} [&_svg]:size-8`}>
              <Briansvg darkMode={darkMode} />
            </span>
            <span
              className={`truncate text-left text-xl font-semibold ${sidebarLabel(sidebarOpen, "max-w-[6.5rem]")}`}
            >
              <span className={darkMode ? "text-stone-100" : "text-black"}>Conc</span>
              <span style={{ color: "#8d80bc" }}>ious</span>
            </span>
          </button>
        </div>

        <div className={`flex min-h-0 flex-1 flex-col overflow-hidden py-3 ${SIDEBAR_PAD}`}>
          <SidebarFilterList
            onSelect={onFilterSelect}
            activeFilter={activeFilter}
            darkMode={darkMode}
            expanded={sidebarOpen}
          />
        </div>

        {isLoggedIn && (
          <div
            className={`shrink-0 border-t py-3 ${SIDEBAR_PAD} ${
              darkMode ? "border-white/8" : "border-stone-200/70"
            }`}
          >
            <SidebarUserProfile
              expanded={sidebarOpen}
              darkMode={darkMode}
              username={username}
            />
            <SidebarLogoutButton
              expanded={sidebarOpen}
              darkMode={darkMode}
              onLogout={onLogout}
            />
          </div>
        )}

        <SidebarToggleButton
          darkMode={darkMode}
          expanded={sidebarOpen}
          onClick={onToggleSidebar}
          controlsId="dashboard-sidebar-panel"
          placement="edge"
        />
      </aside>
    </>
  );
}
