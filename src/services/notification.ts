import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createNotification({
  userId,
  message,
}: {
  userId: string;
  message: string;
}) {
  return prisma.notifications.create({
    data: {
      userId,
      message,
    },
  });
}

export function getNotificationsByUserId(
  userId: string,
  limit: number,
  skip: number
) {
  return prisma.notifications.findMany({
    where: {
      userId,
    },
    take: limit,
    skip,
  });
}

export function countNotifications(userId?: string) {
  return prisma.notifications.count({
    where: {
      userId,
    },
  });
}