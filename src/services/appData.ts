import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createAppData({
  about,
  privacy,
  terms,
}: {
  about: string;
  privacy: string;
  terms: string;
}) {
  return prisma.appData.create({
    data: {
      about,
      privacy,
      terms,
    },
  });
}

export function getAppData() {
  return prisma.appData.findFirst();
}

export function updateAppData(data: {
  about?: string;
  privacy?: string;
  terms?: string;
}) {
  return prisma.appData.updateMany({
    data,
  });
}
