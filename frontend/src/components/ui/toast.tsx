// src/components/ui/toast.tsx
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

import type { ComponentType, ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning" | "default";

type ShowToastOptions = {
  message: ReactNode;
  description?: ReactNode;
  type?: ToastType;
  duration?: number;
};

type ToastContentProps = {
  id: number | string;
  type: ToastType;
  message: ReactNode;
  description?: ReactNode;
  duration: number;
};

const ICONS: Record<ToastType, ComponentType<{ className?: string }> | null> = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
  warning: AlertTriangle,
  default: null,
};

const ICON_CLASS: Record<ToastType, string> = {
  success: "text-success",
  error: "text-danger",
  info: "text-info",
  warning: "text-warning",
  default: "text-muted-foreground",
};

function ToastContent({
  id,
  type,
  message,
  description,
  duration,
}: ToastContentProps) {
  const Icon = ICONS[type];

  return (
    <div
      data-type={type}
      className="relative w-80 overflow-hidden rounded-lg border border-border bg-background/95 p-4 shadow-lg backdrop-blur"
      onMouseEnter={(e) =>
        (
          e.currentTarget.querySelector(
            "[data-toast-progress]",
          ) as HTMLElement | null
        )?.style.setProperty("animation-play-state", "paused")
      }
      onMouseLeave={(e) =>
        (
          e.currentTarget.querySelector(
            "[data-toast-progress]",
          ) as HTMLElement | null
        )?.style.setProperty("animation-play-state", "running")
      }
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${ICON_CLASS[type]}`} />
        )}

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{message}</p>

          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => toast.dismiss(id)}
          className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Countdown progress bar: empties over `duration`, pausing on hover to
          stay in sync with Sonner's own auto-dismiss timer. */}
      <div
        data-toast-progress
        className="absolute inset-x-0 bottom-0 h-0.5 bg-border/50"
      >
        <div
          className="h-full origin-left animate-[toast-progress_linear_forwards] bg-primary"
          style={{
            animationDuration: `${duration}ms`,
          }}
        />
      </div>
    </div>
  );
}

const DEFAULT_DURATION = 3000;

/**
 * Show a toast with a close button and a countdown progress bar that empties
 * as the toast counts down to auto-dismiss. The progress bar pauses on hover,
 * matching Sonner's own hover-pause behavior so the two stay in sync.
 */
export function showToast(options: ShowToastOptions) {
  const {
    message,
    description,
    type = "default",
    duration = DEFAULT_DURATION,
  } = options;

  toast.custom(
    (id) => (
      <ToastContent
        id={id}
        type={type}
        message={message}
        description={description}
        duration={duration}
      />
    ),
    { duration },
  );
}
