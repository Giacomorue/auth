"use server";

import bcryptjs from "bcryptjs";
import { error } from "console";
import { GetResetPasswordTokenByToken } from "./resetPassword";
import * as z from "zod";
import { FormSchemaNewPassword } from "@/schemas";
import { GetUserById } from "@/data/user";
import { db } from "@/prismadb";

export const CheckNewPasswordToken = async (token: string) => {
  try {
    const existingToken = await GetResetPasswordTokenByToken(token);
    console.log(existingToken);
    if (!existingToken) {
      return { error: true };
    }

    const hasExpired = new Date() > new Date(existingToken.expiredAt);

    if (hasExpired) {
      await db.resetPassword.delete({
        where: {
          id: existingToken.id,
        },
      });
      return { error: true };
    }

    const user = await GetUserById(existingToken.userId);

    if (!user) {
      return { error: true };
    }

    return { success: true };
  } catch (err) {
    return { error: false };
  }
};

export const ChangePassword = async (
  token: string,
  data: z.infer<typeof FormSchemaNewPassword>
) => {
  const existingToken = await GetResetPasswordTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token" };
  }

  const formValidation = FormSchemaNewPassword.safeParse(data);

  if (!formValidation.success) {
    return { error: "Invalid data" };
  }

  const { password, confirmPassword } = formValidation.data;

  if (confirmPassword !== password) {
    return { error: "Passwords do not match" };
  }

  const hasExpired = new Date() > new Date(existingToken.expiredAt);

  if (hasExpired) {
    await db.resetPassword.delete({
      where: {
        id: existingToken.id,
      },
    });

    return { error: "Token has expired" };
  }

  const user = await GetUserById(existingToken.userId);

  if (!user) {
    return { error: "User does not exist" };
  }

  const hashedPassword = await bcryptjs.hash(password, 12);

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await db.resetPassword.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Password has been changed" };
};
