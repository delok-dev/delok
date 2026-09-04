// src/views/orgs/organization/settings/OrganizationSettingsView.tsx
"use client";

import { useRouter } from "next/navigation";

import { showToast } from "@/src/components/ui/toast";

import {
  OrganizationDangerZone,
  OrganizationSettings,
  useOrganization,
} from "@/src/domains/organization";

import { ROUTES } from "@/src/constants/routes";
import { formatDateTime } from "@/src/utils/format-date";

type OrganizationSettingsViewProps = {
  organizationSlug: string;
};

/**
 * Composes the Organization Settings screen: wires the organization mutations
 * to the domain components and owns the navigation that follows a successful
 * mutation (redirect on slug change, exit to the org list after deletion).
 */
export function OrganizationSettingsView({
  organizationSlug,
}: OrganizationSettingsViewProps) {
  const router = useRouter();

  const { organization, updateOrganization, deleteOrganization } =
    useOrganization(organizationSlug);

  const isDeleting = deleteOrganization.isPending;

  const handleUpdate = async (name: string) => {
    const updated = await updateOrganization.mutateAsync({ name });

    // The URL contains the old slug after a rename, so follow the
    // organization to its new projects route.
    if (updated.slug && updated.slug !== organizationSlug) {
      router.replace(ROUTES.ORGANIZATION.PROJECTS(updated.slug));
    }
  };

  const handleDelete = async () => {
    await deleteOrganization.mutateAsync();

    showToast({ message: "Organization deleted", type: "success" });

    router.replace(ROUTES.ORGANIZATION.ROOT);
  };

  return (
    <div className="w-full max-w-4xl p-4 sm:p-6">
      <div className="space-y-10 sm:space-y-12">
        {/* Details */}
        {(organization?.createdAt || organization?.updatedAt) && (
          <section>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {organization.createdAt && (
                <div>
                  <dt className="text-xs text-muted-foreground">Created</dt>
                  <dd className="mt-0.5 text-sm text-foreground">
                    {formatDateTime(organization.createdAt)}
                  </dd>
                </div>
              )}

              {organization.updatedAt && (
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Last updated
                  </dt>
                  <dd className="mt-0.5 text-sm text-foreground">
                    {formatDateTime(organization.updatedAt)}
                  </dd>
                </div>
              )}
            </dl>
          </section>
        )}

        <OrganizationSettings
          organizationName={organization?.name ?? ""}
          onUpdate={handleUpdate}
        />

        <OrganizationDangerZone
          organizationName={organization?.name ?? ""}
          isDeleting={isDeleting}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
