import { getAdminWorkoutLibrary } from "@/actions/admin.actions";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminWorkoutsPage() {
  const workouts = await getAdminWorkoutLibrary();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workout Library"
        description="Review generated plans and evolve reusable templates."
      />
      <Card>
        <CardContent className="divide-y divide-white/10 p-0">
          {workouts.map((plan) => (
            <div key={plan.id} className="px-6 py-4">
              <p className="font-medium text-white">{plan.title}</p>
              <p className="text-sm text-slate-400">
                {plan.goal.replaceAll("_", " ")} · {plan.user.name ?? plan.user.email}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
