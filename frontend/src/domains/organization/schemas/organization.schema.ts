// src/domains/organization/schemas/organization.schema.ts
import { z } from "zod";

export const organizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Organization name must be at least 3 characters")
    .max(100, "Organization name must not exceed 100 characters")
    .regex(
      /^(?!-)(?!.*--)(?!.*-$)[A-Za-z0-9]+(?:[ -][A-Za-z0-9]+)*$/,
      "Only alphanumeric characters, spaces, and single hyphens are allowed, and the name cannot start or end with a hyphen",
    ),
});
