// src/components/layout/sidebar/SidebarNavigationItem.tsx
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProjectService } from "@/src/domains/project";
import { ROUTES } from "@/src/constants/routes";
import { clearLastProjectId, getLastProjectId } from "@/src/constants/storage";
import type { SidebarItem } from "./sidebar.config";

type SidebarNavigationItemProps = {
  item: SidebarItem;
  organizationSlug: string;
  pathname: string;
  collapsed: boolean;
};

export function SidebarNavigationItem({
  item,
  organizationSlug,
  pathname,
  collapsed,
}: SidebarNavigationItemProps) {
  const router = useRouter();
  const active = item.isActive(pathname, organizationSlug);
  const href = item.href(organizationSlug);
  const Icon = item.icon;

  const handleClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.label === "Projects") {
      const projectId = getLastProjectId(organizationSlug);

      if (projectId) {
        event.preventDefault();

        try {
          await ProjectService.getById(organizationSlug, projectId);
          router.push(ROUTES.ORGANIZATION.PROJECT(organizationSlug, projectId));
        } catch {
          clearLastProjectId(organizationSlug);
          router.push(href);
        }
      }
    }
  };

  if (item.disabled) {
    return (
      <span
        className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-muted-foreground/50 rounded-md cursor-not-allowed ${collapsed ? "justify-center" : ""}`}
        title="Coming soon"
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      title={collapsed ? item.label : undefined}
      className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
        active
          ? "bg-primary text-white"
          : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
      } ${collapsed && "justify-center"}`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}
