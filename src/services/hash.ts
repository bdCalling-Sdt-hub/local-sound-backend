import { genSaltSync, hash, compare } from "bcryptjs";

const salt = genSaltSync(10);

export async function hashPassword(password: string) {
  return await hash(password, salt);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  return await compare(password, hashedPassword);
}

// const hashedPassword = await hash(password, salt);

// const passwordMatch = await compare(password, user.password);
