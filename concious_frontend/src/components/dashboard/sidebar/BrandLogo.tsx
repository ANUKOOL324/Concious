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
  const textSize = size === "sm" ? "text-2xl" : "text-[2rem] sm:text-3xl";

  return (
    <div
      onClick={onClick}
      className={`flex select-none items-center gap-2 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <Briansvg darkMode={darkMode} />
      {!iconOnly && (
        <div className={`flex ${textSize}`}>
          <span className={darkMode ? "text-stone-100" : "text-black"}>Conc</span>
          <span style={{ color: "#8d80bc" }}>ious</span>
        </div>
      )}
    </div>
  );
}
