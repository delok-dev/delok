import { AppError } from "../../../utils/AppError.js";

/**
 * Dev-only trusted authentication context for the local proof of concept.
 *
 * THIS IS DEPRECATED AND MUST NEVER BE ACTIVATED IN PRODUCTION.
 *
 * For local testing only. In a production configuration every MCP tool must
 * resolve a verified Delok user id from a trusted auth layer (e.g. the
 * eventual Telegram-account-linking flow). Nothing in this file is a fallback
 * for production; it only exists so the local stdio server can exercise its
 * read-only tools.
 */
export const DEVELOPMENT_TRUST_ENABLED = true;

export interface DevTrustContext {
  map: Map<string, string>; // caller identity -> verified Delok user id
  identity: string;
}

let devContext: DevTrustContext | null = null;

export function setDevTrustContext(map: Map<string, string>, identity: string) {
  devContext = { map, identity };
}

export function clearDevTrustContext() {
  devContext = null;
}

/** Resolve a verified Delok user id from the authenticated MCP caller. */
export function getVerifiedUserId(): string {
  if (devContext) {
    const userId = devContext.map.get(devContext.identity);
    if (!userId) {
      throw new AppError(
        `Unmapped identity: ${devContext.identity}`,
        401,
        "auth.unmapped",
      );
    }
    return userId;
  }
  throw new AppError(
    "No trusted authentication context available",
    401,
    "auth.no_context",
  );
}

/** Whether the dev-only context is currently active. */
export function isDevTrustActive(): boolean {
  return DEVELOPMENT_TRUST_ENABLED && devContext !== null;
}
