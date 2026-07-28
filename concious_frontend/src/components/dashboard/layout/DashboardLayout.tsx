import type { ReactNode } from "react";

interface DashboardLayoutProps {
  darkMode: boolean;
  children: ReactNode;
}

export function DashboardLayout({ darkMode, children }: DashboardLayoutProps) {
  return (
    <div
      className={`h-dvh w-full max-w-[100vw] overflow-x-hidden overflow-y-hidden ${
        darkMode
          ? "bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.18),transparent_24%),linear-gradient(180deg,#090a0f_0%,#0c0e14_42%,#11131a_100%)]"
          : "bg-[radial-gradient(circle_at_top,rgba(141,128,188,0.15),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8f8fb_45%,#f3f4f6_100%)]"
      }`}
    >
      <div
        className={`pointer-events-none fixed inset-0 bg-size-[28px_28px] ${
          darkMode
            ? "opacity-[0.1] bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]"
            : "opacity-[0.08] bg-[linear-gradient(rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.06)_1px,transparent_1px)]"
        }`}
      />
      {children}
    </div>
  );
}
