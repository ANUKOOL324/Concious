export const SIDEBAR_WIDTH_OPEN = "lg:w-52";
export const SIDEBAR_WIDTH_CLOSED = "lg:w-16";
export const SIDEBAR_WIDTH_TRANSITION =
  "transition-[width] duration-200 ease-out motion-reduce:transition-none";

export const SIDEBAR_PAD = "px-2";

export const SIDEBAR_ROW =
  "grid w-full grid-cols-[2rem_minmax(0,1fr)] items-center gap-x-2";

export const SIDEBAR_ICON =
  "flex size-8 items-center justify-center justify-self-center";

export function sidebarLabel(expanded: boolean, maxWidth = "max-w-[9rem]") {
  return `min-w-0 truncate overflow-hidden whitespace-nowrap text-left transition-[max-width,opacity] duration-200 ease-out motion-reduce:transition-none ${
    expanded ? `${maxWidth} opacity-100` : "max-w-0 opacity-0"
  }`;
}
