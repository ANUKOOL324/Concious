import type { RefObject } from "react";

interface InputProps {
  onChange?: () => void;
  placeholder: string;
  reference: RefObject<HTMLInputElement | null>;
  type?: string;
}

export function Input({
  onChange,
  placeholder,
  reference,
  type = "text",
}: InputProps) {
  return (
    <div>
      <input
        ref={reference}
        placeholder={placeholder}
        type={type}
        className="px-4 py-2 border rounded m-2"
        onChange={onChange}
      ></input>
    </div>
  );
}
