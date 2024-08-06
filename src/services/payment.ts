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
  });
}

export function countPayments() {
  return prisma.payments.count();
}