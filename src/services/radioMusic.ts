import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createRadioMusic(musicId: string) {
  return prisma.radioMusics.create({
    data: {
      musicId,
    },
  });
}

export function getRadioMusics({
  limit,
  skip,
}: {
  limit: number;
  skip: number;
}) {
  return prisma.radioMusics.findMany({
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

export function deleteRadioMusic(musicId: string) {
  return prisma.radioMusics.delete({
    where: {
      musicId,
    },
  });
}

export function countRadioMusic() {
  return prisma.radioMusics.count();
}
