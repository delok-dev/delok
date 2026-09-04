// src/components/layout/topbar/UserAvatar.tsx
type UserAvatarProps = {
  name?: string | null;
  size?: "sm" | "md";
};

export function UserAvatar({ name, size = "md" }: UserAvatarProps) {
  const initials =
    name
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "U";

  const sizeClass = size === "sm" ? "h-6 w-6 text-[11px]" : "h-7 w-7 text-xs";

  return (
    <span
      className={`flex items-center justify-center rounded-full bg-primary-foreground text-primary font-semibold ${sizeClass}`}
    >
      {initials}
    </span>
  );
}
