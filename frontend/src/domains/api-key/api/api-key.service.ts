// src/domains/api-key/api/api-key.service.ts
import type { ApiKey, CreateApiKeyInput } from "../types/api-key.type";

function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url) return url;
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_API_URL is required in production");
  }
  return "http://localhost:8000";
}

const API_BASE_URL = getApiBaseUrl();

export class ApiKeyService {
  static async listByProject(projectId: string): Promise<ApiKey[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/api-keys`,
      {
        credentials: "include",
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.error?.message ?? "Failed to fetch API keys");
    }

    return data.data ?? [];
  }

  static async create(
    projectId: string,
    input: CreateApiKeyInput,
  ): Promise<string> {
    const response = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/api-keys`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.error?.message ?? "Failed to create API key");
    }

    return data.data.key;
  }

  static async rename(id: string, name: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/api-key/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.error?.message ?? "Failed to rename API key");
    }
  }

  static async revoke(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/api-key/${id}/revoke`, {
      method: "PATCH",
      credentials: "include",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.error?.message ?? "Failed to revoke API key");
    }
  }
}
