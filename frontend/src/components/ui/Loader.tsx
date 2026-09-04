// src/components/ui/Loader.tsx
import { HTMLAttributes } from "react";
import clsx from "clsx";

type LoaderProps = {
  label?: string;
} & HTMLAttributes<HTMLDivElement>;

const BARS = [
  "h-5",
  "mx-1.5 h-8",
  "h-5",
];

export default function Loader({
  label = "Loading",
  className,
  ...props
}: LoaderProps) {
  return (
    <div
      {...props}
      role="status"
      className={clsx(
        "inline-flex items-center justify-center text-primary",
        className,
      )}
    >
      {BARS.map((bar, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={clsx(
            "inline-block w-0.75 rounded-full bg-current opacity-50 animate-delok-loader-bar",
            bar,
          )}
        />
      ))}

      <span className="sr-only">{label}</span>
    </div>
  );
}
