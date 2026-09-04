// src/constants/routes.ts
export const ROUTES = {
  HOME: "/",

  AUTH: {
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",

    VERIFY_EMAIL: "/sign-up/verify-email",

    VERIFIED: "/sign-up/verified",

    FORGOT_PASSWORD: "/sign-in/forgot-password",

    RESET_PASSWORD: "/sign-in/reset-password",
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
} as const;
