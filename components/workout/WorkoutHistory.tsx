import { formatDate } from "@/lib/utils";

export function WorkoutHistory({
  plans,
}: {
  plans: Array<{ id: string; title: string; createdAt: Date }>;
}) {
  return (
    <div className="space-y-3">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
        >
          <p className="font-medium text-white">{plan.title}</p>
          <p className="text-sm text-slate-400">{formatDate(plan.createdAt)}</p>
        </div>
      ))}
    </div>
  );
}
