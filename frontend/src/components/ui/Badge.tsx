// src/components/ui/Badge.tsx
import { HTMLAttributes } from "react";
import clsx from "clsx";

export type BadgeVariant =
  | "info"
  | "warn"
  | "error"
  | "fatal"
  | "success"
  | "neutral";

type BadgeProps = {
  variant?: BadgeVariant;
  children: React.ReactNode;
} & HTMLAttributes<HTMLSpanElement>;

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  info: "bg-info/10 text-info border-info/30",
  warn: "bg-warning/10 text-warning border-warning/30",
  error: "bg-danger/10 text-danger border-danger/30",
  fatal: "bg-danger text-primary-foreground border-danger",
  success: "bg-success/10 text-success border-success/30",
  neutral: "bg-surface-hover text-muted-foreground border-border",
};

export default function Badge({
  variant = "neutral",
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex shrink-0 items-center rounded-sm border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
        VARIANT_STYLES[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
