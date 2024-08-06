import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createLike({
  userId,
  musicId,
}: {
  userId: string;
  musicId: string;
}) {
  return prisma.likes.create({
    data: {
      userId,
      musicId,
    },
  });
}

export function getLikesByUserId({
  userId,
  limit,
  skip,
}: {
  userId: string;
  limit: number;
  skip: number;
}) {
  return prisma.likes.findMany({
    where: {
      userId,
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

export function countLikes(userId?: string) {
  return prisma.likes.count({
    where: {
      userId,
    },
  });
}

export function deleteLike(id: string) {
  return prisma.likes.delete({
    where: {
      id,
    },
  });
}

export function getLikeById(id: string) {
  return prisma.likes.findUnique({
    where: {
      id,
    },
  });
}
