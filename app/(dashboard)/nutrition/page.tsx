import { getMealPlans } from "@/actions/nutrition.actions";
import { DayMealView } from "@/components/nutrition/DayMealView";
import { GroceryList } from "@/components/nutrition/GroceryList";
import { MacrosPieChart } from "@/components/nutrition/MacrosPieChart";
import { MealPlanForm } from "@/components/nutrition/MealPlanForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function NutritionPage() {
  const mealPlans = await getMealPlans();
  const latestPlan = mealPlans[0];
  const firstDayMeals = latestPlan?.meals.filter((meal) => meal.dayNumber === 1) ?? [];
  const macros = firstDayMeals.reduce(
    (acc, meal) => ({
      protein: acc.protein + (meal.protein ?? 0),
      carbs: acc.carbs + (meal.carbs ?? 0),
      fat: acc.fat + (meal.fat ?? 0),
    }),
    { protein: 0, carbs: 0, fat: 0 },
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nutrition Planner"
        description="Generate meal plans, review macros, and prep your grocery list."
      />
      <MealPlanForm />
      {latestPlan ? (
        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <CardHeader>
              <CardTitle>{latestPlan.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DayMealView meals={firstDayMeals} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Macros overview</CardTitle>
            </CardHeader>
            <CardContent>
              <MacrosPieChart {...macros} />
            </CardContent>
          </Card>
          <div className="xl:col-span-2">
            <GroceryList items={latestPlan.groceryList} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
