import NextAuth from "next-auth";

import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth(() => undefined);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/workout/:path*",
    "/nutrition/:path*",
    "/progress/:path*",
    "/community/:path*",
    "/ai-coach/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
