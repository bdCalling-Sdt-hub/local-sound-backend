import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createReSell({
  userId,
  musicId,
  price,
  quantity,
}: {
  userId: string;
  musicId: string;
  price: number;
  quantity: number;
}) {
  return prisma.$transaction([
    prisma.reSells.create({
      data: {
        userId,
        musicId,
        price,
        quantity,
      },
    }),
    prisma.purchasedMusics.update({
      where: {
        userId_musicId: {
          userId,
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

export function updateReSells({
  id,
  changes,
}: {
  id: string;
  changes: {
    price?: number;
    quantity?: number;
  };
}) {
  return prisma.reSells.update({
    where: {
      id,
    },
    data: changes,
  });
}
