"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function ProgressSummaryCard({
  progressLogs,
}: {
  progressLogs: Array<{ date: Date; weight: number | null }>;
}) {
  const data = progressLogs.map((log) => ({
    date: formatDate(log.date),
    weight: log.weight ?? 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent progress</CardTitle>
        <CardDescription>Weight trend over your logged check-ins.</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" stroke="#94A3B8" tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
