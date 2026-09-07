// src/providers/AppProvider.tsx
"use client";

import { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { AuthRoutingProvider } from "./AuthRoutingProvider";

// Note: SocketProvider is intentionally NOT mounted here. It is mounted in
// app/(root)/orgs/layout.tsx so the WebSocket connection is only established
// inside the authenticated organization area, never on public pages.

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthRoutingProvider>{children}</AuthRoutingProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
