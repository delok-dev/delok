// src/domains/log/types/log.type.ts
export type LogLevel = "info" | "warn" | "error" | "fatal" | string;

export type LogEvent = {
  id: string;
  projectId: string;
  environment: string;
  level: LogLevel;
  event: string;
  message: string | null;
  occurredAt: string;
  receivedAt: string;
  payload: Record<string, unknown> | null;

  /**
   * Client-side only: true when the log arrived over the realtime
   * (WebSocket) stream rather than being loaded from the server.
   */
  isRealtime?: boolean;
};

export type LogFiltersState = {
  search: string;
  level: string;
  environment: string;
  from: string;
  to: string;
};

export type LogPagination = {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  total: number;
};

export type LogResponse = {
  logs: LogEvent[];
  pagination: LogPagination;
};
