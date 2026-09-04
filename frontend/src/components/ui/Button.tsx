// src/components/ui/Button.tsx
import { ButtonHTMLAttributes } from "react";
import Link from "next/link";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "ghost";

type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement> & {
    /** When provided, renders as a Next.js link styled as a button. */
    href?: string;
  };

export default function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  className,
  href,
  ...props
}: ButtonProps) {
  const classes = clsx(
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 cursor-pointer",
    "disabled:opacity-50 disabled:pointer-events-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",

    {
      "px-3 py-2 text-sm": size === "sm",
      "px-4 py-2 text-sm": size === "md",
      "px-5 py-3 text-base": size === "lg",

      "bg-primary text-primary-foreground hover:opacity-90 focus-visible:ring-primary":
        variant === "primary",

      "bg-surface border border-border text-foreground hover:bg-surface-hover focus-visible:ring-primary":
        variant === "secondary",

      "bg-danger text-white hover:opacity-90 focus-visible:ring-danger":
        variant === "danger",

      "bg-success text-white hover:opacity-90 focus-visible:ring-success":
        variant === "success",

      "bg-transparent text-foreground hover:bg-surface-hover focus-visible:ring-primary":
        variant === "ghost",
    },

    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {loading ? "Loading..." : children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {loading ? "Loading..." : children}
    </button>
  );
}
