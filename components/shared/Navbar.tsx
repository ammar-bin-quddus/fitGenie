import { Bell, LogOut } from "lucide-react";

import { signOut, auth } from "@/lib/auth";
import { Avatar } from "@/components/ui/avatar";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="glass-panel sticky top-0 z-30 flex items-center justify-between rounded-3xl px-5 py-4">
      <div>
        <p className="text-sm text-slate-400">Welcome back</p>
        <h2 className="text-lg font-bold tracking-tight text-white">
          {session?.user?.name ?? "Athlete"}
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
        >
          <Bell className="size-4" />
        </button>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <Avatar
            src={session?.user?.image}
            fallback={session?.user?.name ?? session?.user?.email ?? "FG"}
          />
          <div className="hidden text-sm sm:block">
            <p className="font-medium text-white">
              {session?.user?.name ?? "FitGenie User"}
            </p>
            <p className="text-slate-400">{session?.user?.email}</p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="inline-flex size-10 items-center justify-center rounded-xl text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
