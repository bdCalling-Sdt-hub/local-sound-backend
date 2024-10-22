import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createAd({
  title,
  description,
  userId,
  date,
  image,
  time,
  venue,
}: {
  title: string;
  description: string;
  userId: string;
  date: string;
  image: string;
  time: string;
  venue: string;
}) {
  return prisma.ads.create({
    data: {
      title,
      description,
      userId,
      date,
      image,
      time,
      venue,
    },
  });
}

export function getAds({
  limit,
  skip,
  userId,
  date,
}: {
  limit: number;
  skip: number;
  userId?: string;
  date?: string;
}) {
  return prisma.ads.findMany({
    take: limit,
    skip,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      userId,
      date,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
}

export function countAds({ userId, date }: { userId?: string; date?: string }) {
  return prisma.ads.count({ where: { userId, date } });
}
