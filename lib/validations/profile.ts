import { ActivityLevel, FitnessGoal } from "@prisma/client";
import { z } from "zod";

export const profileSchema = z.object({
  age: z.coerce.number().min(13).max(100).optional(),
  gender: z.string().max(50).optional().or(z.literal("")),
  height: z.coerce.number().min(80).max(250).optional(),
  weight: z.coerce.number().min(25).max(300).optional(),
  fitnessGoal: z.nativeEnum(FitnessGoal).optional(),
  activityLevel: z.nativeEnum(ActivityLevel).optional(),
  dietaryPreference: z.string().max(120).optional().or(z.literal("")),
  medicalNotes: z.string().max(500).optional().or(z.literal("")),
  progressPhotoUrl: z.string().url().optional().or(z.literal("")),
});
