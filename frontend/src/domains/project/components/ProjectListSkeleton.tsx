// src/domains/project/components/ProjectListSkeleton.tsx
import Skeleton from "@/src/components/ui/Skeleton";

export function ProjectListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-12" />
      ))}
    </div>
  );
}
