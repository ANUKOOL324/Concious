import { Briansvg } from "../../../Icon/Brainsvg";

interface BrandLogoProps {
  darkMode: boolean;
  onClick?: () => void;
  size?: "sm" | "lg";
  iconOnly?: boolean;
}

export function BrandLogo({
  darkMode,
  onClick,
  size = "lg",
  iconOnly = false,
}: BrandLogoProps) {
  const textSize = size === "sm" ? "text-xl sm:text-2xl" : "text-[1.7rem] sm:text-3xl";

  return (
    <div
      onClick={onClick}
      className={`flex min-w-0 select-none items-center gap-1.5 sm:gap-2 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <span className="shrink-0">
        <Briansvg darkMode={darkMode} />
      </span>
      {!iconOnly && (
        <div className={`min-w-0 truncate ${textSize}`}>
          <span className={darkMode ? "text-stone-100" : "text-black"}>Conc</span>
          <span style={{ color: "#8d80bc" }}>ious</span>
        </div>
      )}
    </div>
  );
}
