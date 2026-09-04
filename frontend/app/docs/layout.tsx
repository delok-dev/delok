// app/docs/layout.tsx
import type { Metadata } from "next";
import { DocsLayout } from "@/src/components/docs/DocsLayout";

export const metadata: Metadata = {
  title: {
    template: "%s | Delok Docs",
    default: "Documentation | Delok",
  },
};

export default function DocsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsLayout>{children}</DocsLayout>;
}
