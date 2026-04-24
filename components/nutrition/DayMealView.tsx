import { MealCard } from "@/components/nutrition/MealCard";

export function DayMealView({
  meals,
}: {
  meals: Array<{
    id: string;
    mealType: string;
    name: string;
    calories?: number | null;
    protein?: number | null;
    carbs?: number | null;
    fat?: number | null;
  }>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {meals.map((meal) => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </div>
  );
}
