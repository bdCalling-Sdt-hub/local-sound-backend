import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createPurchasedMusic({
  userId,
  musicId,
  quantity,
}: {
  userId: string;
  musicId: string;
  quantity: number;
}) {
  return prisma.purchasedMusics.create({
    data: {
      userId,
      musicId,
      quantity,
    },
  });
}

export function getPurchasedMusicsByUserId({
  userId,
  limit,
  skip,
}: {
  userId: string;
  limit: number;
  skip: number;
}) {
  return prisma.purchasedMusics.findMany({
    where: {
      userId,
      quantity:{
        gt: 0,
      }
    },
    take: limit,
    skip,
    include: {
      music: {
        select: {
          id: true,
          name: true,
          image: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
}

export function countPurchasedMusics(userId?: string) {
  return prisma.purchasedMusics.count({
    where: {
      userId,
    },
  });
}

export function updatePurchasedMusic({
  myMusicId,
  changes,
}: {
  myMusicId: string;
  changes: {
    quantity: number;
  };
}) {
  return prisma.purchasedMusics.update({
    where: {
      id: myMusicId,
    },
    data: changes,
  });
}

export function getPurchasedMusicByUserIdAndMusicId({
  userId,
  musicId,
}: {
  userId: string;
  musicId: string;
}) {
  return prisma.purchasedMusics.findFirst({
    where: {
      userId,
      musicId,
    },
  });
}