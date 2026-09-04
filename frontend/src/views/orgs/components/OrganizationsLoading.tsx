// src/views/orgs/components/OrganizationsLoading.tsx
import Loader from "@/src/components/ui/Loader";

export default function OrganizationsLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader label="Loading organizations" />
    </div>
  );
}
