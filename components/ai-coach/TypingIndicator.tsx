export function TypingIndicator() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-400">
      <span className="size-2 animate-bounce rounded-full bg-emerald-300 [animation-delay:-0.2s]" />
      <span className="size-2 animate-bounce rounded-full bg-emerald-300 [animation-delay:-0.1s]" />
      <span className="size-2 animate-bounce rounded-full bg-emerald-300" />
      FitGenie is thinking
    </div>
  );
}
