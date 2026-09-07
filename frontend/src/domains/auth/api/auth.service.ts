// src/domains/auth/api/auth.service.ts
import { ROUTES } from "@/src/constants/routes";
import { authClient } from "@/src/lib/auth/auth-client";

/**
 * AuthService
 *
 * Centralized service for all authentication-related requests.
 *
 * This layer acts as an abstraction over Better Auth so that the UI
 * (hooks, forms, pages, and components) never communicates directly
 * with authClient.
 *
 * Benefits:
 * - Single place to manage authentication logic.
 * - Easy to replace Better Auth in the future.
 * - Keeps UI components focused on presentation.
 * - Makes testing and maintenance easier.
 */

export class AuthService {
  /**
   * Start Google OAuth authentication flow.
   *
   * After successful authentication, the user will be redirected
   * to the dashboard page.
   */
  static async signInGoogle() {
    return authClient.signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.HOME}`,
    });
  }

  /**
   * Start GitHub OAuth authentication flow.
   *
   * After successful authentication, the user will be redirected
   * to the dashboard page.
   */
  static async signInGithub() {
    return authClient.signIn.social({
      provider: "github",
      callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.HOME}`,
    });
  }
}
