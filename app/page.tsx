import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Brain, Dumbbell, Sparkles } from "lucide-react";

const highlights = [
  {
    title: "AI workout generation",
    description:
      "Create weekly plans matched to your goal, equipment, schedule, and fitness level.",
    icon: Dumbbell,
  },
  {
    title: "Nutrition planning",
    description:
      "Build meal plans with macro breakdowns, recipe ideas, and grocery lists.",
    icon: Sparkles,
  },
  {
    title: "AI coach chat",
    description:
      "Get practical coaching support, safer guidance, and personalized prompts.",
    icon: Brain,
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.2),transparent_30%),radial-gradient(circle_at_right,rgba(99,102,241,0.18),transparent_24%)]" />
      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20 sm:px-10">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur">
          <span className="size-2 rounded-full bg-emerald-400" />
          AI fitness and nutrition for consistent progress
        </div>
        <div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(440px,520px)] lg:items-center">
          <div className="relative z-10">
            <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-6xl">
              Train smarter, eat better, and stay accountable with FitGenie.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              FitGenie brings together AI workout plans, nutrition guidance,
              progress analytics, community support, and an always-on coach.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-500 px-6 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Start your plan
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
              >
                Sign in
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[520px] pt-4 lg:pt-0">
            <div className="absolute left-10 right-10 top-14 h-48 rounded-full bg-emerald-500/14 blur-3xl lg:left-16 lg:right-16 lg:top-20 lg:h-56" />
            <div className="absolute bottom-10 left-16 right-16 h-40 rounded-full bg-indigo-500/16 blur-3xl lg:bottom-14 lg:h-48" />
            <div className="relative mx-auto w-full max-w-[380px] overflow-hidden rounded-[2.75rem] border border-white/10 bg-slate-900/55 p-3 shadow-[0_35px_120px_rgba(15,23,42,0.72)] backdrop-blur">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.15rem] border border-white/10">
                <Image
                  src="/hero-img.png"
                  alt="FitGenie training companion"
                  fill
                  priority
                  unoptimized
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/18 via-transparent to-transparent" />
              </div>
            </div>
            <div className="mt-8 grid justify-items-center gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-0 lg:block">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                const positions = [
                  "lg:absolute lg:-left-10 lg:top-14",
                  "lg:absolute lg:-right-10 lg:top-0",
                  "lg:absolute lg:-right-10 lg:bottom-0",
                ];

                return (
                  <div
                    key={item.title}
                    className={`w-full max-w-55 rounded-3xl border border-white/10 bg-slate-900/88 p-4 shadow-2xl shadow-black/20 backdrop-blur ${positions[index]}`}
                  >
                    <div className="mb-3 inline-flex rounded-2xl bg-emerald-500/15 p-3 text-emerald-300">
                      <Icon className="size-5" />
                    </div>
                    <h2 className="text-base font-bold tracking-tight text-slate-100">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm leading-5 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
