import error from "./error";

export function validatePassword(password: string) {
  if (password.length < 6)
    throw error("Password must be at least 6 characters", 400);

  if (password.length > 20)
    throw error("Password must be at most 20 characters", 400);
}

export function validateEmail(email: string) {
  if (!email.includes("@") || !email.includes("."))
    throw error("Invalid email", 400);
}

export function isValidObjectId(id: string): boolean {
    const objectIdPattern = /^[a-fA-F0-9]{24}$/;
    return objectIdPattern.test(id);
  }