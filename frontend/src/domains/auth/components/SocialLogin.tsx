// src/domains/auth/components/SocialLogin.tsx
"use client";

import Button from "@/src/components/ui/Button";
import { GitHubIcon, GoogleIcon } from "@/src/components/svg";
import { AuthService } from "../api/auth.service";

export default function SocialLogin() {
  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="secondary"
        className="w-full flex items-center justify-center"
        onClick={async () => {
          try {
            const result = await AuthService.signInGoogle();
            if (result?.error) {
              console.error("OAuth sign-in failed", { provider: "google", error: String(result.error.message ?? result.error) });
            }
          } catch (error) {
            console.error("OAuth sign-in failed", { provider: "google", error: error instanceof Error ? error.message : String(error) });
          }
        }}
      >
        <GoogleIcon className="h-4 w-4 mr-2" />
        Continue with Google
      </Button>

      <Button
        variant="secondary"
        className="w-full flex items-center justify-center"
        onClick={async () => {
          try {
            const result = await AuthService.signInGithub();
            if (result?.error) {
              console.error("OAuth sign-in failed", { provider: "github", error: String(result.error.message ?? result.error) });
            }
          } catch (error) {
            console.error("OAuth sign-in failed", { provider: "github", error: error instanceof Error ? error.message : String(error) });
          }
        }}
      >
        <GitHubIcon className="h-4 w-4 mr-2" />
        Continue with GitHub
      </Button>
    </div>
  );
}
