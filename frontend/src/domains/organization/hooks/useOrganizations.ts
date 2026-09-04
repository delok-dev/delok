// src/domains/organization/hooks/useOrganizations.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrganizationService } from "../api/organization.service";
import type { CreateOrganizationInput } from "../types/organization.type";

const ORGANIZATIONS_KEY = ["organizations"] as const;

export function useOrganizations() {
  const { data: organizations, ...query } = useQuery({
    queryKey: ORGANIZATIONS_KEY,
    queryFn: () => OrganizationService.list(),
  });

  const queryClient = useQueryClient();

  const createOrganization = useMutation({
    mutationFn: (input: CreateOrganizationInput) =>
      OrganizationService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_KEY });
    },
  });

  return {
    organizations: organizations ?? [],
    ...query,
    createOrganization,
  };
}
