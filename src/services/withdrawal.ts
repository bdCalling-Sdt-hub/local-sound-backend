import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createWithdrawal({
  amount,
  userId,
  accountNo,
  accountType,
  bankName,
}: {
  accountNo: string;
  accountType: string;
  amount: number;
  bankName: string;
  userId: string;
}) {
  return prisma.withdrawals.create({
    data: {
      accountNo,
      accountType,
      amount,
      bankName,
      userId,
    },
  });
}

export function getWithdrawals(limit: number, skip: number, userId?: string) {
  return prisma.withdrawals.findMany({
    where: {
      userId,
    },
    take: limit,
    skip,
  });
}

export function updateWithdrawals(id: string, status: "APPROVED" | "REJECTED") {
  return prisma.withdrawals.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
}
