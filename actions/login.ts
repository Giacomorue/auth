"use server";

import { signIn } from "@/auth";
import { GetUserByEmail, GetUserById } from "@/data/user";
import { FormSchemaLogin } from "@/schemas";
import { error } from "console";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import * as z from "zod";
import crypto from "crypto";
import { db } from "@/prismadb";
import { SendTwoFA } from "./emailSender";
import bcryptjs from "bcryptjs";
import { GetVerifyTokenByUserId } from "@/data/tokens";
import { RequestVerifyEmailLink } from "./requestVerifyEmailLink";

export const Login = async (
  data: z.infer<typeof FormSchemaLogin>,
  code?: string
) => {
  const formValidation = FormSchemaLogin.safeParse(data);

  if (!formValidation.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = formValidation.data;

  const user = await GetUserByEmail(email);

  if (!user || !user.email || !user.password) {
    return { error: "Invalid credentials!" };
  }

  if (!user.emailVerified) {
    await RequestVerifyEmailLink(user.email)
    return { error: "Email not verified! We send a new email now!" };
  }

  const isCorrectPassword = await bcryptjs.compare(password, user.password);

  if (!isCorrectPassword) {
    return { error: "Invalid credentials!" };
  }

  if (user.isTwoFactor && !code) {

    const existingToken = await GetTwoFATokenbyUserId(user.id);
    
    if(existingToken){
      const hasExipired = new Date() > new Date(existingToken.expiredAt);
      if(hasExipired){
        await db.twoFactorModel.delete({
          where: {
            id: existingToken.id,
          },
        });
      }
      else{
        return { twoFactor: true, success: "Email already sent", userId: user.id };
      }
    }

    const twoFa = await RequestLoginTWoFA(user.id);

    if (twoFa.error) {
      return { error: twoFa.error };
    }

    return { twoFactor: true, success: "Email sent", userId: user.id };

  } else if (user.isTwoFactor && code) {

    const existingToken = await GetTwoFATokenbyUserId(user.id);

    if(!existingToken){
      return { twoFactor: false, error: "Code does't exist" };
    }

    const hasExpired = new Date() > new Date(existingToken.expiredAt);

    if(hasExpired){
      return { twoFactor: false, error: "Code has expired" };
    }

    if(existingToken.token !== code){
      return { twoFactor: true, error: "Invalid code" };
    }

    await db.twoFactorModel.update({
      where: {
        id: existingToken.id,
      },
      data: {
        correctd: true,
      }
    })
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Invalid credentials!" };
    }

    throw err;
  }

  return { success: true };
};

export const RequestLoginTWoFA = async (userId: string) => {
  const user = await GetUserById(userId);

  if (!user || !user.email || !user.password) {
    return { error: "User not found!" };
  }

  const twoFaToken = await GetTwoFATokenbyUserId(userId);

  if (twoFaToken) {
    await db.twoFactorModel.delete({
      where: {
        id: twoFaToken.id,
      },
    });
  }

  const token = await GenerateTwoFaCode();

  if (!token || !(typeof token === "string")) {
    return { error: "Error generating token!" };
  }

  const exipredTime = new Date(new Date().getTime() + 10 * 60 * 1000); // 10 Min

  const dbToken = await db.twoFactorModel.create({
    data: {
      userId: userId,
      token: token,
      expiredAt: exipredTime,
    },
  });

  if (!dbToken) {
    return { error: "Error creating token. Please try to login!" };
  }

  await SendTwoFA(user.email, dbToken?.token);

  return { success: true };
};

export const GenerateTwoFaCode = () => {
  const code = Math.floor(100000 + Math.random() * 9000);
  return code.toString();
};

export const GetTwoFATokenbyUserId = async (userId: string) => {
  try {
    const existingToken = await db.twoFactorModel.findUnique({
      where: {
        userId: userId,
      },
    });

    return existingToken;
  } catch (err) {
    return null;
  }
};

export const GetTwoFATokenByToken = async (token: string) => {
  try {
    const existingToken = await db.twoFactorModel.findUnique({
      where: {
        token: token,
      },
    });

    return existingToken;
  } catch (err) {
    return null;
  }
};

export const GetUserByTwoFAToken = async (token: string) => {
  try {
    const existingToken = await GetTwoFATokenByToken(token);

    if (!existingToken) {
      return null;
    }

    const user = await GetUserById(existingToken.userId);

    if (!user || !user.email) {
      return null;
    }

    return user;
  } catch (err) {
    return null;
  }
};
