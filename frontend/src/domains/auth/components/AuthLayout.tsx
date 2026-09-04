// src/domains/auth/components/AuthLayout.tsx
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      {children}
    </main>
  );
}
