// app/docs/layout.tsx
import type { Metadata } from "next";
import { DocsLayout } from "@/src/components/docs/DocsLayout";

export const metadata: Metadata = {
  title: {
    template: "%s | Delok Docs",
    default: "Documentation | Delok",
  },
  description: "Documentation for Delok — a log monitoring platform for monitoring application logs.",
};

export default function DocsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsLayout>{children}</DocsLayout>;
}
