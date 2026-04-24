import type { NextAuthConfig } from "next-auth";

export default {
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthRoute =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");
      const isProtectedRoute = [
        "/dashboard",
        "/workout",
        "/nutrition",
        "/progress",
        "/community",
        "/ai-coach",
      ].some((path) => nextUrl.pathname.startsWith(path));

      if (nextUrl.pathname.startsWith("/admin")) {
        return auth?.user?.role === "ADMIN";
      }

      if (isProtectedRoute) return isLoggedIn;
      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
