// app/(root)/orgs/layout.tsx
import { ReactNode } from "react";

import OrganizationsLayout from "@/src/views/orgs/OrganizationsLayout";
import { SocketProvider } from "@/src/providers/SocketProvider";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SocketProvider>
      <OrganizationsLayout>{children}</OrganizationsLayout>
    </SocketProvider>
  );
}
