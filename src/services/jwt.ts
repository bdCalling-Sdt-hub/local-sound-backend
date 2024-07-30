import { sign, verify } from "jsonwebtoken";
import { TokenData } from "../types/token";

const secret = process.env.JWT_SECRET as string;
if (!secret) throw new Error("JWT_SECRET is not defined");

export function generateToken({
  id,
  name,
  email,
  image,
  type,
}: TokenData) {
  return sign({ id, name, email, image, type }, secret);
}

export function verifyToken(token: string) {
  try {
    return verify(token, secret) as TokenData;
  } catch (error) {
    console.error(error);
    return null;
  }
}
