import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createTransaction({
  buyerId,
  sellerId,
  amount,
  musicId,
  quantity,
  stripeTransactionId,
  resell,
}: {
  buyerId: string;
  sellerId: string;
  amount: number;
  musicId: string;
  quantity: number;
  stripeTransactionId: string;
  resell: boolean;
}) {
  if (resell) {
    return prisma.$transaction([
      prisma.transactions.create({
        data: {
          sellerId,
          buyerId,
          amount,
          musicId,
          quantity,
          stripeTransactionId,
        },
      }),
      prisma.purchasedMusics.upsert({
        where: {
          userId_musicId: {
            userId: buyerId,
            musicId,
          },
        },
        create: {
          userId: buyerId,
          musicId,
          quantity,
        },
        update: {
          quantity: {
            increment: quantity,
          },
        },
      }),
      prisma.users.update({
        where: {
          id: sellerId,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      }),
      prisma.reSells.update({
        where: {
          userId_musicId: {
            userId: sellerId,
            musicId,
          },
        },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      }),
      prisma.purchasedMusics.update({
        where: {
          userId_musicId: {
            userId: buyerId,
            musicId,
          },
        },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      }),
    ]);
  }
  return prisma.$transaction([
    prisma.transactions.create({
      data: {
        sellerId,
        buyerId,
        amount,
        musicId,
        quantity,
        stripeTransactionId,
      },
    }),
    prisma.purchasedMusics.upsert({
      where: {
        userId_musicId: {
          userId: buyerId,
          musicId,
        },
      },
      create: {
        userId: buyerId,
        musicId,
        quantity,
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
    }),
    prisma.users.update({
      where: {
        id: sellerId,
      },
      data: {
        balance: {
          increment: amount,
        },
      },
    }),
  ]);
}

export function getTransactionsByUser({ userId }: { userId: string }) {
  const currentDate = new Date();
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);

  return prisma.transactions.aggregate({
    where: {
      sellerId: userId,
      createdAt: {
        gte: lastMonth,
        lt: currentDate,
      },
    },
    _sum: {
      amount: true,
    },
  })
}
