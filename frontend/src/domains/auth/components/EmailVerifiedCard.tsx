// src/domains/auth/components/EmailVerifiedCard.tsx
import Link from "next/link";

import Button from "@/src/components/ui/Button";

import { ROUTES } from "@/src/constants/routes";

import AuthCard from "./AuthCard";
import AuthLayout from "./AuthLayout";

export default function EmailVerifiedCard() {
  return (
    <AuthLayout>
      <AuthCard
        title="You're all set."
        subtitle="Sign in to start monitoring your systems."
      >
        <div className="mt-6 text-center">
          <Link href={ROUTES.AUTH.SIGN_IN}>
            <Button className="w-full">Sign In</Button>
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
