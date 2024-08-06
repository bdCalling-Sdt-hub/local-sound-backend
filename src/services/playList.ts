import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createPlayList({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) {
  return prisma.playLists.create({
    data: {
      userId,
      name,
    },
  });
}

export function getPlayListsByUserId({
  userId,
  limit,
  skip,
}: {
  userId: string;
  limit: number;
  skip: number;
}) {
  return prisma.playLists.findMany({
    where: {
      userId,
    },
    take: limit,
    skip,
  });
}

export function countPlayLists(userId?: string) {
  return prisma.playLists.count({
    where: {
      userId,
    },
  });
}