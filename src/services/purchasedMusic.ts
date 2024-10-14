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
  return prisma.purchasedMusics.upsert({
    where: {
      userId_musicId: {
        userId,
        musicId,
      },
    },
    create: {
      userId,
      musicId,
      quantity,
    },
    update: {
      quantity: {
        increment: quantity,
      },
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
      quantity: {
        gt: 0,
      },
    },
    take: limit,
    skip,
    include: {
      music: {
        include: {
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

export function decrementPurchasedMusicQuantity({
  userId,
  musicId,
  quantity,
}: {
  userId: string;
  musicId: string;
  quantity: number;
}) {
  return prisma.purchasedMusics.update({
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
  });
}
