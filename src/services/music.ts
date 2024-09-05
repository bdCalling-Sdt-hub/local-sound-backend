import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createMusic({
  name,
  price,
  image,
  userId,
  audio,
}: {
  name: string;
  image: string;
  userId: string;
  audio: string;
  price: number;
}) {
  return prisma.musics.create({
    data: {
      audio,
      image,
      name,
      price,
      userId,
    },
  });
}

export function getMusics({
  limit,
  skip,
  name,
  price,
  userId,
  url = false,
}: {
  limit: number;
  skip: number;
  name?: string;
  price: "asc" | "desc";
  url?: boolean;
  userId?: string;
}) {
  return prisma.musics.findMany({
    take: limit,
    skip,
    where: {
      name: {
        startsWith: name,
      },
      userId,
    },
    include: { user: { select: { name: true } } },   
    orderBy: {
      ...(name ? { price } : { createdAt: "desc" }),
    },
  });
}

export function countMusic({
  name,
  userId,
}: {
  name?: string;
  userId?: string;
}) {
  return prisma.musics.count({ where: { name: { startsWith: name }, userId } });
}

export function updateMusic(
  musicId: string,
  data: {
    name?: string;
    price?: number;
    image?: string;
    audio?: string;
  }
) {
  return prisma.musics.update({
    where: { id: musicId },
    data,
  });
}

export function getMusicById(musicId: string) {
  return prisma.musics.findUnique({
    where: { id: musicId },
    include: { user: { select: { name: true } } },
  });
}

export function getMusicsForRadio(take: number, skip: number) {
  return prisma.musics.findMany({
    take,
    skip,
    select: {
      audio: true,
    },
  });
}
