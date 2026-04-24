"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { generateWorkoutPlan } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { workoutSchema } from "@/lib/validations/workout";
import type { ActionState } from "@/types";

export async function createAIWorkoutPlan(
  values: Parameters<typeof workoutSchema.parse>[0],
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" } satisfies ActionState;
    }

    const validated = workoutSchema.parse(values);
    const aiPlan = await generateWorkoutPlan(validated);

    const plan = await prisma.workoutPlan.create({
      data: {
        userId: session.user.id,
        title: aiPlan.title,
        description: aiPlan.description,
        goal: validated.goal,
        level: validated.level,
        durationWeeks: validated.durationWeeks,
        workoutType: validated.workoutType,
        isAIGenerated: true,
        daysPerWeek: validated.daysPerWeek,
        sessionMinutes: validated.sessionDuration,
        equipment: validated.equipment,
        exercises: {
          create: aiPlan.weeks.flatMap((week) =>
            week.days.flatMap((day) =>
              day.exercises.map((exercise) => ({
                name: exercise.name,
                sets: exercise.sets,
                reps: exercise.reps,
                restSeconds: exercise.restSeconds,
                muscleGroup: exercise.muscleGroup,
                instructions: exercise.instructions,
                day: day.dayNumber,
              })),
            ),
          ),
        },
      },
      include: { exercises: true },
    });

    revalidatePath("/workout");
    revalidatePath("/dashboard");

    return { success: true, data: plan } satisfies ActionState<typeof plan>;
  } catch (error) {
    console.error("[CREATE_WORKOUT_ERROR]", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate workout plan.",
    } satisfies ActionState;
  }
}

export async function getWorkoutPlans() {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await prisma.workoutPlan.findMany({
      where: { userId: session.user.id },
      include: { exercises: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("[GET_WORKOUT_PLANS_ERROR]", error);
    return [];
  }
}

export async function deleteWorkoutPlan(id: string): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    await prisma.workoutPlan.delete({
      where: { id, userId: session.user.id },
    });

    revalidatePath("/workout");
    return { success: true };
  } catch (error) {
    console.error("[DELETE_WORKOUT_PLAN_ERROR]", error);
    return { success: false, error: "Failed to delete workout plan." };
  }
}
