// src/domains/log/components/LogLevelBadge.tsx
type LogLevelBadgeProps = {
  level: string;
};

function getLevelClass(level: string) {
  switch (level.toLowerCase()) {
    case "error":
      return "text-danger";
    case "fatal":
      return "text-danger font-bold";
    case "warn":
      return "text-yellow-500";
    case "debug":
      return "text-muted-foreground";
    default:
      return "text-primary";
  }
}

export function LogLevelBadge({ level }: LogLevelBadgeProps) {
  return (
    <span
      className={`w-14 shrink-0 text-[10px] font-semibold uppercase ${getLevelClass(level)}`}
    >
      {level}
    </span>
  );
}