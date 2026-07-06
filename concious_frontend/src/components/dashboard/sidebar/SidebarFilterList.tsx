import { useState, type ReactNode } from "react";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { LuLayers, LuNewspaper } from "react-icons/lu";
import { RefreshIcon } from "../../../Icon/RefreshIcon";
import { TwitterIcon } from "../../../Icon/TwitterIcon";
import { YoutubeIcon } from "../../../Icon/YoutubeIcon";
import { SpotifyIcon } from "../../../Icon/SpotifyIcon";
import { SIDEBAR_FILTERS } from "./sidebarConfig";
import { SIDEBAR_ICON, SIDEBAR_ROW, sidebarLabel } from "./sidebarMotion";
import { SidebarNavItem } from "./SidebarNavItem";
import type { FilterType } from "../../../types/content";

type FilterItem = {
  label: string;
  value: FilterType;
  shortLabel: string;
  icon?: ReactNode;
};

const FILTER_ICON_SIZE = 30;

function FilterIconCell({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-8 items-center justify-center [&_svg]:block [&_svg]:size-[30px]">
      {children}
    </span>
  );
}

function buildFilterItems(darkMode: boolean): FilterItem[] {
  return SIDEBAR_FILTERS.map((item) => {
    if (item.value === "Twitter") {
      return {
        ...item,
        icon: (
          <FilterIconCell>
            <TwitterIcon color={darkMode ? "#e7e5e4" : "#111827"} />
          </FilterIconCell>
        ),
      };
    }
    if (item.value === "Youtube") {
      return {
        ...item,
        icon: (
          <FilterIconCell>
            <YoutubeIcon />
          </FilterIconCell>
        ),
      };
    }
    if (item.value === "Spotify") {
      return {
        ...item,
        icon: (
          <FilterIconCell>
            <span className={darkMode ? "text-stone-200" : "text-stone-800"}>
              <SpotifyIcon />
            </span>
          </FilterIconCell>
        ),
      };
    }
    if (item.value === "Article") {
      return {
        ...item,
        icon: (
          <FilterIconCell>
            <LuNewspaper size={FILTER_ICON_SIZE} aria-hidden />
          </FilterIconCell>
        ),
      };
    }
    if (item.value === "PDF") {
      return {
        ...item,
        icon: (
          <FilterIconCell>
            <BsFileEarmarkPdf size={FILTER_ICON_SIZE} aria-hidden />
          </FilterIconCell>
        ),
      };
    }
    if (item.value === "Other") {
      return {
        ...item,
        icon: (
          <FilterIconCell>
            <LuLayers size={FILTER_ICON_SIZE} aria-hidden />
          </FilterIconCell>
        ),
      };
    }
    return item;
  });
}

interface SidebarProps {
  onSelect: (type: FilterType) => void;
  activeFilter?: FilterType;
  darkMode?: boolean;
  expanded?: boolean;
}

export function SidebarFilterList({
  onSelect,
  activeFilter = "ALL",
  darkMode = false,
  expanded = true,
}: SidebarProps) {
  const [resetSpin, setResetSpin] = useState(false);
  const filterItems = buildFilterItems(darkMode);

  function handleReset() {
    setResetSpin(true);
    window.setTimeout(() => setResetSpin(false), 500);
    onSelect("ALL");
  }

  const cardClass = expanded
    ? darkMode
      ? "border-white/10 bg-white/4"
      : "border-stone-200/90 bg-white/80"
    : "border-transparent bg-transparent";

  const activeStyles = darkMode
    ? "bg-violet-500/18 text-violet-100 ring-1 ring-violet-400/25"
    : "bg-violet-100 text-violet-900 ring-1 ring-violet-200";

  const itemTone = darkMode
    ? "text-stone-400 hover:bg-white/6 hover:text-stone-100"
    : "text-stone-600 hover:bg-stone-100/90 hover:text-stone-900";

  const filterLabelTone = darkMode ? "text-stone-500" : "text-stone-400";

  const resetTone =
    activeFilter === "ALL"
      ? darkMode
        ? "border-violet-400/30 bg-violet-500/18 text-violet-200"
        : "border-violet-200 bg-violet-100 text-violet-700"
      : darkMode
        ? "border-white/10 bg-white/5 text-stone-400 hover:bg-white/8"
        : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50";

  return (
    <nav
      aria-label="Content filters"
      className={`overflow-hidden rounded-2xl border border-dashed p-2 ${cardClass}`}
    >
      <div className={`${SIDEBAR_ROW} mb-2 h-10`}>
        <button
          type="button"
          onClick={handleReset}
          title="Show all content"
          aria-label="Show all content"
          className={`${SIDEBAR_ICON} cursor-pointer rounded-xl border ${resetTone} ${resetSpin ? "animate-spin" : ""}`}
        >
          <RefreshIcon />
        </button>
        <span
          className={`text-[0.62rem] font-semibold uppercase tracking-[0.22em] ${filterLabelTone} ${sidebarLabel(expanded, "max-w-[5rem]")}`}
        >
          Filters
        </span>
      </div>

      <ul className="space-y-1">
        {filterItems.map((item) => {
          const isActive = activeFilter === item.value;
          return (
            <li key={item.value}>
              <SidebarNavItem
                expanded={expanded}
                icon={
                  item.icon ?? (
                    <span className="text-[0.62rem] font-bold">{item.shortLabel}</span>
                  )
                }
                label={item.label}
                title={item.label}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                onClick={() => onSelect(item.value)}
                className={`text-sm font-medium ${itemTone} ${isActive ? activeStyles : ""}`}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
