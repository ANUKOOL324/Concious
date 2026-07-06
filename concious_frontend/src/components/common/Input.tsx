import { useState, type RefObject } from "react";

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
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (visible ? "text" : "password") : type;

  return (
    <div className="relative w-full">
      <input
        ref={reference}
        placeholder={placeholder}
        type={inputType}
        className={`m-2 w-[calc(100%-1rem)] rounded-xl border pl-4 py-3 text-sm outline-none transition ${
          isPassword ? "pr-10" : "pr-4"
        } ${
          darkMode
            ? "border-white/10 bg-slate-900/80 text-stone-100 placeholder:text-stone-500 focus:border-violet-400/50"
            : "border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:border-violet-300"
        }`}
        onChange={onChange}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className={`absolute right-5 top-1/2 -translate-y-1/2 flex items-center justify-center transition focus:outline-none cursor-pointer ${
            darkMode ? "text-stone-400 hover:text-stone-200" : "text-stone-400 hover:text-stone-600"
          }`}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
