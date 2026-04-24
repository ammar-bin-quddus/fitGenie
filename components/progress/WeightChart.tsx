"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatDate } from "@/lib/utils";

export function WeightChart({
  logs,
}: {
  logs: Array<{ date: Date; weight: number | null }>;
}) {
  const data = logs.map((log) => ({
    date: formatDate(log.date),
    weight: log.weight ?? 0,
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#94A3B8" tickLine={false} axisLine={false} />
          <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} />
          <Tooltip />
          <Line type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
