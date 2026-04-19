import type { RefObject } from "react";

interface InputProps {
  onChange?: () => void;
  placeholder: string;
  reference: RefObject<HTMLInputElement | null>;
  type?: string;
  darkMode?: boolean;
}

export function Input({
  onChange,
  placeholder,
  reference,
  type = "text",
  darkMode = false,
}: InputProps) {
  return (
    <div>
      <input
        ref={reference}
        placeholder={placeholder}
        type={type}
        className={`m-2 w-[calc(100%-1rem)] rounded-xl border px-4 py-3 text-sm outline-none transition ${
          darkMode
            ? "border-white/10 bg-slate-900/80 text-stone-100 placeholder:text-stone-500 focus:border-violet-400/50"
            : "border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:border-violet-300"
        }`}
        onChange={onChange}
      ></input>
    </div>
  );
}
