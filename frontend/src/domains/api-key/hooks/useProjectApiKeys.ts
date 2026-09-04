// src/domains/api-key/hooks/useProjectApiKeys.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiKeyService } from "../api/api-key.service";

export function useProjectApiKeys(projectId: string) {
  const queryClient = useQueryClient();

  const apiKeysKey = ["api-keys", projectId] as const;

  const query = useQuery({
    queryKey: apiKeysKey,
    queryFn: () => ApiKeyService.listByProject(projectId),
    enabled: Boolean(projectId),
  });

  // Invalidate + refetch on every mutation so the list stays in sync with the
  // server without any manual reload after each CRUD operation.
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: apiKeysKey });
  };

  const createApiKey = useMutation({
    mutationFn: (name: string) => ApiKeyService.create(projectId, { name }),
    onSuccess: invalidate,
  });

  const renameApiKey = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      ApiKeyService.rename(id, name),
    onSuccess: invalidate,
  });

  const revokeApiKey = useMutation({
    mutationFn: (id: string) => ApiKeyService.revoke(id),
    onSuccess: invalidate,
  });

  return {
    apiKeys: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,

    createApiKey,
    renameApiKey,
    revokeApiKey,
  };
}
