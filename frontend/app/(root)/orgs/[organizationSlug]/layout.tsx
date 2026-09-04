// app/(root)/orgs/[organizationSlug]/layout.tsx
import { ReactNode } from "react";

import OrganizationLayout from "@/src/views/orgs/organization/OrganizationLayout";

export default function Layout({ children }: { children: ReactNode }) {
  return <OrganizationLayout>{children}</OrganizationLayout>;
}
