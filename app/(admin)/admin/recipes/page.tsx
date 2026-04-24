import { getAdminRecipeLibrary } from "@/actions/admin.actions";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminRecipesPage() {
  const meals = await getAdminRecipeLibrary();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recipe Library"
        description="Browse generated meals that can become reusable recipe cards."
      />
      <Card>
        <CardContent className="divide-y divide-white/10 p-0">
          {meals.map((meal) => (
            <div key={meal.id} className="px-6 py-4">
              <p className="font-medium text-white">{meal.name}</p>
              <p className="text-sm text-slate-400">
                {meal.mealType} · {meal.calories ?? 0} calories
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
