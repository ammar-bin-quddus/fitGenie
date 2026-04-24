"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { signIn } from "@/lib/auth";
import type { ActionState } from "@/types";

export async function registerUser(
  values: Parameters<typeof registerSchema.parse>[0],
): Promise<ActionState<{ id: string }>> {
  try {
    const validated = registerSchema.parse(values);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return { success: false, error: "An account already exists for this email." };
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        profile: {
          create: {},
        },
      },
    });

    return { success: true, data: { id: user.id } };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[REGISTER_USER_ERROR]", errorMessage, error);
    return { success: false, error: "Unable to create your account right now." };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        error: "Invalid email or password.",
      } satisfies ActionState;
    }

    throw error;
  }
}
