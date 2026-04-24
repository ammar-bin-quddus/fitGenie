"use server";

import { prisma } from "@/lib/prisma";

export async function getAdminOverview() {
  try {
    const [userCount, postCount, workoutCount, mealCount] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.workoutPlan.count(),
      prisma.mealPlan.count(),
    ]);

    return { userCount, postCount, workoutCount, mealCount };
  } catch (error) {
    console.error("[GET_ADMIN_OVERVIEW_ERROR]", error);
    return { userCount: 0, postCount: 0, workoutCount: 0, mealCount: 0 };
  }
}

export async function getAdminUsers() {
  try {
    return await prisma.user.findMany({
      include: { profile: true },
      orderBy: { createdAt: "desc" },
      take: 25,
    });
  } catch (error) {
    console.error("[GET_ADMIN_USERS_ERROR]", error);
    return [];
  }
}

export async function getAdminWorkoutLibrary() {
  try {
    return await prisma.workoutPlan.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  } catch (error) {
    console.error("[GET_ADMIN_WORKOUT_LIBRARY_ERROR]", error);
    return [];
  }
}

export async function getAdminRecipeLibrary() {
  try {
    return await prisma.meal.findMany({
      orderBy: { dayNumber: "asc" },
      take: 20,
    });
  } catch (error) {
    console.error("[GET_ADMIN_RECIPE_LIBRARY_ERROR]", error);
    return [];
  }
}
