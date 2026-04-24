import { Flame } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function StreakTracker({
  progressLogs,
}: {
  progressLogs: Array<{ date: Date }>;
}) {
  const streak = progressLogs.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consistency streak</CardTitle>
        <CardDescription>Consecutive logging keeps momentum visible.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="rounded-2xl bg-amber-500/15 p-3 text-amber-300">
            <Flame className="size-6" />
          </div>
          <div>
            <p className="text-3xl font-bold tracking-tight text-white">{streak}</p>
            <p className="text-sm text-slate-400">days logged</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
