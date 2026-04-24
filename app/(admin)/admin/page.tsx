import { Activity, ClipboardList, Users } from "lucide-react";

import { getAdminOverview } from "@/actions/admin.actions";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const overview = await getAdminOverview();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Monitor platform activity and manage core resources."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard label="Posts today" value={overview.postCount} icon={Activity} />
        <StatsCard label="Active meal plans" value={overview.mealCount} icon={ClipboardList} />
        <StatsCard label="Workout plans" value={overview.workoutCount} icon={Users} />
      </div>
    </div>
  );
}
