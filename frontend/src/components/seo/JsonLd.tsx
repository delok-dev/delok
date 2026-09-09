// src/components/seo/JsonLd.tsx
import { PRODUCTION_URL } from "@/src/lib/site";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Delok",
    url: PRODUCTION_URL,
    logo: `${PRODUCTION_URL}/favicon.ico`,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Delok",
    url: PRODUCTION_URL,
    description: "Delok is a log monitoring platform that helps you collect, search, and view application logs in one place.",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
