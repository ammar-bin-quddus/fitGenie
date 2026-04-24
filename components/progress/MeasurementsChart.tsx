"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";

export function MeasurementsChart({
  log,
}: {
  log?: {
    chest?: number | null;
    waist?: number | null;
    hips?: number | null;
    arms?: number | null;
  };
}) {
  const data = [
    { metric: "Chest", value: log?.chest ?? 0 },
    { metric: "Waist", value: log?.waist ?? 0 },
    { metric: "Hips", value: log?.hips ?? 0 },
    { metric: "Arms", value: log?.arms ?? 0 },
  ];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "#CBD5E1" }} />
          <Radar dataKey="value" stroke="#6366F1" fill="#6366F1" fillOpacity={0.5} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
