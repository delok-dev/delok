// app/docs/layout.tsx
import type { Metadata } from "next";
import { ReactNode } from "react";

import DocsLayout from "@/src/views/docs/DocsLayout";

export const metadata: Metadata = {
  title: {
    template: "%s | Delok Docs",
    default: "Documentation | Delok",
  },
  description:
    "Documentation for Delok — learn how to collect, search, and view application logs with the Delok SDK.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <DocsLayout>{children}</DocsLayout>;
}
