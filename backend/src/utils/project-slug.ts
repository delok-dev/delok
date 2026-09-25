// /src/utils/project-slug.ts

import { generateSlug } from "./generate-slug.js";

const SUFFIX_LENGTH = 12;

/**
 * Generate a random suffix for project slug.
 * Uses crypto.randomBytes for cryptographically secure randomness.
 */
export function generateProjectSlugSuffix(): string {
  const bytes = new Uint8Array(Math.ceil(SUFFIX_LENGTH / 2));
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, SUFFIX_LENGTH);
}

/**
 * Generate the normalized prefix from a project name.
 */
export function generateProjectSlugPrefix(name: string): string {
  return generateSlug(name);
}

/**
 * Generate a full project slug from name.
 * Format: normalized-name-randomsuffix
 */
export function generateProjectSlug(name: string): string {
  const prefix = generateProjectSlugPrefix(name);
  const suffix = generateProjectSlugSuffix();
  return `${prefix}-${suffix}`;
}

/**
 * Regenerate project slug prefix from new name while keeping the existing suffix.
 * Expected format: prefix-suffix
 */
export function regenerateProjectSlugPrefix(name: string, existingSlug: string): string {
  const prefix = generateProjectSlugPrefix(name);
  const parts = existingSlug.split("-");
  const suffix = parts[parts.length - 1];
  return `${prefix}-${suffix}`;
}