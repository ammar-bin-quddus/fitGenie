"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { progressSchema } from "@/lib/validations/progress";
import { calculateBMI } from "@/lib/utils";
import type { ActionState } from "@/types";

export async function logProgress(
  values: Parameters<typeof progressSchema.parse>[0],
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" } satisfies ActionState;
    }

    const validated = progressSchema.parse(values);

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    const log = await prisma.progressLog.create({
      data: {
        userId: session.user.id,
        date: new Date(validated.date),
        weight: validated.weight,
        bmi: calculateBMI(validated.weight, profile?.height),
        chest: validated.chest,
        waist: validated.waist,
        hips: validated.hips,
        arms: validated.arms,
        notes: validated.notes,
        photoUrl: validated.photoUrl,
      },
    });

    revalidatePath("/progress");
    revalidatePath("/dashboard");

    return { success: true, data: log } satisfies ActionState<typeof log>;
  } catch (error) {
    console.error("[LOG_PROGRESS_ERROR]", error);
    return { success: false, error: "Failed to save progress log." };
  }
}

export async function getProgressLogs() {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await prisma.progressLog.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "asc" },
    });
  } catch (error) {
    console.error("[GET_PROGRESS_LOGS_ERROR]", error);
    return [];
  }
}

export async function deleteProgressLog(id: string): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    await prisma.progressLog.delete({
      where: { id, userId: session.user.id },
    });

    revalidatePath("/progress");
    return { success: true };
  } catch (error) {
    console.error("[DELETE_PROGRESS_LOG_ERROR]", error);
    return { success: false, error: "Failed to delete progress log." };
  }
}
