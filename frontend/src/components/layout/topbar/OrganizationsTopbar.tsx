// src/components/layout/topbar/OrganizationsTopbar.tsx
"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { ROUTES } from "@/src/constants/routes";
import { ASSETS } from "@/src/constants/assets";
import { authClient } from "@/src/lib/auth/auth-client";
import { UserMenu } from "./UserMenu";
import Image from "next/image";

export function OrganizationsTopbar() {
  const { data: session } = authClient.useSession();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-6">
        <Image src={ASSETS.LOGO.LIGHT_TEXT} alt="Delok Logo" width={90} height={22} />

      <div className="flex items-center gap-1">
        <Link
          href={ROUTES.DOCS.ROOT}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Docs
        </Link>
        <UserMenu
          userName={session?.user?.name}
          userEmail={session?.user?.email}
        />
      </div>
    </header>
  );
}
