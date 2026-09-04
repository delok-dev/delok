// src/components/layout/sidebar/SidebarFooter.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/src/constants/routes";

type SidebarFooterProps = {
  collapsed: boolean;
};

export function SidebarFooter({ collapsed }: SidebarFooterProps) {
  return (
    <div className="px-2 py-3 border-t border-border">
      <Link
        href={ROUTES.ORGANIZATION.ROOT}
        title={collapsed ? "All organizations" : undefined}
        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-muted-foreground rounded-md hover:bg-surface-hover hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        {!collapsed && <span className="truncate">All organizations</span>}
      </Link>
    </div>
  );
}
