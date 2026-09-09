// src/constants/routes.ts
export const ROUTES = {
  HOME: "/",

  AUTH: {
    SIGN_IN: "/sign-in",
  },

  ORGANIZATION: {
    ROOT: "/orgs",

    OVERVIEW: (organizationSlug: string) => `/orgs/${organizationSlug}`,

    ORGANIZATION_SETTINGS: (organizationSlug: string) =>
      `/orgs/${organizationSlug}/settings`,

    PROJECTS: (organizationSlug: string) =>
      `/orgs/${organizationSlug}/projects`,

    PROJECT: (organizationSlug: string, projectId: string) =>
      `/orgs/${organizationSlug}/projects/${projectId}`,

    PROJECT_SETTINGS: (organizationSlug: string, projectId: string) =>
      `/orgs/${organizationSlug}/projects/${projectId}/settings`,
  },

  DOCS: {
    ROOT: "/docs",
    INTRODUCTION: "/docs/introduction",
    QUICKSTART: "/docs/quickstart",
    INSTALLATION: "/docs/installation",
    LOGGING: "/docs/logging",
    REFERENCE_LOG_EVENT: "/docs/reference/log-event",
  },

  LEGAL: {
    PRIVACY: "/privacy",
    TERMS: "/terms",
  },
} as const;
