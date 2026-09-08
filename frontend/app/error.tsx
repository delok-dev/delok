// app/error.tsx
"use client";

import { useEffect } from "react";
import { delok } from "@/src/lib/delok/client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    delok.error({
      event: "frontend.render_error",
      message: "Unexpected frontend rendering error",
      payload: { error: error.message, digest: error.digest },
    });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-lg font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <button onClick={() => reset()} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
        Try again
      </button>
    </div>
  );
}
