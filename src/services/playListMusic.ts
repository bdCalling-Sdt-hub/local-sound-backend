import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createPlayListMusic({
  playListId,
  musicId,
}: {
  playListId: string;
  musicId: string;
}) {
  return prisma.playListMusics.create({
    data: {
      playListId,
      musicId,
    },
  });
}

export function getPlayListMusicByPlayListIdAndMusicId({
  playListId,
  musicId,
}: {
  playListId: string;
  musicId: string;
}) {
  return prisma.playListMusics.findFirst({
    where: {
      playListId,
      musicId,
    },
  });
}

export function getPlayListMusicsByPlayListId({
  playListId,
  limit,
  skip,
}: {
  playListId: string;
  limit: number;
  skip: number;
}) {
  return prisma.playListMusics.findMany({
    where: {
      playListId,
    },
    take: limit,
    skip,
    orderBy: {
      createdAt: "desc",
    },
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

export function countPlayListMusic(playListId: string) {
  return prisma.playListMusics.count({
    where: {
      playListId,
    },
  });
}

export function deletePlayListMusic({
  playListId,
  musicId,
}: {
  playListId: string;
  musicId: string;
}) {
  return prisma.playListMusics.deleteMany({
    where: {
      playListId,
      musicId,
    },
  });
}
