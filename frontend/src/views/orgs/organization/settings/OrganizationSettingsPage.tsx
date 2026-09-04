// src/views/orgs/organization/settings/OrganizationSettingsPage.tsx
"use client";

import { useParams } from "next/navigation";

import { OrganizationSettingsView } from "./OrganizationSettingsView";

/**
 * Screen entry point for Organization Settings. Loading and not-found states
 * are already handled by the organization layout; this page only extracts the
 * route parameter and delegates to the view.
 */
export default function OrganizationSettingsPage() {
  const { organizationSlug } = useParams<{
    organizationSlug: string;
  }>();

  return <OrganizationSettingsView organizationSlug={organizationSlug} />;
}
