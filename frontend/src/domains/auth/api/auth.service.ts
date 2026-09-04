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
function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url) return url;
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_API_URL is required in production");
  }
  return "http://localhost:8000";
}

const API_BASE_URL = getApiBaseUrl();

export class AuthService {
  /**
   * Register a new user using email and password.
   *
   * This method simply forwards the request to Better Auth.
   * Additional business logic (analytics, logging, etc.)
   * can be added here in the future without changing the UI.
   */
  static async signUp(data: { name: string; email: string; password: string }) {
    return authClient.signUp.email(data);
  }

  /**
   * Sign in a user using email and password.
   *
   * This method forwards the request to Better Auth and provides
   * optional success/error callbacks for the UI to react to.
   */
  static async signIn(data: { email: string; password: string }) {
    return authClient.signIn.email({
      email: data.email,
      password: data.password,
    });
  }

  /**
   * Request a password reset email for the given email address.
   */
  static async requestPasswordReset(data: { email: string }) {
    return authClient.requestPasswordReset({
      email: data.email,
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.AUTH.RESET_PASSWORD}`,
    });
  }

  /**
   * Reset the user's password using the token from the reset email.
   */
  static async resetPassword(data: { newPassword: string; token: string }) {
    return authClient.resetPassword({
      newPassword: data.newPassword,
      token: data.token,
    });
  }

  /**
   * Re-send a verification email for the given email address.
   */
  static async resendVerification(data: { email: string }) {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/resend-verification`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      },
    );

    const payload = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      data: payload,
    };
  }

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
