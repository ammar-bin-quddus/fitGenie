import { FitnessGoal, FitnessLevel, WorkoutType } from "@prisma/client";
import { z } from "zod";

export const workoutSchema = z.object({
  goal: z.nativeEnum(FitnessGoal),
  level: z.nativeEnum(FitnessLevel),
  daysPerWeek: z.coerce.number().min(1).max(7),
  sessionDuration: z.coerce.number().min(15).max(180),
  workoutType: z.nativeEnum(WorkoutType),
  equipment: z.string().min(2),
  durationWeeks: z.coerce.number().min(1).max(12),
});
