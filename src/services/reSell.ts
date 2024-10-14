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
  return prisma.reSells.create({
    data: {
      userId,
      musicId,
      price,
      quantity,
    },
  });
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
    include: {
      music: {
        select: {
          name: true,
        },
      },
    },
  });
}

export function getResells({
  limit,
  skip,
  name,
}: {
  limit: number;
  skip: number;
  name?: string;
}) {
  return prisma.reSells.findMany({
    take: limit,
    skip,
    where: {
      music: {
        name: { startsWith: name },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      music: {
        select: {
          name: true,
        },
      },
    },
  });
}

export function countResells({ name }: { name?: string }) {
  return prisma.reSells.count({
    where: {
      music: {
        name: { startsWith: name },
      },
    },
  });
}

export function updateReSellMusicQuantity(
  userId: string,
  { musicId, quantity }: { musicId: string; quantity: number }
) {
  return prisma.reSells.update({
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
