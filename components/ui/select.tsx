import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: Option[];
};

export function Select({ className, options, ...props }: SelectProps) {
  return (
    <div className="relative mt-2">
      <select
        className={cn(
          "flex h-11 w-full appearance-none rounded-sm border border-white/10 bg-slate-950/60 px-4 pr-12 text-sm text-slate-100 outline-none transition focus:border-emerald-400/40 focus:ring-2 focus:ring-primary/40",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
        <div className="flex size-7 items-center justify-center rounded-lg bg-white/5 text-slate-400">
          <ChevronDown className="size-4" />
        </div>
      </div>
    </div>
  );
}
