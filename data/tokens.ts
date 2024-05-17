"use server";

import crypto from "crypto";
import { db } from "@/prismadb";
import { GetUserById } from "./user";

export const GenerateVerifyOtpCode = () => {
  const code = crypto.randomBytes(32).toString("hex");
  return code.toString();
};

export const CreateVerifyToken = async (userId: string, token: string) => {
  const existingToken = await GetVerifyTokenByUserId(userId);

  if (existingToken) {
    await db.verifyEmailToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const user = await GetUserById(userId);

  if(!user){
    return null;
  }

  if(user.emailVerified){
    return null;
  }

  const exipredTime = new Date(new Date().getTime() + 10 * 60 * 1000); //10 minutes

  return await db.verifyEmailToken.create({
    data: {
      userId: userId,
      token: token,
      expiredAt: exipredTime,
    },
  });
};

export const GetVerifyTokenByUserId = async (userId: string) => {
  try {
    const existingToken = await db.verifyEmailToken.findUnique({
      where: {
        userId,
      },
    });

    return existingToken;
  } catch (err) {
    return null;
  }
};

export const GetVerifyTokenByToken = async (token: string) => {
  try {
    const existingToken = await db.verifyEmailToken.findFirst({
      where: {
        token,
      },
    });

    return existingToken;
  } catch (err) {
    return null;
  }
};

export const GetUserByVerifyToken = async (token: string) => {
  try {
    const verifyToken = await GetVerifyTokenByToken(token);

    if (!verifyToken) {
      return null;
    }

    const user = await GetUserById(verifyToken?.userId);

    if (!user || !user.email) {
      return null;
    }

    return user;
  } catch (err) {
    return null;
  }
};
