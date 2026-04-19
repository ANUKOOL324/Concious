export function OtherIcon({ darkMode = false }: { darkMode?: boolean }) {
  return (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${
        darkMode ? "bg-violet-500/15 text-violet-200" : "bg-violet-100 text-violet-700"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 3.75h6.879a2.25 2.25 0 0 1 1.591.659l2.621 2.621a2.25 2.25 0 0 1 .659 1.591V18A2.25 2.25 0 0 1 17.25 20.25H7.5A2.25 2.25 0 0 1 5.25 18V6A2.25 2.25 0 0 1 7.5 3.75Z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9.75h7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 13.5h7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 17.25h4.5" />
      </svg>
    </span>
  );
}
