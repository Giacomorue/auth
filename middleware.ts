import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { authRoutes, protectedRoutes } from "./routes";
import { signOut } from "./auth";

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;


  const isProtectedRoute = protectedRoutes.filter((route) =>
    nextUrl.pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isProtectedRoute.length > 0 && !isLoggedIn) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  if (isLoggedIn && isAuthRoute) {
    return Response.redirect(new URL(protectedRoutes[0], nextUrl));
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
