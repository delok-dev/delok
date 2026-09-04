// src/domains/api-key/schemas/api-key.schema.ts
import { z } from "zod";

export const apiKeySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "API Key name must be at least 3 characters")
    .max(100, "API Key name must not exceed 100 characters"),
});
