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

export function getUserById(id: string,takePassword=false) {
  return prisma.users.findUnique({
    where: {
      id,
    },
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
      password: takePassword,
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
