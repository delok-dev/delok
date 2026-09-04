// src/domains/auth/components/VerifyEmailCard.tsx
import AuthCard from "./AuthCard";
import AuthLayout from "./AuthLayout";

export default function VerifyEmailCard() {
  return (
    <AuthLayout>
      <AuthCard
        title="Check your email"
        subtitle="We’ve sent you a verification link. Open your inbox and click the link to activate your Delok account."
      ></AuthCard>
    </AuthLayout>
  );
}
