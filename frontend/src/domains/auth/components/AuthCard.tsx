// src/domains/auth/components/AuthCard.tsx
import Image from "next/image";
import { ReactNode } from "react";
import Link from "next/link";

import { ASSETS } from "@/src/constants/assets";
import { ROUTES } from "@/src/constants/routes";

type Props = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export default function AuthCard({ title, subtitle, children }: Props) {
  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col items-center gap-3 mb-8 text-center">
        <Link href={ROUTES.HOME}>
          <Image
            src={ASSETS.LOGO.LIGHT}
            alt="Delok Logo"
            width={48}
            height={48}
            className="rounded-md"
          />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
