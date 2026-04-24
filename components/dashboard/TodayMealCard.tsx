import { Utensils } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type MealCardProps = {
  mealPlan?: {
    title: string;
    calories?: number | null;
    meals: Array<{ name: string; mealType: string }>;
  };
};

export function TodayMealCard({ mealPlan }: MealCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s meals</CardTitle>
        <CardDescription>Your latest AI meal plan snapshot.</CardDescription>
      </CardHeader>
      <CardContent>
        {mealPlan ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-500/15 p-3 text-indigo-300">
                <Utensils className="size-5" />
              </div>
              <div>
                <p className="font-semibold text-white">{mealPlan.title}</p>
                <p className="text-sm text-slate-400">
                  {mealPlan.calories ?? 2000} calories target
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {mealPlan.meals.slice(0, 3).map((meal) => (
                <div
                  key={`${meal.mealType}-${meal.name}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm"
                >
                  <span className="text-slate-500">{meal.mealType}</span>
                  <p className="font-medium text-slate-100">{meal.name}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            No meal plan yet. Generate a nutrition plan to fill this in.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
