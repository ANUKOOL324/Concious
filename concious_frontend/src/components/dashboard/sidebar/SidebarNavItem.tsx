import type { ButtonHTMLAttributes, ReactNode } from "react";
import { SIDEBAR_ICON, SIDEBAR_ROW, sidebarLabel } from "./sidebarMotion";

interface SidebarNavItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  expanded: boolean;
  icon: ReactNode;
  label: string;
  labelMaxWidth?: string;
}

export function SidebarNavItem({
  expanded,
  icon,
  label,
  labelMaxWidth,
  className = "",
  type = "button",
  ...props
}: SidebarNavItemProps) {
  return (
    <button
      type={type}
      className={`${SIDEBAR_ROW} h-10 cursor-pointer rounded-xl ${className}`}
      {...props}
    >
      <span className={SIDEBAR_ICON}>{icon}</span>
      <span className={sidebarLabel(expanded, labelMaxWidth)}>{label}</span>
    </button>
  );
}
