import { ActivityLevel, FitnessGoal, Role } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role?: Role;
      fitnessGoal?: FitnessGoal | null;
      activityLevel?: ActivityLevel | null;
    };
  }

  interface User {
    role?: Role;
    fitnessGoal?: FitnessGoal | null;
    activityLevel?: ActivityLevel | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    fitnessGoal?: FitnessGoal | null;
    activityLevel?: ActivityLevel | null;
  }
}
