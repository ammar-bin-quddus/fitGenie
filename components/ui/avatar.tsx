import { User } from "lucide-react";

import { cn } from "@/lib/utils";

type AvatarProps = {
  src?: string | null;
  alt?: string | null;
  fallback?: string;
  className?: string;
};

export function Avatar({ src, alt, fallback, className }: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? "Avatar"}
        className={cn("size-10 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex size-10 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-semibold text-emerald-200",
        className,
      )}
    >
      {fallback?.slice(0, 2).toUpperCase() ?? <User className="size-4" />}
    </div>
  );
}
