import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createPayment({
  userId,
  amount,
  subscriptionId,
  transactionId,
  expireAt,
}: {
  userId: string;
  amount: number;
  subscriptionId: string;
  transactionId: string;
  expireAt: Date;
}) {
  return prisma.payments.create({
    data: {
      userId,
      amount,
      subscriptionId,
      transactionId,
      expireAt,
    },
  });
}

export function getLastPaymentByUserId(userId: string) {
  return prisma.payments.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export function getPayments(limit: number, skip: number) {
  return prisma.payments.findMany({
    take: limit,
    skip,
    select: {
      id: true,
      amount: true,
      createdAt: true,
      transactionId: true,
      subscription: {
        select: {
          name: true,
        },
      },
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function countPayments() {
  return prisma.payments.count();
}

export function getPaymentsByYear(year: string) {
  return prisma.payments.findMany({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year}-12-31`),
      },
    },
  });
}

export function countEarnings() {
  return prisma.payments.aggregate({
    _sum: {
      amount: true,
    },
  });
}

export function countSubscribers() {
  return prisma.payments.groupBy({
    by: ["userId"],
  });
}
