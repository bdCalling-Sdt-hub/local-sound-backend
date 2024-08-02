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

export function getAds(limit: number, skip: number) {
  return prisma.ads.findMany({
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
    },
  });
}

export function countAds() {
  return prisma.ads.count();
}
