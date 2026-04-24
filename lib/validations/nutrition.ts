import { FitnessGoal } from "@prisma/client";
import { z } from "zod";

export const mealPlanSchema = z.object({
  dietaryPreference: z.string().min(2),
  allergies: z.string().min(2),
  calorieTarget: z.coerce.number().min(1200).max(5000),
  days: z.coerce.number().min(1).max(14),
  goal: z.nativeEnum(FitnessGoal),
});
