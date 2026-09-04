// src/components/ui/Skeleton.tsx
import { HTMLAttributes } from "react";
import clsx from "clsx";

type SkeletonProps = {
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export default function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={clsx("animate-pulse rounded-md bg-surface-hover", className)}
      {...props}
    />
  );
}
