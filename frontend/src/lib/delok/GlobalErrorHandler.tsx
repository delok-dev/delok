// src/lib/delok/GlobalErrorHandler.tsx
"use client";

import { useEffect } from "react";
import { delok } from "./client";

export function GlobalErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      delok.error({
        event: "frontend.unhandled_error",
        message: event.message || "Unhandled frontend error",
        payload: {
          error: event.error instanceof Error ? event.error.message : String(event.error ?? event.message),
        },
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      delok.error({
        event: "frontend.unhandled_rejection",
        message: "Unhandled promise rejection",
        payload: {
          error: reason instanceof Error ? reason.message : String(reason),
        },
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
