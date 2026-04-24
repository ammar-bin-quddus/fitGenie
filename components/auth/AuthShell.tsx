import Link from "next/link";

type AuthShellProps = {
  title: string;
  description: string;
  alternateLabel: string;
  alternateHref: string;
  alternateText: string;
  children: React.ReactNode;
};

export function AuthShell({
  title,
  description,
  alternateLabel,
  alternateHref,
  alternateText,
  children,
}: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
      <div className="hidden bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.2),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.18),transparent_25%)] p-10 lg:flex lg:flex-col lg:justify-center lg:gap-y-10">
        <div>
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-white"
          >
            FitGenie
          </Link>
          <p className="mt-4 max-w-md text-slate-300">
            Build sustainable routines with AI-generated plans, coaching, and
            progress insights that keep you moving.
          </p>
        </div>
        <div className="glass-panel rounded-4xl p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
            Daily focus
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Fitness plans that adapt to you.
          </h2>
          <p className="mt-4 max-w-md text-slate-400">
            Track workouts, generate meals, and talk through the next step with
            an AI coach that stays aligned with your goals.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-16 sm:px-10">
        <div className="w-full max-w-md rounded-4xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/25">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-2 text-slate-400">{description}</p>
          </div>
          {children}
          <p className="mt-8 text-center text-sm text-slate-400">
            {alternateText}{" "}
            <Link href={alternateHref} className="font-medium text-emerald-300">
              {alternateLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
