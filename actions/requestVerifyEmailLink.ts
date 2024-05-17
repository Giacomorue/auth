"use server";

import { CreateVerifyToken, GenerateVerifyOtpCode, GetVerifyTokenByUserId } from "@/data/tokens";
import { db } from "@/prismadb";
import {SendOtp} from "./emailSender";
import { GetUserById } from "@/data/user";

export const RequestVerifyEmailLink = async (userId: string) => {

  const user = await GetUserById(userId);

  if(!user || !user.email || !user.password){
    return { error: "User not found" };
  }

  if(user.emailVerified){
    return { error: "Email already verified" };
  }

  const existingToken = await GetVerifyTokenByUserId(user?.id);

  if (existingToken) {
    await db.verifyEmailToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const token = await GenerateVerifyOtpCode();
  const dbToken = await CreateVerifyToken(userId, token);

  if (!dbToken) {
    return { error: "Error creating token. Please try to login!" };
  }

  await SendOtp(user.email, dbToken?.token);

  return { dbToken: dbToken };
};