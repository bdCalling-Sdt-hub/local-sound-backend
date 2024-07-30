import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createOtp(userId: string) {
  return prisma.oTPs.create({
    data: {
      userId,
      code: Math.floor(1000 + Math.random() * 9000).toString(), // 4 digit code
      expiredAt: new Date(Date.now() + 3 * 60 * 1000), // 3 minutes
    },
  });
}

export function getLastOtpByUserId(userId: string) {
  return prisma.oTPs.findFirst({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
