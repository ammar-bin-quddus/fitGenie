import { Card, CardContent } from "@/components/ui/card";

export function WelcomeCard({
  name,
  goal,
  quote,
}: {
  name?: string;
  goal: string;
  quote: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="grid gap-6 bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(99,102,241,0.1))] p-6 lg:grid-cols-[1fr_0.6fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">
            Today&apos;s focus
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
            {name ? `Welcome back, ${name}` : "Welcome back"}.
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Your current focus is <span className="font-semibold text-white">{goal}</span>.
            Stay consistent with the plan and let your progress stack up.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-5">
          <p className="text-sm text-slate-400">Motivational quote</p>
          <p className="mt-3 text-xl font-semibold tracking-tight text-white">
            {quote}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
