// /src/lib/auth.ts

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import { env } from "./env.js";
import { delok } from "./delok.js";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.FRONTEND_URL],

  advanced: {
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: true,
    },
  },

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          delok.info({
            event: "auth.sign_in",
            message: `User signed in: ${session.userId}`,
            payload: { userId: session.userId },
          });
        },
      },
    },
    account: {
      create: {
        after: async (account) => {
          if (account.providerId && account.providerId !== "credential") {
            delok.info({
              event: "auth.oauth_sign_in",
              message: `OAuth sign-in via ${account.providerId}`,
              payload: { userId: account.userId, provider: account.providerId },
            });
          }
        },
      },
    },
  },

  onAPIError: {
    throw: false,
    errorURL: `${env.FRONTEND_URL}/auth/error`,
    onError: async (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      delok.warn({
        event: "auth.oauth_failed",
        message: `Authentication failed: ${message}`,
        payload: { error: message },
      });
    },
  } as any,

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
});
