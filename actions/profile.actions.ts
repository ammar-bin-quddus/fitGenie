"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validations/profile";
import type { ActionState } from "@/types";

export async function updateProfile(
  values: Parameters<typeof profileSchema.parse>[0],
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = profileSchema.parse(values);

    await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        ...validated,
      },
      update: validated,
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("[UPDATE_PROFILE_ERROR]", error);
    return { success: false, error: "Failed to update your profile." };
  }
}

export async function getProfile() {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    return await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });
  } catch (error) {
    console.error("[GET_PROFILE_ERROR]", error);
    return null;
  }
}
