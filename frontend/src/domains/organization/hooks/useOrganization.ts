// src/domains/organization/hooks/useOrganization.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrganizationService } from "../api/organization.service";
import type { Organization } from "../types/organization.type";
import type { UpdateOrganizationInput } from "../types/organization.type";

const ORGANIZATIONS_KEY = ["organizations"] as const;

export function useOrganization(slug: string | undefined) {
  const orgKey = ["organization", slug] as const;

  const { data: organization, ...query } = useQuery({
    queryKey: orgKey,
    queryFn: () => OrganizationService.getBySlug(slug!),
    enabled: Boolean(slug),
  });

  const queryClient = useQueryClient();

  const updateOrganization = useMutation({
    mutationFn: (input: UpdateOrganizationInput) =>
      OrganizationService.update(slug!, input),
    onSuccess: (updated) => {
      // Server success is authoritative. Synchronize the organization cache so
      // the detail view and the switcher/list reflect the rename without a
      // full page refresh. Handles slug changes: keep the old detail key in
      // sync for the current page and register the new slug key, and replace
      // the entity in the organization list by stable id.
      queryClient.setQueryData(["organization", slug], updated);
      queryClient.setQueryData(["organization", updated.slug], updated);

      queryClient.setQueryData<Organization[]>(
        ORGANIZATIONS_KEY,
        (current) => {
          if (!current) return current;
          return current.map((org) => (org.id === updated.id ? updated : org));
        },
      );
      queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_KEY });
    },
  });

  const deleteOrganization = useMutation({
    mutationFn: () => OrganizationService.delete(slug!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_KEY });
    },
  });

  return {
    organization,
    ...query,
    updateOrganization,
    deleteOrganization,
  };
}
