import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createSubscription({
  name,
  duration,
  price,
  benefits,
}: {
  name: string;
  duration: number;
  price: number;
  benefits: string[];
}) {
  return prisma.subscriptions.create({
    data: {
      name,
      duration,
      benefits,
      price,
    },
  });
}

export function getSubscriptions(limit: number, skip: number) {
  return prisma.subscriptions.findMany({
    take: limit,
    skip,
    where: {
      isDeleted: false,
    },
    orderBy: {
      price: "asc",
    },
    select: {
      id: true,
      name: true,
      price: true,
      duration: true,
      benefits: true,
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

export function updateSubscription(
  id: string,
  {
    name,
    duration,
    price,
    benefits,
  }: {
    name?: string;
    duration?: number;
    price?: number;
    benefits?: string[];
  }
) {
  return prisma.subscriptions.update({
    where: {
      id,
    },
    data: {
      name,
      duration,
      price,
      benefits,
    },
    select: {
      id: true,
      name: true,
      price: true,
      duration: true,
      benefits: true,
    },
  });
}

export function deleteSubscription(id: string) {
  return prisma.subscriptions.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
}

export function countSubscription() {
  return prisma.subscriptions.count({
    where: {
      isDeleted: false,
    },
  });
}