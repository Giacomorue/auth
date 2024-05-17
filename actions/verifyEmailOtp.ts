"use server";

import { GetUserByVerifyToken, GetVerifyTokenByToken } from "@/data/tokens";
import { db } from "@/prismadb";
import { FormSchemaVerifyOtp } from "@/schemas";
import * as z from "zod";

export const VerifyEmailToken = async (token: string) => {

  const dbToken = await GetVerifyTokenByToken(token);

  if (!dbToken) {
    return { error: "Error in validation" };
  }

  const hasExpired = new Date() > new Date(dbToken.expiredAt);
  
  if(hasExpired){
    return { error: "Validation exipred, please login and request a new validation link" };
  }

  const user = await GetUserByVerifyToken(dbToken.token);

  if (!user) {
    return { error: "Error in validation" };
  }

  const userUpdated = await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  await db.verifyEmailToken.delete({
    where: {
      id: dbToken.id,
    },
  });

  return { success: true };
};
