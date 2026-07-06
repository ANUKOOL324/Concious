import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ContentType } from "../../types/content";
import { contentModalFieldClass } from "./contentModalStyles";

interface ContentTypeOption {
  label: string;
  value: ContentType;
}

interface MenuPosition {
  top: number;
  left: number;
  width: number;
}

interface ContentTypeSelectProps {
  id: string;
  value: ContentType | "initial";
  options: ContentTypeOption[];
  placeholder?: string;
  onChange: (value: ContentType) => void;
  darkMode: boolean;
}

export function ContentTypeSelect({
  id,
  value,
  options,
  placeholder = "Select type",
  onChange,
  darkMode,
}: ContentTypeSelectProps) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const selectedLabel =
    value === "initial"
      ? placeholder
      : (options.find((option) => option.value === value)?.label ?? placeholder);

  const triggerTextClass =
    value === "initial"
      ? darkMode
        ? "text-stone-500"
        : "text-stone-400"
      : darkMode
        ? "text-stone-100"
        : "text-stone-900";

  function updateMenuPosition() {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  }

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    updateMenuPosition();
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        rootRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    function handleReposition() {
      updateMenuPosition();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open]);

  const menuClass = darkMode
    ? "border border-white/10 bg-slate-900 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
    : "border border-stone-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.12)]";

  const menu =
    open && menuPosition
      ? createPortal(
          <ul
            ref={menuRef}
            role="listbox"
            aria-labelledby={id}
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
            }}
            className={`fixed z-[250] overflow-hidden rounded-xl py-1 ${menuClass}`}
          >
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <li key={option.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`flex w-full cursor-pointer items-center px-3.5 py-2.5 text-left text-sm transition ${
                      isSelected
                        ? darkMode
                          ? "bg-violet-500/15 text-violet-200"
                          : "bg-violet-50 text-violet-700"
                        : darkMode
                          ? "text-stone-200 hover:bg-white/8"
                          : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>,
          document.body
        )
      : null;

  return (
    <>
      <div ref={rootRef} className="relative">
        <button
          ref={triggerRef}
          type="button"
          id={id}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((isOpen) => !isOpen)}
          className={`${contentModalFieldClass(darkMode)} flex cursor-pointer items-center justify-between gap-2 text-left`}
        >
          <span className={`truncate ${triggerTextClass}`}>{selectedLabel}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 transition ${
              darkMode ? "text-stone-400" : "text-stone-500"
            } ${open ? "rotate-180" : ""}`}
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {menu}
    </>
  );
}
