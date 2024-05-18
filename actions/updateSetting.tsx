"use server";

import { auth, signOut } from "@/auth";
import { FormNameType } from "@/components/auth/SettingsForm/NameForm";
import { FormRoleSchema } from "@/components/auth/SettingsForm/RoleForm";
import { FormTwoFactorSchema } from "@/components/auth/SettingsForm/TwoFactorForm";
import { GetUserById } from "@/data/user";
import { db } from "@/prismadb";
import { FormSchemaName, FormSchemaRole, FormShcemaTwoFactor } from "@/schemas";
import { SendDelteAccount } from "./emailSender";

export const ChangeName = async (data: FormNameType) => {
  const formValidation = FormSchemaName.safeParse(data);

  if (!formValidation.success) {
    return { error: "Invalid data" };
  }

  const { name } = formValidation.data;

  const session = await auth();

  if (
    !session ||
    !session.user.id ||
    !session.user ||
    !session.user.isCredentials
  ) {
    return { error: "User not found" };
  }

  const existingUser = await GetUserById(session.user.id);

  if (!existingUser) {
    return { error: "User not found" };
  }

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      name,
    },
  });

  return { success: true };
};

export const ChangeIsTwoFactor = async (data: FormTwoFactorSchema) => {
  const formValidation = FormShcemaTwoFactor.safeParse(data);

  if (!formValidation.success) {
    return { error: "Invalid data" };
  }

  const { isTWoFactor } = formValidation.data;

  const session = await auth();

  if (
    !session ||
    !session.user.id ||
    !session.user ||
    !session.user.isCredentials
  ) {
    return { error: "User not found" };
  }

  const existingUser = await GetUserById(session.user.id);

  if (!existingUser) {
    return { error: "User not found" };
  }

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      isTwoFactor: isTWoFactor === "true" ? true : false,
    },
  });

  return { success: true };
};

export const ChangeRole = async (data: FormRoleSchema) => {
  const formValidation = FormSchemaRole.safeParse(data);

  if (!formValidation.success) {
    return { error: "Invalid data" };
  }

  const { role } = formValidation.data;

  const session = await auth();

  if (
    !session ||
    !session.user.id ||
    !session.user
  ) {
    return { error: "User not found" };
  }

  const existingUser = await GetUserById(session.user.id);

  if (!existingUser) {
    return { error: "User not found" };
  }

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      role: role === "ADMIN" ? "ADMIN" : "USER",
    },
  });

  return { success: true };
};

export const DeleteAccount = async () => {
  const session = await auth();

  if (
    !session ||
    !session.user.id ||
    !session.user ||
    !session.user.email
  ) {
    return { error: "User not found" };
  }

  const existingUser = await GetUserById(session.user.id);

  if (!existingUser) {
    return { error: "User not found" };
  }

  await db.verifyEmailToken.deleteMany({
    where: {
      userId: existingUser.id,
    },
  });

  await db.twoFactorModel.deleteMany({
    where: {
      userId: existingUser.id,
    },
  });

  await db.resetPassword.deleteMany({
    where: {
      userId: existingUser.id,
    },
  });

  await db.user.deleteMany({
    where: {
      id: existingUser.id,
    },
  });

  await SendDelteAccount(session?.user.email);

  return { success: true }
};
