// src/domains/organization/components/OrganizationListSkeleton.tsx
import Skeleton from "@/src/components/ui/Skeleton";

export function OrganizationListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-12" />
      ))}
    </div>
  );
}
