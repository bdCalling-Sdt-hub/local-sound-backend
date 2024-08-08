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
  return prisma.$transaction([
    prisma.withdrawals.create({
      data: {
        accountNo,
        accountType,
        amount,
        bankName,
        userId,
      },
    }),
    prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        balance: {
          decrement: amount,
        },
      }
    }),
  ]);
}

export function getWithdrawals(limit: number, skip: number, userId?: string) {
  return prisma.withdrawals.findMany({
    where: {
      userId,
    },
    take: limit,
    skip,
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy:{
      createdAt: "desc",
    }
  });
}

export function countWithdrawals(userId?: string) {
  return prisma.withdrawals.count({
    where: {
      userId,
    },
  });
}

export function updateWithdrawal(id: string, status: "APPROVED" | "REJECTED") {
  return prisma.withdrawals.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
}

export function getWithdrawalById(id: string) {
  return prisma.withdrawals.findUnique({
    where: {
      id,
    },
  });
}
