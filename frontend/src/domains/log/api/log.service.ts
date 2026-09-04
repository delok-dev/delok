// src/domains/log/api/log.service.ts
import type { LogFiltersState, LogResponse } from "../types/log.type";

function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url) return url;
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_API_URL is required in production");
  }
  return "http://localhost:8000";
}

const API_BASE_URL = getApiBaseUrl();

const EMPTY_FILTERS: LogFiltersState = {
  search: "",
  level: "",
  environment: "",
  from: "",
  to: "",
};

export class LogService {
  static async listByProject(
    projectId: string,
    page = 1,
    limit = 50,
    filters: LogFiltersState = EMPTY_FILTERS,
  ): Promise<LogResponse> {
    const searchParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    const { search, level, environment, from, to } = filters;

    if (search.trim()) searchParams.set("search", search.trim());

    if (level) searchParams.set("level", level);

    if (environment) searchParams.set("environment", environment);

    if (from) searchParams.set("from", from);

    if (to) searchParams.set("to", to);

    const response = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/logs?${searchParams}`,
      {
        credentials: "include",
      },
    );

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(result?.error?.message ?? "Failed to fetch logs");
    }

    return result.data;
  }
}
