import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type StatsCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
};

export function StatsCard({ label, value, icon: Icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-6">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white">
            {value}
          </p>
          {trend ? <p className="mt-2 text-sm text-emerald-300">{trend}</p> : null}
        </div>
        <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-300">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
