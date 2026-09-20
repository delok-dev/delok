// src/views/docs/DocsLayout.tsx
import { ReactNode } from "react";

import { DocsLayout as DocsLayoutComponent } from "@/src/components/docs/DocsLayout";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return <DocsLayoutComponent>{children}</DocsLayoutComponent>;
}
