// src/utils/format-date.ts
const FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  dateStyle: "medium",
  timeStyle: "short",
};

/**
 * Format an ISO date string into a human-readable localized date-time.
 * Uses "en-US" locale for a consistent cross-platform display.
 */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);

  return date.toLocaleString("en-US", FORMAT_OPTIONS);
}
