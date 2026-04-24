import { getWorkoutPlans } from "@/actions/workout.actions";
import { PageHeader } from "@/components/shared/PageHeader";
import { WorkoutGeneratorForm } from "@/components/workout/WorkoutGeneratorForm";
import { WorkoutHistory } from "@/components/workout/WorkoutHistory";
import { WorkoutPlanCard } from "@/components/workout/WorkoutPlanCard";
import { WeeklyCalendarView } from "@/components/workout/WeeklyCalendarView";

export const dynamic = "force-dynamic";

export default async function WorkoutPage() {
  const plans = await getWorkoutPlans();
  const latestPlan = plans[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workout Generator"
        description="Build personalized AI workout plans and revisit your history."
      />
      <WorkoutGeneratorForm />
      {latestPlan ? (
        <>
          <WeeklyCalendarView exercises={latestPlan.exercises} />
          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <WorkoutPlanCard plan={latestPlan} />
            <WorkoutHistory plans={plans} />
          </div>
        </>
      ) : null}
    </div>
  );
}
