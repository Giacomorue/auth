import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./prismadb";
import authConfig from "./auth.config";
import { GetUserByEmail, GetUserById } from "./data/user";
import { RoleDb } from "@prisma/client";
import { GetTwoFATokenbyUserId } from "./actions/login";

declare module "next-auth" {
  interface Session {
    user: {
      role: RoleDb;
      isTwoFactor: boolean;
      isCredentials: boolean;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        return true;
      }

      if (!user || !user.email) {
        return false;
      }

      //CHECK EMAIL VERIFICATION
      const existingUser = await GetUserByEmail(user.email);

      if (!existingUser || !existingUser.emailVerified) {
        console.log("Email not verified");
        return false;
      }

      //CHECK TWO FACTOR AUTH
      if (existingUser.isTwoFactor) {
        const existingToken = await GetTwoFATokenbyUserId(existingUser.id);

        if (!existingToken) {
          return false;
        }

        if (!existingToken.correctd) {
          return false;
        }

        await db.twoFactorModel.delete({
          where: {
            id: existingToken.id,
          },
        });
      }

      return true;
    },
    async jwt({ token }) {
      if (token.sub) {

        const user = await GetUserById(token.sub);

        token.isCredentials = !!user?.password;
        token.role = user?.role;
        token.isTwoFactor = user?.isTwoFactor;
        token.name = user?.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }

      if (token.role) {
        session.user.role = token.role as RoleDb;
      }

      if (session.user) {
        console.log("TOKEN: ", {token});
        session.user.name = token.name;
        console.log("SESSION: ", {session});
        session.user.isTwoFactor = !!token.isTwoFactor || (false as boolean);
        session.user.isCredentials =
          !!token.isCredentials || (false as boolean);
      }
      return session;
    },
  },
  events: {
    async linkAccount({ user, account }) {
      if (user && user.id) {
        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            emailVerified: new Date(),
          },
        });
      }
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  ...authConfig,
});
