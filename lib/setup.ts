import { prisma } from "./prisma/prisma";

export async function isSetupRequired() {
  try {
    const userCount = await prisma.user.count();
    return userCount === 0;
  } catch (error) {
    console.error("Error checking setup status:", error);
    return false; // Default to false to avoid redirect loops on DB error
  }
}
