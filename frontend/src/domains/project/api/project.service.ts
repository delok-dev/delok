// src/domains/project/api/project.service.ts
import { getApiErrorMessage } from "@/src/utils/api-error";

import type {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from "../types/project.type";

function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url) return url;
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_API_URL is required in production");
  }
  return "http://localhost:8000";
}

const API_BASE_URL = getApiBaseUrl();

/**
 * Normalize a project object returned by the API.
 * The backend may use snake_case timestamps (`created_at`, `updated_at`)
 * while the frontend type expects camelCase (`createdAt`, `updatedAt`).
 */
function normalizeProject(raw: Record<string, unknown>): Project {
  return {
    ...raw,
    createdAt: (raw.createdAt as string) ?? (raw.created_at as string),
    updatedAt: (raw.updatedAt as string) ?? (raw.updated_at as string),
  } as Project;
}

/**
 * ProjectService
 *
 * Centralized service for all project-related API requests.
 *
 * All project operations are mounted under an organization boundary:
 * `/api/organizations/:organizationSlug/projects[/:projectId]`
 */
export class ProjectService {
  /**
   * List all projects belonging to an organization.
   * @returns `GET /api/organizations/:organizationSlug/projects`
   */
  static async listByOrganization(
    organizationSlug: string,
  ): Promise<Project[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/organizations/${organizationSlug}/projects`,
      { credentials: "include" },
    );

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(getApiErrorMessage(data, "Failed to fetch projects"));
    }

    const data = await response.json();
    return (data.data ?? []).map(normalizeProject);
  }

  /**
   * Create a project inside an organization. Requires org OWNER role.
   * @returns `POST /api/organizations/:organizationSlug/projects`
   */
  static async create(
    organizationSlug: string,
    input: CreateProjectInput,
  ): Promise<Project> {
    const response = await fetch(
      `${API_BASE_URL}/api/organizations/${organizationSlug}/projects`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(getApiErrorMessage(data, "Failed to create project"));
    }

    return normalizeProject(data.data);
  }

  /**
   * Get a single project by id within an organization.
   * @returns `GET /api/organizations/:organizationSlug/projects/:projectId`
   */
  static async getById(
    organizationSlug: string,
    projectId: string,
  ): Promise<Project> {
    const response = await fetch(
      `${API_BASE_URL}/api/organizations/${organizationSlug}/projects/${projectId}`,
      {
        credentials: "include",
      },
    );

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(getApiErrorMessage(data, "Failed to fetch project"));
    }

    const data = await response.json();
    return normalizeProject(data.data);
  }

  /**
   * Update a project's name within an organization. Requires org OWNER role.
   * @returns `PATCH /api/organizations/:organizationSlug/projects/:projectId`
   */
  static async update(
    organizationSlug: string,
    projectId: string,
    input: UpdateProjectInput,
  ): Promise<Project> {
    const response = await fetch(
      `${API_BASE_URL}/api/organizations/${organizationSlug}/projects/${projectId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(getApiErrorMessage(data, "Failed to update project"));
    }

    return normalizeProject(data.data);
  }

  /**
   * Delete a project within an organization. Requires org OWNER role.
   * Cascades to all ApiKeys and LogEvents.
   * @returns `DELETE /api/organizations/:organizationSlug/projects/:projectId`
   */
  static async delete(
    organizationSlug: string,
    projectId: string,
  ): Promise<Project> {
    const response = await fetch(
      `${API_BASE_URL}/api/organizations/${organizationSlug}/projects/${projectId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(getApiErrorMessage(data, "Failed to delete project"));
    }

    return data.data;
  }
}
