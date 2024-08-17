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
    include:{
      music:{
        select:{
          name:true
        }
      }
    }
  });
}

export function getResells({ limit, skip }: { limit: number; skip: number }) {
  return prisma.reSells.findMany({
    take: limit,
    skip,
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

export function countResells() {
  return prisma.reSells.count();
}
