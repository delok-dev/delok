// src/lib/delok/client.ts
import { Delok } from "@delok/sdk";

type DelokClient = Pick<Delok, "info" | "warn" | "error" | "fatal">;

function createDelokClient(): DelokClient {
  // NEXT_PUBLIC_DELOK_API_KEY is exposed to the browser. This is intentional for
  // frontend self-monitoring: the key is an ingestion-only key, not a secret.
  // If not configured, fall back to a no-op client so the frontend never breaks.
  const apiKey = process.env.NEXT_PUBLIC_DELOK_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    const noop = () => {};
    return { info: noop, warn: noop, error: noop, fatal: noop } as unknown as DelokClient;
  }

  const rawEnv = process.env.NODE_ENV;
  const environment: "development" | "staging" | "production" =
    rawEnv === "production" ? "production" : "development";

  try {
    return new Delok({ apiKey: apiKey.trim(), environment });
  } catch {
    const noop = () => {};
    return { info: noop, warn: noop, error: noop, fatal: noop } as unknown as DelokClient;
  }
}

export const delok = createDelokClient();
