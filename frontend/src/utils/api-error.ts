// src/utils/api-error.ts
type ApiErrorBody = {
  error?: { code?: string; message?: string };
  errors?: Array<{
    code?: string;
    message?: string;
    path?: (string | number)[];
  }>;
  errorDetail?: { code?: string; message?: string };
};

export function getApiErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;

  const data = body as ApiErrorBody;

  return (
    data.error?.message ??
    data.errorDetail?.message ??
    data.errors?.[0]?.message ??
    fallback
  );
}

export function getApiErrorCode(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;

  const data = body as ApiErrorBody;

  return data.error?.code ?? data.errorDetail?.code;
}
