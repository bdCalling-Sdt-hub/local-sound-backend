import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createSubscription({
  name,
  duration,
  price,
  Benefits,
}: {
  name: string;
  duration: number;
  price: number;
  Benefits: string[];
}) {
  return prisma.subscriptions.create({
    data: {
      name,
      duration,
      Benefits,
      price,
    },
  });
}

export function getSubscriptions(limit: number, skip: number) {
  return prisma.subscriptions.findMany({
    take: limit,
    skip,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function getSubscriptionById(id: string) {
  return prisma.subscriptions.findUnique({
    where: {
      id,
    },
  });
}
