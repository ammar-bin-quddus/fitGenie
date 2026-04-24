import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BMIGauge({ bmi }: { bmi?: number | null }) {
  const safeBmi = bmi ?? 0;
  const percentage = Math.min((safeBmi / 40) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>BMI</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-4 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-emerald-400 to-amber-400"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-4xl font-bold tracking-tight text-white">{safeBmi || "--"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
