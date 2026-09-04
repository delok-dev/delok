// src/components/ui/Card.tsx
import { HTMLAttributes } from "react";
import clsx from "clsx";

type CardProps = HTMLAttributes<HTMLDivElement>;

export default function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-surface border border-border rounded-lg shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
