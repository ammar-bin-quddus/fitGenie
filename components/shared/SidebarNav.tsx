"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BarChart3,
  Brain,
  Dumbbell,
  Home,
  Menu,
  Settings,
  User,
  Users,
  Utensils,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/profile", label: "View Profile", icon: User },
  { href: "/workout", label: "Workout", icon: Dumbbell },
  { href: "/nutrition", label: "Nutrition", icon: Utensils },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/community", label: "Community", icon: Users },
  { href: "/ai-coach", label: "AI Coach", icon: Brain },
];

function isActiveRoute(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="glass-panel fixed left-4 top-4 z-40 inline-flex size-11 items-center justify-center rounded-2xl text-white lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="size-5" />
      </button>

      {isMobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close sidebar backdrop"
        />
      ) : null}

      <aside
        className={cn(
          "glass-panel fixed inset-y-4 left-4 z-50 flex w-[18rem] flex-col rounded-3xl p-4 transition-transform duration-200 lg:sticky lg:top-6 lg:z-auto lg:h-[calc(100vh-3rem)] lg:w-[18rem] lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-[120%]",
          "lg:flex",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <Link
            href="/dashboard"
            className="rounded-2xl px-3 py-4"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="text-2xl font-bold tracking-tight text-white">FitGenie</div>
            <p className="mt-1 text-sm text-slate-400">
              Personalized fitness and nutrition
            </p>
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="inline-flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </button>
        </div>
        <nav className="mt-6 flex flex-1 flex-col gap-2">
          {links.map((item) => {
            const Icon = item.icon;
            const active = isActiveRoute(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  active
                    ? "bg-emerald-500/15 text-white ring-1 ring-emerald-400/30"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className={cn("size-4", active && "text-emerald-300")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        {isAdmin ? (
          <Link
            href="/admin"
            onClick={() => setIsMobileOpen(false)}
            className="mt-2 flex items-center gap-3 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-3 text-sm font-medium text-indigo-100 transition hover:bg-indigo-500/20"
          >
            <Settings className="size-4" />
            Admin dashboard
          </Link>
        ) : null}
      </aside>
    </>
  );
}
