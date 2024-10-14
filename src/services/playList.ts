import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createPlayList({
  userId,
  name,
  image,
}: {
  userId: string;
  name: string;
  image: string;
}) {
  return prisma.playLists.create({
    data: {
      userId,
      name,
      image,
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
    orderBy: {
      createdAt: "desc",
    },
    include: {
      PlayListMusics: {
        include: {
          music: {
            include: {
              user: {
                select: {
                  name: true,
                },
              }
            },
          },
        },
      },
      // _count: {
      //   select: {
      //     PlayListMusics: true,
      //   },
      // },
    },
  });
}

export function countPlayLists(userId?: string) {
  return prisma.playLists.count({
    where: {
      userId,
    },
  });
}

export function getPlayListById(id: string) {
  return prisma.playLists.findFirst({
    where: {
      id,
    },
  });
}
