// src/providers/SocketProvider.tsx
"use client";

import { ReactNode, useEffect } from "react";

import { websocketManager } from "@/src/lib/websocket/websocket";

export function SocketProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    websocketManager.connect();

    return () => websocketManager.disconnect();
  }, []);

  return <>{children}</>;
}
