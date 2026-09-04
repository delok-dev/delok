// src/domains/organization/api/organization.service.ts
import { getApiErrorCode, getApiErrorMessage } from "@/src/utils/api-error";

import type {
  CreateOrganizationInput,
  Organization,
  UpdateOrganizationInput,
} from "../types/organization.type";

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
 * Normalize an organization object returned by the API.
 * The backend may use snake_case timestamps (`created_at`, `updated_at`)
 * while the frontend type expects camelCase (`createdAt`, `updatedAt`).
 */
function normalizeOrganization(raw: Record<string, unknown>): Organization {
  return {
    ...raw,
    createdAt: (raw.createdAt as string) ?? (raw.created_at as string),
    updatedAt: (raw.updatedAt as string) ?? (raw.updated_at as string),
  } as Organization;
}

const ORGANIZATION_SLUG_ALREADY_EXISTS = "ORGANIZATION_SLUG_ALREADY_EXISTS";

/**
 * OrganizationService
 *
 * Centralized service for all organization-related API requests.
 * The backend uses organization *slugs* as the URL identifier for
 * single-resource operations (`/api/organization/:slug`).
 */
export class OrganizationService {
  /**
   * List all organizations the authenticated user belongs to.
   * @returns `GET /api/organization`
   */
  static async list(): Promise<Organization[]> {
    const response = await fetch(`${API_BASE_URL}/api/organization`, {
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.error?.message ?? "Failed to fetch organizations");
    }

    const data = await response.json();
    return (data.data ?? []).map(normalizeOrganization);
  }

  /**
   * Create a new organization. The authenticated user becomes the OWNER.
   * @returns `POST /api/organization`
   */
  static async create(input: CreateOrganizationInput): Promise<Organization> {
    const response = await fetch(`${API_BASE_URL}/api/organization`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
      if (getApiErrorCode(data) === ORGANIZATION_SLUG_ALREADY_EXISTS) {
        throw new Error("Organization name is unavailable");
      }
      throw new Error(
        getApiErrorMessage(data, "Failed to create organization"),
      );
    }

    return normalizeOrganization(data.data);
  }

  /**
   * Get a single organization by slug.
   * @returns `GET /api/organization/:slug`
   */
  static async getBySlug(slug: string): Promise<Organization> {
    const response = await fetch(`${API_BASE_URL}/api/organization/${slug}`, {
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.error?.message ?? "Failed to fetch organization");
    }

    const data = await response.json();
    return normalizeOrganization(data.data);
  }

  /**
   * Update an organization's name. The slug is regenerated from the new name.
   * @returns `PATCH /api/organization/:slug`
   */
  static async update(
    slug: string,
    input: UpdateOrganizationInput,
  ): Promise<Organization> {
    const response = await fetch(`${API_BASE_URL}/api/organization/${slug}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
      if (getApiErrorCode(data) === ORGANIZATION_SLUG_ALREADY_EXISTS) {
        throw new Error("Organization name is unavailable");
      }
      throw new Error(
        getApiErrorMessage(data, "Failed to update organization"),
      );
    }

    return normalizeOrganization(data.data);
  }

  /**
   * Delete an organization by slug. Cascades to projects, API keys, members.
   * @returns `DELETE /api/organization/:slug`
   */
  static async delete(slug: string): Promise<Organization> {
    const response = await fetch(`${API_BASE_URL}/api/organization/${slug}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message ?? "Failed to delete organization");
    }

    return data.data;
  }
}
