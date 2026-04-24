import { Inbox } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">
      <div className="mb-4 rounded-2xl bg-white/5 p-4 text-slate-300">
        <Inbox className="size-8" />
      </div>
      <h3 className="text-lg font-bold tracking-tight text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}
