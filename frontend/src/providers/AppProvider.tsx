// src/providers/AppProvider.tsx
"use client";

import { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { SocketProvider } from "./SocketProvider";
import { AuthRoutingProvider } from "./AuthRoutingProvider";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <SocketProvider>
          <AuthRoutingProvider>{children}</AuthRoutingProvider>
        </SocketProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
