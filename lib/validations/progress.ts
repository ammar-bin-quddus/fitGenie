import { z } from "zod";

export const progressSchema = z.object({
  date: z.string().min(1),
  weight: z.coerce.number().min(25).max(300).optional(),
  chest: z.coerce.number().min(20).max(250).optional(),
  waist: z.coerce.number().min(20).max(250).optional(),
  hips: z.coerce.number().min(20).max(250).optional(),
  arms: z.coerce.number().min(10).max(100).optional(),
  notes: z.string().max(500).optional().or(z.literal("")),
  photoUrl: z
    .string()
    .refine(
      (value) =>
        !value ||
        value.startsWith("data:image/") ||
        value.startsWith("http://") ||
        value.startsWith("https://"),
      "Photo must be a valid image URL or uploaded image.",
    )
    .optional()
    .or(z.literal("")),
});
