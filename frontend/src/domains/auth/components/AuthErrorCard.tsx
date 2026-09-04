// src/domains/auth/components/AuthErrorCard.tsx
import { Button } from "@/src/components/ui";
import AuthCard from "./AuthCard";
import AuthLayout from "./AuthLayout";
import Link from "next/link";
import { ROUTES } from "@/src/constants/routes";

export default function AuthErrorCard() {
  return (
    <AuthLayout>
      <AuthCard
        title="Authentication Error"
        subtitle="Something went wrong during authentication. Please try again."
      >
        <div className="text-center">
          <Button>
            <Link href={ROUTES.AUTH.SIGN_IN}>Back to Sign In page</Link>
          </Button>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
