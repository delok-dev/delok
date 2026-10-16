import { z } from "zod";

// ---------------------------------------------------------------------------
// Argument schemas
// ---------------------------------------------------------------------------

/**
 * Caller-supplied project identifier.
 *
 * The tool resolves the caller's organization memberships and looks up the
 * project within an organization the caller belongs to. An `organization`
 * argument is NOT a trusted scoping mechanism: project access is always
 * derived from the authenticated caller's memberships, never from a slug the
 * LLM passes through.
 */
export const projectIdentifierSchema = z.object({
  project: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .refine((v) => /^[A-Za-z0-9_\-./]+$/.test(v), {
      message: "identifier may only contain letters, digits, hyphens, underscores and dots",
    }),
});

export type ProjectIdentifier = z.infer<typeof projectIdentifierSchema>;

/** Date-range inputs (coerced to Date). Range must not be backwards. */
export const dateRangeSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export type DateRange = z.infer<typeof dateRangeSchema>;

/**
 * Common args for summary + search + details tools.
 *
 * - `project` is the only user-supplied identifier; it resolves through the
 *   authenticated caller's organization memberships.
 * - `level`, `environment`, `search`, `page`, `limit` are optional/filtered.
 */
export const listLogsArgsSchema = z.object({
  project: projectIdentifierSchema,
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  level: z
    .string()
    .trim()
    .max(30)
    .regex(/^[A-Za-z0-9_\-. ]*$/, {
      message: "level may only contain letters, digits, hyphens, underscores, dots and spaces",
    })
    .optional(),
  environment: z
    .string()
    .trim()
    .max(50)
    .regex(/^[A-Za-z0-9_\-. ]*$/, {
      message: "environment may only contain letters, digits, hyphens, underscores and spaces",
    })
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(250).default(50),
  search: z
    .string()
    .trim()
    .max(200)
    .regex(/^[A-Za-z0-9_\-. ]*$/, {
      message: "search may only contain letters, digits, hyphens, underscores, dots and spaces",
    })
    .optional(),
});

export type ListLogsArgs = z.infer<typeof listLogsArgsSchema>;

/** Narrower args for summary only (time range + optional filters). */
export const summaryArgsSchema = z.object({
  project: projectIdentifierSchema,
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  level: z
    .string()
    .trim()
    .max(30)
    .regex(/^[A-Za-z0-9_\-. ]*$/, {
      message: "level may only contain letters, digits, hyphens, underscores, dots and spaces",
    })
    .optional(),
  environment: z
    .string()
    .trim()
    .max(50)
    .regex(/^[A-Za-z0-9_\-. ]*$/, {
      message: "environment may only contain letters, digits, hyphens, underscores and spaces",
    })
    .optional(),
});

export type SummaryArgs = z.infer<typeof summaryArgsSchema>;
