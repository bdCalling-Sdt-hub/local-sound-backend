import type { Request } from "express";
import error from "../utils/error";
import { isValidObjectId } from "../utils/validators";

export function createSubscriptionValidation(request: Request): {
  name: string;
  duration: number;
  price: number;
  benefits: string[];
} {
  const body = request.body;

  if (!body.name) throw error("Name is required", 400);

  if (!body.duration) throw error("Duration is required", 400);

  if (!body.price) throw error("Price is required", 400);

  if (!body.benefits) throw error("Benefits is required", 400);

  if (!Array.isArray(body.benefits))
    throw error("Benefits should be an array", 400);

  if (body.benefits.length === 0)
    throw error("At least one benefit is required", 400);

  body.benefits.forEach((benefit: string) => {
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
    benefits: body.benefits,
  };
}

export function getSubscriptionsValidation(request: Request) {
  const query = request.query;

  let page = parseInt(query.page as string) || 1;

  if (page < 1) page = 1;

  let limit = parseInt(query.limit as string) || 10;

  if (limit > 100) limit = 100;

  if (limit < 1) limit = 1;

  return {
    limit,
    page,
  };
}

export function updateSubscriptionValidation(request: Request): {
  name?: string;
  duration?: number;
  price?: number;
  benefits?: string[];
  subscriptionId: string;
} {
  const body = request.body;
  const params = request.params;

  if (!params.id || typeof params.id !== "string") {
    throw error("Subscription id is required and must be a string", 400);
  }

  if (!isValidObjectId(params.id)) {
    throw error("Subscription id is invalid", 400);
  }

  if (body.name && typeof body.name !== "string") {
    throw error("Name should be a string", 400);
  }

  if (body.duration && typeof body.duration !== "number") {
    throw error("Duration should be a number", 400);
  }

  if (body.price && !Number.isFinite(body.price)) {
    throw error("Price should be a number", 400);
  }

  if (body.benefits && !Array.isArray(body.benefits)) {
    throw error("Benefits should be an array", 400);
  }

  if (body.benefits && body.benefits.length === 0) {
    throw error("At least one benefit is required", 400);
  }

  if (body.benefits) {
    body.benefits.forEach((benefit: string) => {
      if (typeof benefit !== "string") {
        throw error("Benefits should be an array of strings", 400);
      }
    });
  }

  if (body.name && body.name.trim().length === 0) {
    throw error("Name should not be empty", 400);
  }
  if (!Number.isInteger(body.price * 100)) {
    throw error("Price should have two decimal places", 400);
  }

  if (body.price && body.price <= 0) {
    throw error("Price should be a positive number", 400);
  }

  if (body.duration && body.duration <= 0) {
    throw error("Duration should be greater than 0", 400);
  }

  return {
    name: body.name,
    duration: body.duration,
    price: body.price,
    benefits: body.benefits,
    subscriptionId: params.id,
  };
}

export function deleteSubscriptionValidation(request: Request) {
  const params = request.params;

  if (!params.id || typeof params.id !== "string") {
    throw error("Subscription id is required and must be a string", 400);
  }

  if (!isValidObjectId(params.id)) {
    throw error("Subscription id is invalid", 400);
  }

  return {
    subscriptionId: params.id,
  };
}

export function getSubscriptionByIdValidation(request: Request): {
  subscriptionId: string;
} {
  const params = request.params;

  if (!params.id || typeof params.id !== "string") {
    throw error("Subscription id is required and must be a string", 400);
  }

  if (!isValidObjectId(params.id)) {
    throw error("Subscription id is invalid", 400);
  }

  return {
    subscriptionId: params.id,
  };
}
