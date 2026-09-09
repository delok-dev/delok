"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  // Placeholder to avoid hydration mismatch / layout shift
  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        aria-hidden
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground opacity-0"
        tabIndex={-1}
      >
        <span className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
    >
      <span className="relative h-4 w-4 overflow-hidden">
        <Sun
          className={`absolute inset-0 h-4 w-4 transition-all duration-200 ${
            isDark
              ? "scale-100 rotate-0 opacity-100"
              : "scale-75 -rotate-90 opacity-0"
          }`}
          aria-hidden="true"
        />
        <Moon
          className={`absolute inset-0 h-4 w-4 transition-all duration-200 ${
            isDark
              ? "scale-75 rotate-90 opacity-0"
              : "scale-100 rotate-0 opacity-100"
          }`}
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
