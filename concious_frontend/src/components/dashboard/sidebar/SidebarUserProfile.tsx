import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { SIDEBAR_ROW, sidebarLabel } from "./sidebarMotion";

interface SidebarUserProfileProps {
  expanded: boolean;
  darkMode: boolean;
  username: string;
}

function getInitials(username: string) {
  const trimmed = username.trim();
  if (!trimmed) {
    return "U";
  }

  return trimmed.slice(0, 2).toUpperCase();
}

function getAvatarImageUrl(username: string) {
  const seed = encodeURIComponent(username.trim() || "concious-user");
  return `https://api.dicebear.com/9.x/notionists/png?seed=${seed}&size=64&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc`;
}

export function SidebarUserProfile({
  expanded,
  darkMode,
  username,
}: SidebarUserProfileProps) {
  const fallbackClass = darkMode
    ? "bg-violet-500/18 text-violet-200"
    : "bg-violet-100 text-violet-700";

  const nameClass = darkMode ? "text-stone-200" : "text-stone-700";

  return (
    <div
      className={`${SIDEBAR_ROW} mb-2 min-w-0 rounded-xl px-1 py-1`}
      aria-label={`Signed in as ${username}`}
    >
      <Avatar className="size-8 justify-self-center ring-1 ring-black/5">
        <AvatarImage
          src={getAvatarImageUrl(username)}
          alt={`${username} avatar`}
        />
        <AvatarFallback className={fallbackClass}>
          {getInitials(username)}
        </AvatarFallback>
      </Avatar>
      <span
        className={`truncate text-sm font-medium ${nameClass} ${sidebarLabel(expanded, "max-w-[6.5rem]")}`}
      >
        {username}
      </span>
    </div>
  );
}
