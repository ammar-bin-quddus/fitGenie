"use client";

import { FitnessGoal, FitnessLevel, WorkoutType } from "@prisma/client";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { createAIWorkoutPlan } from "@/actions/workout.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { workoutSchema } from "@/lib/validations/workout";
import type { z } from "zod";

type WorkoutValues = z.input<typeof workoutSchema>;

export function WorkoutGeneratorForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<WorkoutValues>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      goal: FitnessGoal.GENERAL_FITNESS,
      level: FitnessLevel.BEGINNER,
      daysPerWeek: 4,
      sessionDuration: 45,
      workoutType: WorkoutType.HOME,
      equipment: "Bodyweight, resistance bands, dumbbells",
      durationWeeks: 4,
    },
  });

  const onSubmit = (values: WorkoutValues) => {
    startTransition(async () => {
      const result = await createAIWorkoutPlan(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Workout plan generated");
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate a workout plan</CardTitle>
        <CardDescription>
          Tell FitGenie your goal, schedule, and training setup.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Goal</Label>
            <Select
              options={Object.values(FitnessGoal).map((value) => ({
                value,
                label: value.replaceAll("_", " "),
              }))}
              {...form.register("goal")}
            />
          </div>
          <div className="space-y-2">
            <Label>Fitness Level</Label>
            <Select
              options={Object.values(FitnessLevel).map((value) => ({
                value,
                label: value.replaceAll("_", " "),
              }))}
              {...form.register("level")}
            />
          </div>
          <div className="space-y-2">
            <Label>Days per week</Label>
            <Input type="number" {...form.register("daysPerWeek")} />
          </div>
          <div className="space-y-2">
            <Label>Session duration</Label>
            <Input type="number" {...form.register("sessionDuration")} />
          </div>
          <div className="space-y-2">
            <Label>Workout type</Label>
            <Select
              options={Object.values(WorkoutType).map((value) => ({
                value,
                label: value.replaceAll("_", " "),
              }))}
              {...form.register("workoutType")}
            />
          </div>
          <div className="space-y-2">
            <Label>Duration (weeks)</Label>
            <Input type="number" {...form.register("durationWeeks")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Equipment</Label>
            <Input {...form.register("equipment")} />
          </div>
          <Button type="submit" disabled={isPending} className="md:col-span-2">
            {isPending ? "Generating..." : "Generate Workout"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
