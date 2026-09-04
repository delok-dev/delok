// app/not-found.tsx
import Link from "next/link";
import Image from "next/image";

import { ASSETS } from "@/src/constants/assets";
import { ROUTES } from "@/src/constants/routes";
import { Button } from "@/src/components/ui";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <div className="w-full max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">
          404
        </p>
        <Link href={ROUTES.HOME} className="mb-4 block">
          <Image
            src={ASSETS.LOGO.LIGHT}
            alt="Delok"
            width={48}
            height={48}
            className="mx-auto rounded-md"
          />
        </Link>
        <h1 className="mt-3 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for does not exist or may have moved.
        </p>
        <Link href={ROUTES.HOME} className="block mt-4">
          <Button>Return to Delok</Button>
        </Link>
      </div>
    </main>
  );
}
