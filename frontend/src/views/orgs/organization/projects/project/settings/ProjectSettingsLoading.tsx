// src/views/orgs/organization/projects/project/settings/ProjectSettingsLoading.tsx
import Loader from "@/src/components/ui/Loader";

export default function ProjectSettingsLoading() {
  return (
    <div className="flex min-h-40 w-full max-w-4xl items-center justify-center p-6">
      <Loader label="Loading settings" />
    </div>
  );
}
