// src/lib/websocket/realtime.types.ts
export type RealtimeEvent = {
  "log.created": {
    id: string;
    projectId: string;
    environment: string;
    level: string;
    event: string;
    message: string | null;
    occurredAt: string;
    receivedAt: string;
    payload: Record<string, unknown> | null;
  };

  "project.log_count.updated": {
    projectId: string;
    logCount: number;
  };
};
