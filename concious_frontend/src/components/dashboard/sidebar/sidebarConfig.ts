import type { ReactNode } from "react";
import type { FilterType } from "../../../types/content";

export type SidebarFilterItem = {
  label: string;
  value: FilterType;
  shortLabel: string;
  icon?: ReactNode;
};

export const SIDEBAR_FILTERS: Omit<SidebarFilterItem, "icon">[] = [
  { label: "Twitter", value: "Twitter", shortLabel: "X" },
  { label: "Youtube", value: "Youtube", shortLabel: "YT" },
  { label: "Spotify", value: "Spotify", shortLabel: "SP" },
  { label: "Article", value: "Article", shortLabel: "AR" },
  { label: "PDF", value: "PDF", shortLabel: "PDF" },
  { label: "Other", value: "Other", shortLabel: "OT" },
];

export const SIDEBAR_WIDTH_EXPANDED = "16rem"; // 256px
export const SIDEBAR_WIDTH_COLLAPSED = "4rem"; // 64px
