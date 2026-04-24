import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GroceryList({
  items,
}: {
  items: Array<{ id: string; name: string; quantity: string; category: string }>;
}) {
  const groups = items.reduce<Record<string, typeof items>>((acc, item) => {
    acc[item.category] = [...(acc[item.category] ?? []), item];
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grocery list</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(groups).map(([category, categoryItems]) => (
          <div key={category}>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              {category}
            </p>
            <div className="space-y-2">
              {categoryItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200"
                >
                  {item.name} <span className="text-slate-500">· {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
