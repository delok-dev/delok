// src/domains/log/utils/format.ts
const pad = (value: number) => String(value).padStart(2, "0");

/** YYYY-MM-DD */
export function formatLogDate(value: string): string {
  const date = new Date(value);

  return [
    String(date.getFullYear()),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-");
}

/** HH:mm:ss (24-hour) */
export function formatLogTime(value: string): string {
  const date = new Date(value);

  return [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())].join(
    ":",
  );
}

/** YYYY-MM-DD HH:mm:ss (24-hour) */
export function formatLogTimestamp(value: string): string {
  return `${formatLogDate(value)} ${formatLogTime(value)}`;
}
