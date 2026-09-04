// src/domains/api-key/types/api-key.type.ts
export type ApiKey = {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
};

export type CreateApiKeyInput = {
  name: string;
};
