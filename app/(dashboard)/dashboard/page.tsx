import { getMealPlans } from "@/actions/nutrition.actions";
import { getProfile } from "@/actions/profile.actions";
import { getProgressLogs } from "@/actions/progress.actions";
import { getWorkoutPlans } from "@/actions/workout.actions";
import { ProgressSummaryCard } from "@/components/dashboard/ProgressSummaryCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { StreakTracker } from "@/components/dashboard/StreakTracker";
import { TodayMealCard } from "@/components/dashboard/TodayMealCard";
import { TodayWorkoutCard } from "@/components/dashboard/TodayWorkoutCard";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { auth } from "@/lib/auth";
import { getDailyQuote } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [session, profile, workouts, meals, progressLogs] = await Promise.all([
    auth(),
    getProfile(),
    getWorkoutPlans(),
    getMealPlans(),
    getProgressLogs(),
  ]);

  const latestWorkout = workouts[0];
  const latestMealPlan = meals[0];
  const quote = getDailyQuote(new Date().getDate());

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Your training, nutrition, and progress snapshot for today."
      />
      <WelcomeCard
        name={session?.user?.name ?? undefined}
        goal={profile?.fitnessGoal?.replaceAll("_", " ") ?? "GENERAL FITNESS"}
        quote={quote}
      />
      <div className="grid gap-4 xl:grid-cols-3">
        <TodayWorkoutCard workoutPlan={latestWorkout} />
        <TodayMealCard mealPlan={latestMealPlan} />
        <StreakTracker progressLogs={progressLogs} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <ProgressSummaryCard progressLogs={progressLogs} />
        <QuickActions />
      </div>
    </div>
  );
}
