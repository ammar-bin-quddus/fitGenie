const prompts = [
  "Create a 7-day meal plan",
  "Best exercises for lower back pain",
  "Build a beginner gym split",
  "How should I improve recovery days?",
];

export function SuggestedPrompts({
  onSelect,
}: {
  onSelect: (prompt: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
