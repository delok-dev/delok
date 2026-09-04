// src/components/ui/Alert.tsx
import { HTMLAttributes } from "react";
import clsx from "clsx";

type AlertVariant = "info" | "warning" | "danger" | "success";

type AlertProps = {
  variant?: AlertVariant;
  children: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

const VARIANT_STYLES: Record<AlertVariant, string> = {
  info: "bg-info/10 text-info border-info/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  danger: "bg-danger/10 text-danger border-danger/30",
  success: "bg-success/10 text-success border-success/30",
};

export default function Alert({
  variant = "info",
  children,
  className,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={clsx(
        "rounded-md border px-3 py-2 text-xs font-medium",
        VARIANT_STYLES[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
