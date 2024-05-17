import { db } from "@/prismadb";

export const GetUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: id,
      },
    });

    return user;
  } catch (err) {
    return null;
  }
};

export const GetUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (err) {
    return null;
  }
};
