export const NAV_BTN =
  "inline-flex h-10 min-h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 text-sm font-medium whitespace-nowrap transition active:scale-[0.98]";

export const NAV_ICON_BTN = `${NAV_BTN} w-10 min-w-10 px-0`;

export function navShellClass(darkMode: boolean) {
  return darkMode
    ? "border-white/12 bg-[#10131b]/72 shadow-[0_12px_40px_rgba(0,0,0,0.28)]"
    : "border-white/80 bg-white/72 shadow-[0_10px_36px_rgba(15,23,42,0.06)]";
}

export function navGhostBtnClass(darkMode: boolean) {
  return darkMode
    ? "border border-white/10 bg-white/6 text-stone-200 hover:bg-white/10"
    : "border border-stone-200/90 bg-white/80 text-stone-600 hover:bg-white";
}

export function navSearchClass(darkMode: boolean) {
  return darkMode
    ? "border-white/10 bg-white/6 text-stone-100 placeholder:text-stone-500 focus:border-violet-400/35 focus:bg-white/8"
    : "border-stone-200/90 bg-white/75 text-stone-800 placeholder:text-stone-400 focus:border-violet-300 focus:bg-white/90";
}

export function navPanelClass(darkMode: boolean) {
  return darkMode
    ? "border-white/10 bg-[#10131b]/78 shadow-[0_14px_40px_rgba(0,0,0,0.22)]"
    : "border-white/80 bg-white/78 shadow-[0_12px_36px_rgba(15,23,42,0.08)]";
}
