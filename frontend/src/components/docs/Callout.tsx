// src/components/docs/Callout.tsx
import { Info } from "lucide-react";

type CalloutProps = {
  children: React.ReactNode;
  variant?: "info" | "warning";
};

export function Callout({ children, variant = "info" }: CalloutProps) {
  return (
    <div
      className={`flex gap-3 rounded-lg border px-4 py-3 text-sm leading-relaxed ${
        variant === "warning"
          ? "border-warning/30 bg-warning/10 text-foreground"
          : "border-border bg-surface text-muted-foreground"
      }`}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="[&>p]:m-0">{children}</div>
    </div>
  );
}
