import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(8000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  BETTER_AUTH_URL: z.url("BETTER_AUTH_URL must be a valid URL"),
  FRONTEND_URL: z.url("FRONTEND_URL must be a valid URL"),
  DELOK_API_KEY: z.string().min(1, "DELOK_API_KEY is required"),
  DELOK_SDK_BASE_URL: z
    .string()
    .optional()
    .transform((v) => {
      if (v === undefined) return undefined;
      const trimmed = v.trim();
      return trimmed === "" ? undefined : trimmed;
    })
    .refine(
      (v) =>
        v === undefined ||
        (() => {
          try {
            const u = new URL(v);
            return u.protocol === "http:" || u.protocol === "https:";
          } catch {
            return false;
          }
        })(),
      {
        message: "DELOK_SDK_BASE_URL must be a valid http(s) URL",
      },
    )
    .optional(),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  GITHUB_CLIENT_ID: z.string().min(1, "GITHUB_CLIENT_ID is required"),
  GITHUB_CLIENT_SECRET: z.string().min(1, "GITHUB_CLIENT_SECRET is required"),
});

function formatZodError(error: z.ZodError) {
  return error.issues
    .map((i) => `${i.path.join(".")}: ${i.message}`)
    .join("; ");
}

let parsed: z.infer<typeof envSchema>;

try {
  parsed = envSchema.parse(process.env);
} catch (e) {
  if (e instanceof z.ZodError) {
    const msg = formatZodError(e);
    // Fail fast — do not boot with insecure defaults
    throw new Error(`Environment validation failed: ${msg}`);
  }
  throw e;
}

export const env = parsed;
export type Env = typeof env;
