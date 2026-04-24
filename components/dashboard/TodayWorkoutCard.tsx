import { Dumbbell } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type WorkoutCardProps = {
  workoutPlan?: {
    title: string;
    exercises: Array<{ name: string }>;
    sessionMinutes?: number;
  };
};

export function TodayWorkoutCard({ workoutPlan }: WorkoutCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s workout</CardTitle>
        <CardDescription>Your latest generated plan at a glance.</CardDescription>
      </CardHeader>
      <CardContent>
        {workoutPlan ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-300">
                <Dumbbell className="size-5" />
              </div>
              <div>
                <p className="font-semibold text-white">{workoutPlan.title}</p>
                <p className="text-sm text-slate-400">
                  {workoutPlan.sessionMinutes ?? 45} minute session
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {workoutPlan.exercises.slice(0, 3).map((exercise) => (
                <div
                  key={exercise.name}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300"
                >
                  {exercise.name}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            No workout plan yet. Generate one to get started.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
