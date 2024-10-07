import prisma from "../db";

export const profilefind = async (userId: number) => {
  try {
    const res = await prisma.profile.findUnique({
      where: {
        userId,
      },
    });
    if (res) {
      return true;
    }
    return false;
  } catch (e) {
    console.error("Error creating user:", e);
    return false;
  }
};
