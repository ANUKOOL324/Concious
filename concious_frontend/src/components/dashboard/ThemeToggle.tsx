interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({
  darkMode,
  onToggle,
  showLabel = false,
  className = "",
}: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      className={className}
    >
      {showLabel && (
        <span>{darkMode ? "Light" : "Dark"}</span>
      )}
      {darkMode ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={`h-5 w-5 ${showLabel ? "text-amber-300" : ""}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1.5M12 19.5V21M4.5 12H3m18 0h-1.5M6.343 6.343 5.28 5.28m13.44 13.44-1.062-1.063M6.343 17.657 5.28 18.72m13.44-13.44-1.062 1.063M15.75 12A3.75 3.75 0 1 1 8.25 12a3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12.79A9 9 0 1 1 11.21 3a7.5 7.5 0 0 0 9.79 9.79Z"
          />
        </svg>
      )}
    </button>
  );
}
