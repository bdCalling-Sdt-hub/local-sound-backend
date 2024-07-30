import type { Request } from "express";
import error from "../utils/error";

export function createSubscriptionValidation(request: Request): {
  name: string;
  duration: number;
  price: number;
  Benefits: string[];
} {
  const body = request.body;

  if (!body.name) throw error("Name is required", 400);

  if (!body.duration) throw error("Duration is required", 400);

  if (!body.price) throw error("Price is required", 400);

  if (!body.Benefits) throw error("Benefits is required", 400);

  if (!Array.isArray(body.Benefits))
    throw error("Benefits should be an array", 400);

  if (body.Benefits.length === 0)
    throw error("At least one benefit is required", 400);

  body.Benefits.forEach((benefit: string) => {
    if (typeof benefit !== "string")
      throw error("Benefits should be an array of strings", 400);
  });

  if (typeof body.name !== "string")
    throw error("Name should be a string", 400);

  if (typeof body.duration !== "number")
    throw error("Duration should be a number", 400);

  if (body.name.trim().length === 0)
    throw error("Name should not be empty", 400);

  if (!Number.isFinite(body.price) || body.price <= 0) {
    throw error("Price should be a positive number", 400);
  }

  if (!Number.isInteger(body.price * 100)) {
    throw error("Price should have two decimal places", 400);
  }

  if (body.duration <= 0) throw error("Duration should be greater than 0", 400);

  if (body.price <= 0) throw error("Price should be greater than 0", 400);

  return {
    name: body.name,
    duration: body.duration,
    price: Number(body.price.toFixed(2)),
    Benefits: body.Benefits,
  };
}
