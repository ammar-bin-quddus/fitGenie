"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { generateMealPlan } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { mealPlanSchema } from "@/lib/validations/nutrition";
import type { ActionState } from "@/types";

export async function createAIMealPlan(
  values: Parameters<typeof mealPlanSchema.parse>[0],
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" } satisfies ActionState;
    }

    const validated = mealPlanSchema.parse(values);
    const aiPlan = await generateMealPlan(validated);

    const mealPlan = await prisma.mealPlan.create({
      data: {
        userId: session.user.id,
        title: aiPlan.title,
        calories: aiPlan.dailyCalories,
        isAIGenerated: true,
        meals: {
          create: aiPlan.days.flatMap((day) =>
            day.meals.map((meal) => ({
              dayNumber: day.dayNumber,
              ...meal,
            })),
          ),
        },
        groceryList: {
          create: aiPlan.groceryList,
        },
      },
      include: {
        meals: true,
        groceryList: true,
      },
    });

    revalidatePath("/nutrition");
    revalidatePath("/dashboard");

    return { success: true, data: mealPlan } satisfies ActionState<typeof mealPlan>;
  } catch (error) {
    console.error("[CREATE_MEAL_PLAN_ERROR]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate meal plan.",
    };
  }
}

export async function getMealPlans() {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await prisma.mealPlan.findMany({
      where: { userId: session.user.id },
      include: { meals: true, groceryList: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("[GET_MEAL_PLANS_ERROR]", error);
    return [];
  }
}

export async function deleteMealPlan(id: string): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    await prisma.mealPlan.delete({
      where: { id, userId: session.user.id },
    });

    revalidatePath("/nutrition");
    return { success: true };
  } catch (error) {
    console.error("[DELETE_MEAL_PLAN_ERROR]", error);
    return { success: false, error: "Failed to delete meal plan." };
  }
}
