// src/components/ui/Input.tsx
"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import clsx from "clsx";

type InputProps = {
  label?: string;
  error?: string;
  helperText?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, type = "text", className, id, ...props },
    ref,
  ) => {
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);

    const resolvedType = isPassword && showPassword ? "text" : type;

    return (
      <div className="space-y-1">
        <div
          className={clsx(
            "relative rounded-md border bg-surface",
            "border-border",
            "transition-colors",
            "focus-within:border-primary focus-within:ring-1 focus-within:ring-primary",
            error && [
              "border-danger",
              "focus-within:border-danger",
              "focus-within:ring-danger",
            ],
          )}
        >
          {label && (
            <label
              htmlFor={id}
              className="block px-3 pt-2 text-xs font-medium text-muted-foreground"
            >
              {label}
            </label>
          )}

          <input
            ref={ref}
            id={id}
            type={resolvedType}
            className={clsx(
              "w-full bg-transparent text-sm text-foreground",
              "placeholder:text-muted-foreground",
              "px-3 pt-1 pb-2 outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className={clsx(
                "absolute right-3 bottom-2",
                "text-muted-foreground",
                "transition-colors",
                "hover:text-foreground",
                "focus:outline-none",
              )}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7" />
                  <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
                  <path d="M20 20 4 4" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}
        </div>

        {helperText && !error && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}

        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
