"use server";

import { GetUserByEmail } from "@/data/user";
import { db } from "@/prismadb";
import { FormSchemaRegister } from "@/schemas";
import * as z from "zod";
import bcryptjs from "bcryptjs";
import { CreateVerifyToken, GenerateVerifyOtpCode } from "@/data/tokens";
import { RequestVerifyEmailLink } from "./requestVerifyEmailLink";

export const Register = async (values: z.infer<typeof FormSchemaRegister>) => {
  const formValidation = FormSchemaRegister.safeParse(values);

  if (!formValidation.success) {
    return { error: "Invalid data" };
  }

  const { name, email, password } = formValidation.data;

  const existingUser = await GetUserByEmail(email);

  if (existingUser) {
    return { error: "User already exists" };
  }

  const hashedPassword = await bcryptjs.hash(password, 12);

  const newUser = await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  const dbToken = await RequestVerifyEmailLink(newUser.id);

  return { success: true, user: newUser };
};
