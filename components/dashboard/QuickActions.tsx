import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const actions = [
  { label: "Generate Workout", href: "/workout" },
  { label: "Log Progress", href: "/progress" },
  { label: "Ask AI Coach", href: "/ai-coach" },
  { label: "Complete Profile", href: "/dashboard/profile" },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>Jump straight into your next useful step.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm font-medium text-white transition hover:bg-white/10"
          >
            <span>{action.label}</span>
            <ArrowRight className="size-4 text-slate-400" />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
