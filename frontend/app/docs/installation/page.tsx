// app/docs/installation/page.tsx
import type { Metadata } from "next";

import InstallationPage from "@/src/views/docs/installation/InstallationPage";

export const metadata: Metadata = {
  title: "Installation",
  description:
    "Install the Delok SDK for Node.js and set up log ingestion in your application.",
  alternates: { canonical: "https://delok.site/docs/installation" },
};

export default function Page() {
  return <InstallationPage />;
}
