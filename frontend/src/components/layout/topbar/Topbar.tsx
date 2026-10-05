// src/components/layout/topbar/Topbar.tsx
"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { ROUTES } from "@/src/constants/routes";
import { authClient } from "@/src/lib/auth/auth-client";
import { MobileNavigation } from "@/src/components/layout/mobile-navigation";
import { OrganizationSwitcher } from "./OrganizationSwitcher";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "@/src/components/ThemeToggle";

type TopbarProps = {
  organizationSlug: string;
  organizationName: string;
};

export function Topbar({ organizationSlug, organizationName }: TopbarProps) {
  const { data: session } = authClient.useSession();

  return (
    <header className="h-14 z-999 flex shrink-0 items-center justify-between gap-2 pr-3 pl-3 sm:pr-9 text-primary-foreground">
      <div className="flex min-w-0 items-center gap-1">
        {/* Mobile navigation drawer trigger. The desktop sidebar is hidden below md. */}
        <MobileNavigation organizationSlug={organizationSlug} />

        <OrganizationSwitcher
          organizationSlug={organizationSlug}
          organizationName={organizationName}
        />
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {/* Below sm these live in the mobile drawer to keep the row uncrowded. */}
        <Link
          href={ROUTES.DOCS.ROOT}
          className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground sm:inline-flex"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Docs
        </Link>
        <span className="hidden sm:inline-flex">
          <ThemeToggle />
        </span>
        <UserMenu
          userName={session?.user?.name}
          userEmail={session?.user?.email}
        />
      </div>
    </header>
  );
}
