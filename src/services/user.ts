import { PrismaClient } from "@prisma/client";
import { UpdateUser } from "../types/user";

const prisma = new PrismaClient();

export function createUser({
  name,
  email,
  password,
  type,
}: {
  name: string;
  email: string;
  password: string;
  type: "USER" | "ARTIST";
}) {
  return prisma.users.create({
    data: {
      name,
      email,
      password,
      type,
    },
    select: {
      id: true,
    },
  });
}

export function getUserByEmail(email: string) {
  return prisma.users.findUnique({
    where: {
      email,
    },
  });
}

export function getUserById(id: string) {
  return prisma.users.findUnique({
    where: {
      id,
    },
  });
}

export function updateUserById(id: string, data: UpdateUser) {
  return prisma.users.update({
    where: {
      id,
    },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      type: true,
      dateOfBirth: true,
      address: true,
      number: true,
      image: true,
      isVerified: true,
    },
  });
}

export function getAdmin() {
  return prisma.users.findFirst({
    where: {
      type: "ADMIN",
    },
  });
}

export function getUsers({
  limit,
  skip,
  type,
  name,
}: {
  limit: number;
  skip: number;
  type?: "USER" | "ARTIST";
  name?: string;
}) {
  return prisma.users.findMany({
    where: {
      type,
      name: {
        contains: name,
      },
    },
    take: limit,
    skip,
    select: {
      id: true,
      name: true,
      email: true,
      dateOfBirth: true,
      address: true,
      number: true,
      image: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function countUsers(type?: "USER" | "ARTIST") {
  return prisma.users.count({
    where: {
      type,
    },
  });
}

export function updateBalance(id: string, amount: number) {
  return prisma.users.update({
    where: {
      id,
    },
    data: {
      balance: {
        increment: amount,
      },
    },
  });
}

export function decrementBalance(id: string, amount: number) {
  return prisma.users.update({
    where: {
      id,
    },
    data: {
      balance: {
        decrement: amount,
      },
    },
  });
}

export function createAdmin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  return prisma.users.create({
    data: {
      name: "Admin",
      email,
      password,
      type: "ADMIN",
    },
  });
}
