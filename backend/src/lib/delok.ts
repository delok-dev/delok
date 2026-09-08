import { Delok } from "@delok/sdk";
import { env } from "./env.js";

function createDelok(): Pick<Delok, "info" | "warn" | "error" | "fatal"> {
  try {
    return new Delok({
      apiKey: env.DELOK_API_KEY,
      environment: env.NODE_ENV === "production" ? "production" : "development",
    });
  } catch {
    // Fallback no-op client for test/misconfigured environments — never throws
    const noop = () => {};
    return { info: noop, warn: noop, error: noop, fatal: noop } as unknown as Delok;
  }
}

export const delok = createDelok();
