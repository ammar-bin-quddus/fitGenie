"use client";

import { FitnessGoal } from "@prisma/client";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { createAIMealPlan } from "@/actions/nutrition.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { mealPlanSchema } from "@/lib/validations/nutrition";
import type { z } from "zod";

type MealValues = z.input<typeof mealPlanSchema>;

export function MealPlanForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<MealValues>({
    resolver: zodResolver(mealPlanSchema),
    defaultValues: {
      dietaryPreference: "High-protein balanced",
      allergies: "None",
      calorieTarget: 2200,
      days: 7,
      goal: FitnessGoal.GENERAL_FITNESS,
    },
  });

  const onSubmit = (values: MealValues) => {
    startTransition(async () => {
      const result = await createAIMealPlan(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Meal plan generated");
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create meal plan</CardTitle>
        <CardDescription>
          Generate a meal plan with grocery items grouped for shopping.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Dietary preference</Label>
            <Input {...form.register("dietaryPreference")} />
          </div>
          <div className="space-y-2">
            <Label>Allergies / Restrictions</Label>
            <Input {...form.register("allergies")} />
          </div>
          <div className="space-y-2">
            <Label>Calorie target</Label>
            <Input type="number" {...form.register("calorieTarget")} />
          </div>
          <div className="space-y-2">
            <Label>Days</Label>
            <Input type="number" {...form.register("days")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Goal</Label>
            <Select
              options={Object.values(FitnessGoal).map((value) => ({
                value,
                label: value.replaceAll("_", " "),
              }))}
              {...form.register("goal")}
            />
          </div>
          <Button type="submit" disabled={isPending} className="md:col-span-2">
            {isPending ? "Generating..." : "Generate Meal Plan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
