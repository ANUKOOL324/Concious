export const CONTENT_MODAL_SHELL_CLASS =
  "relative z-10 flex max-h-[85vh] w-full max-w-[720px] flex-col overflow-hidden rounded-[1.6rem] border shadow-[0_30px_90px_rgba(15,23,42,0.28)]";

export function contentModalPanelClass(darkMode: boolean) {
  return darkMode
    ? "border-white/10 bg-slate-950 text-stone-100"
    : "border-stone-200 bg-white text-stone-900";
}

export function contentModalOverlayClass(darkMode: boolean) {
  return `cursor-pointer ${
    darkMode
      ? "bg-black/75 backdrop-blur-[2px]"
      : "bg-slate-900/55 backdrop-blur-[2px]"
  }`;
}

export function contentModalFieldClass(darkMode: boolean) {
  return `w-full cursor-text rounded-xl border px-3.5 py-2.5 text-sm outline-none transition ${
    darkMode
      ? "border-white/10 bg-slate-900/80 text-stone-100 placeholder:text-stone-500 focus:border-violet-400/50"
      : "border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:border-violet-300"
  }`;
}

export function contentModalLabelClass(darkMode: boolean) {
  return `mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] ${
    darkMode ? "text-stone-400" : "text-stone-500"
  }`;
}

export function contentModalSectionLabelClass(darkMode: boolean) {
  return `mb-1 block text-sm font-semibold ${
    darkMode ? "text-stone-100" : "text-stone-900"
  }`;
}

export function contentModalHeaderClass(darkMode: boolean) {
  return `shrink-0 border-b px-5 py-4 sm:px-6 ${
    darkMode ? "border-white/10 bg-slate-950" : "border-stone-200 bg-white"
  }`;
}

export function contentModalFooterClass(darkMode: boolean) {
  return `shrink-0 border-t px-5 py-4 sm:px-6 ${
    darkMode ? "border-white/10 bg-slate-950" : "border-stone-200 bg-white"
  }`;
}

export function contentModalCloseButtonClass(darkMode: boolean) {
  return `flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-all duration-200 active:scale-95 ${
    darkMode
      ? "border-white/10 bg-white/5 text-stone-400 hover:border-white/20 hover:bg-white/10 hover:text-stone-100"
      : "border-stone-200 bg-stone-50 text-stone-500 hover:border-stone-300 hover:bg-stone-100 hover:text-stone-800"
  }`;
}

export function contentModalAiMemorySectionClass(darkMode: boolean) {
  return `rounded-2xl border px-4 py-4 ${
    darkMode ? "border-violet-400/20 bg-violet-500/8" : "border-violet-200/80 bg-violet-50/60"
  }`;
}

export function contentModalAdvancedSectionClass(darkMode: boolean) {
  return `rounded-2xl border ${
    darkMode ? "border-white/10 bg-slate-900/45" : "border-stone-200 bg-stone-50"
  }`;
}

export function contentModalScrollClass(darkMode: boolean) {
  return darkMode ? "concious-scrollbar-dark" : "concious-scrollbar-light";
}

export function contentModalPrimaryButtonClass(darkMode: boolean) {
  return `flex h-11 cursor-pointer items-center justify-center rounded-2xl px-6 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
    darkMode
      ? "bg-violet-500 text-white hover:bg-violet-400"
      : "bg-stone-950 text-white hover:bg-stone-800"
  }`;
}

export function contentModalSecondaryButtonClass(darkMode: boolean) {
  return `flex h-11 w-full cursor-pointer items-center justify-center rounded-2xl px-5 text-sm font-medium transition ${
    darkMode
      ? "border border-white/10 bg-slate-950 text-stone-200 hover:bg-slate-800"
      : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-100"
  }`;
}
