// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export function createWallet({ userId }: { userId: string }) {
//   return prisma.wallets.create({
//     data: {
//       userId,
//     },
//   });
// }

// export function getWalletByUserId({ userId }: { userId: string }) {
//   return prisma.wallets.findFirst({
//     where: {
//       userId,
//     },
//   });
// }

// export function updateWallet({
//   id,
//   changes,
// }: {
//   id: string;
//   changes: {
//     balance?: number;
//     accountNumber?: string;
//     accountType?: string;
//     bankName?: string;
//   };
// }) {
//   return prisma.wallets.update({
//     where: {
//       id,
//     },
//     data: changes,
//   });
// }
