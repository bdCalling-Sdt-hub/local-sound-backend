// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export function createPlayListMusic({
//   playListId,
//   musicId,
// }: {
//   playListId: string;
//   musicId: string;
// }) {
//   return prisma.playListsMusics.create({
//     data: {
//       playListId,
//       musicId,
//     },
//   });
// }

// export function getMusicsByPlayListId({
//   playListId,
//   limit,
//   skip,
// }: {
//   playListId: string;
//   limit: number;
//   skip: number;
// }) {
//   return prisma.playListsMusics.findMany({
//     where: {
//       playListId,
//     },
//     take: limit,
//     skip,
//   });
// }

