import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function MealCard({
  meal,
}: {
  meal: {
    mealType: string;
    name: string;
    calories?: number | null;
    protein?: number | null;
    carbs?: number | null;
    fat?: number | null;
  };
}) {
  return (
    <Card className="bg-white/[0.03]">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-white">{meal.name}</p>
            <p className="text-sm text-slate-400">{meal.mealType}</p>
          </div>
          <Badge>{meal.calories ?? 0} kcal</Badge>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm text-slate-300">
          <p>P {meal.protein ?? 0}g</p>
          <p>C {meal.carbs ?? 0}g</p>
          <p>F {meal.fat ?? 0}g</p>
        </div>
      </CardContent>
    </Card>
  );
}
