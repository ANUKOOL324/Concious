import { playUiClickSound } from "../../../HelperFunction/sounds";

interface SidebarToggleButtonProps {
  darkMode: boolean;
  expanded: boolean;
  onClick: () => void;
  controlsId?: string;
  placement?: "inline" | "edge";
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="size-3.5"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
      )}
    </svg>
  );
}

export function SidebarToggleButton({
  darkMode,
  expanded,
  onClick,
  controlsId,
  placement = "inline",
}: SidebarToggleButtonProps) {
  function handleClick() {
    playUiClickSound();
    onClick();
  }

  const isEdge = placement === "edge";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-expanded={expanded}
      aria-controls={controlsId}
      aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
      className={`flex cursor-pointer items-center justify-center border transition-all duration-200 hover:shadow-md active:scale-95 ${
        isEdge
          ? `absolute bottom-36 right-0 z-40 size-7 translate-x-1/2 -translate-y-1/2 rounded-full ${
              darkMode
                ? "border-white/12 bg-[#141820] text-stone-200 shadow-black/40 hover:bg-[#1a2030]"
                : "border-stone-200 bg-white text-stone-600 shadow-stone-300/50 hover:bg-stone-50"
            }`
          : `size-9 rounded-xl ${
              darkMode
                ? "border-white/10 bg-white/6 text-stone-200 hover:bg-white/10"
                : "border-stone-200/90 bg-white/85 text-stone-600 hover:bg-white"
            }`
      }`}
    >
      <ChevronIcon direction={expanded ? "left" : "right"} />
    </button>
  );
}
