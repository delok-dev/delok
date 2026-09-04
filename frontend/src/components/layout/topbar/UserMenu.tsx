// src/components/layout/topbar/UserMenu.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/src/lib/auth/auth-client";
import { ROUTES } from "@/src/constants/routes";
import { UserAvatar } from "./UserAvatar";

type UserMenuProps = {
  userName?: string | null;
  userEmail?: string | null;
};

export function UserMenu({ userName, userEmail }: UserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(ROUTES.HOME);
        },
        onError: () => {
          setLoggingOut(false);
        },
      },
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 hover:bg-surface-hover px-2 py-1.5 rounded-md transition-colors cursor-pointer"
      >
        <UserAvatar name={userName} />
        <span className="hidden sm:block text-xs font-medium text-foreground max-w-30 truncate">
          {userName ?? "User"}
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-border bg-surface shadow-lg py-1.5">
            <div className="px-3 py-2 border-b border-border mb-1">
              <p className="text-xs font-medium text-foreground truncate">
                {userName ?? "User"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {userEmail ?? ""}
              </p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center gap-2 text-left px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/10 rounded-md transition-colors cursor-pointer disabled:opacity-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              {loggingOut ? "Logging out..." : "Log out"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
