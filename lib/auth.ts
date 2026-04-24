import type { NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { ActivityLevel, FitnessGoal, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

import authConfig from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: {},
      password: {},
    },
    async authorize(credentials) {
      const parsed = loginSchema.safeParse(credentials);
      if (!parsed.success) return null;

      const user = await prisma.user.findUnique({
        where: { email: parsed.data.email },
        include: { profile: true },
      });

      if (!user?.password) return null;

      const isValid = await bcrypt.compare(parsed.data.password, user.password);
      if (!isValid) return null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        fitnessGoal: user.profile?.fitnessGoal ?? null,
        activityLevel: user.profile?.activityLevel ?? null,
      };
    },
  }),
];

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  );
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

export const fullAuthConfig = {
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.fitnessGoal = user.fitnessGoal;
        token.activityLevel = user.activityLevel;
      }

      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.role = session.user.role;
        token.fitnessGoal = session.user.fitnessGoal;
        token.activityLevel = session.user.activityLevel;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role | undefined;
        session.user.fitnessGoal = token.fitnessGoal as FitnessGoal | null | undefined;
        session.user.activityLevel =
          token.activityLevel as ActivityLevel | null | undefined;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(fullAuthConfig);
