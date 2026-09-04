// src/views/orgs/components/OrganizationsShell.tsx
import { ReactNode } from "react";

import { OrganizationsTopbar } from "@/src/components/layout/topbar/OrganizationsTopbar";

type OrganizationsShellProps = {
  children: ReactNode;
};

export default function OrganizationsShell({
  children,
}: OrganizationsShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <OrganizationsTopbar />

      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
