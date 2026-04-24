import { cn } from "@/lib/utils";

export function ChatMessage({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl rounded-3xl px-5 py-4 text-sm leading-7",
        role === "user"
          ? "ml-auto bg-emerald-500 text-slate-950"
          : "bg-white/[0.05] text-slate-200",
      )}
    >
      <pre className="whitespace-pre-wrap font-sans">{content}</pre>
    </div>
  );
}
