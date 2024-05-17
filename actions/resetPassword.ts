"use server";

import crypto from "crypto";
import { GetUserByEmail, GetUserById } from "@/data/user";
import { FormSchemaResetPassword } from "@/schemas";
import * as z from "zod";
import { db } from "@/prismadb";
import { SendResetPassword } from "./emailSender";

export const GenerateResetPasswordToken = () => {
  const code = crypto.randomBytes(32).toString("hex");
  return code.toString();
};

export const GetResetPasswordTokenByUserId = async (userId: string) => {
  try {
    const existingToken = await db.resetPassword.findUnique({
      where: {
        userId: userId,
      },
    });

    return existingToken;
  } catch (err) {
    return null;
  }
};

export const GetResetPasswordTokenByToken = async (token: string) => {
  try {
    const existingToken = await db.resetPassword.findUnique({
      where: {
        token: token,
      },
    });

    return existingToken;
  } catch (err) {
    return null;
  }
};

export const GetUserByResetPasswordToken = async (token: string) => {
  try {
    const existingToken = await GetResetPasswordTokenByToken(token);
    
    if(!existingToken) {
        return null;
    }

    const user = await GetUserById(existingToken.userId);

    if(!user ||!user.email) {
        return null;
    }

    return user;
  } catch (err) {
    return null;
  }
};

export const RequestNewPassword = async (
  data: z.infer<typeof FormSchemaResetPassword>
) => {
  const formValidation = FormSchemaResetPassword.safeParse(data);

  if (!formValidation.success) {
    return { error: "Invalid email" };
  }

  const { email } = formValidation.data;

  const user = await GetUserByEmail(email);

  if (!user) {
    return { error: "User does not exist" };
  }

  const existingToken = await GetResetPasswordTokenByUserId(user.id);

  if(existingToken){
    await db.resetPassword.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const expired = new Date(new Date().getTime() + 10 * 60 * 1000); //10 minutes

  const token = await GenerateResetPasswordToken();

  console.log(token);

  if(!token || !(typeof token === "string") ){
    return { error: "Impossible generate a token" };
  }

  const newResetPasswordToken = await db.resetPassword.create({
    data: {
      userId: user.id,
      token: token,
      expiredAt: expired,
    },
  });

  if(!newResetPasswordToken){
    return { error: "Something went wrong" };
  }

  try{
    await SendResetPassword(email, newResetPasswordToken.token);
  }catch(err){
    console.log(err);
    return { error: "Something went wrong" };
  }

  return { success: true, email: email };
};
