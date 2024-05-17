import bcryptjs from "bcryptjs";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { FormSchemaLogin } from "./schemas";
import { GetUserByEmail } from "./data/user";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      async authorize(credentials) {
        const validateCredentials = FormSchemaLogin.safeParse(credentials);

        if (validateCredentials.success) {
          const { email, password } = validateCredentials.data;

          const user = await GetUserByEmail(email);

          if (!user || !user.password) {
            return null;
          }

          if(password === user.password){
            return user;
          }

          const hasSamePassword = await bcryptjs.compare(
            password,
            user.password
          );

          if (hasSamePassword) {
            return user;
          }

          return null;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;