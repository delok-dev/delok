// src/domains/project/schemas/project.schema.ts
import { z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must not exceed 100 characters"),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
