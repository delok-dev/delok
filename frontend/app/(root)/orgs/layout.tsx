// app/(root)/orgs/layout.tsx
import OrganizationsLayout from "@/src/views/orgs/OrganizationsLayout";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <OrganizationsLayout>{children}</OrganizationsLayout>;
}
