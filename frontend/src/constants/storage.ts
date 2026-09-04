// src/constants/storage.ts
export const STORAGE_KEYS = {
  LAST_ORGANIZATION_SLUG: "lastOrganizationSlug",
  LAST_PROJECT_BY_ORGANIZATION: "lastProjectByOrganization",
} as const;

type LastProjectByOrganization = Record<string, string>;

function readLastProjects(): LastProjectByOrganization {
  try {
    const value = window.localStorage.getItem(
      STORAGE_KEYS.LAST_PROJECT_BY_ORGANIZATION,
    );
    const parsed: unknown = value ? JSON.parse(value) : {};

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([, projectId]) => typeof projectId === "string" && projectId,
      ),
    );
  } catch {
    return {};
  }
}

export function getLastProjectId(organizationSlug: string) {
  return readLastProjects()[organizationSlug];
}

export function setLastProjectId(organizationSlug: string, projectId: string) {
  const projects = readLastProjects();
  projects[organizationSlug] = projectId;
  window.localStorage.setItem(
    STORAGE_KEYS.LAST_PROJECT_BY_ORGANIZATION,
    JSON.stringify(projects),
  );
}

export function clearLastProjectId(organizationSlug: string) {
  const projects = readLastProjects();
  delete projects[organizationSlug];
  window.localStorage.setItem(
    STORAGE_KEYS.LAST_PROJECT_BY_ORGANIZATION,
    JSON.stringify(projects),
  );
}
