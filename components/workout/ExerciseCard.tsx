"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ExerciseCard({
  exercise,
}: {
  exercise: {
    name: string;
    sets: number;
    reps: string;
    restSeconds: number;
    muscleGroup: string;
    instructions?: string | null;
  };
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="overflow-hidden bg-white/[0.03]">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="w-full text-left transition hover:bg-white/[0.02]"
      >
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-white">{exercise.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">
                Click to {isOpen ? "collapse" : "expand"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge>{exercise.muscleGroup}</Badge>
              <ChevronDown
                className={cn(
                  "size-4 text-slate-400 transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm text-slate-300">
            <div>
              <p className="text-slate-500">Sets</p>
              <p>{exercise.sets}</p>
            </div>
            <div>
              <p className="text-slate-500">Reps</p>
              <p>{exercise.reps}</p>
            </div>
            <div>
              <p className="text-slate-500">Rest</p>
              <p>{exercise.restSeconds}s</p>
            </div>
          </div>
          {isOpen ? (
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm leading-6 text-slate-300">
              {exercise.instructions ?? "No extra instructions were provided for this exercise."}
            </div>
          ) : null}
        </CardContent>
      </button>
    </Card>
  );
}
