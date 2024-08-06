import type { Request } from "express";
import error from "../utils/error";
import { isValidObjectId } from "../utils/validators";

export function createPurchasedMusicValidation(request: Request): {
  musicId: string;
  quantity: number;
  stripeToken: string;
  sellerId?: string;
} {
  const body = request.body;

  if (!body.musicId || typeof body.musicId !== "string") {
    throw error("Music id is required and must be a string", 400);
  }

  if (!isValidObjectId(body.musicId)) {
    throw error("Music id is invalid", 400);
  }

  if (!body.quantity || typeof body.quantity !== "number") {
    throw error("Quantity is required and must be a string", 400);
  }

  if (body.quantity < 1) {
    throw error("Quantity must be greater than 0", 400);
  }

  if (!Number.isInteger(body.quantity)) {
    throw error("Quantity must be an integer", 400);
  }

  if (!body.stripeToken || typeof body.stripeToken !== "string") {
    throw error("Stripe token is required and must be a string", 400);
  }

  if (
    body.sellerId &&
    (typeof body.sellerId !== "string" || !isValidObjectId(body.sellerId))
  ) {
    throw error("Seller id is invalid", 400);
  }

  return {
    musicId: body.musicId,
    quantity: body.quantity,
    stripeToken: body.stripeToken,
    sellerId: body.sellerId,
  };
}

export function getPurchasedMusicsValidation(request: Request): {
  page: number;
  limit: number;
} {
  const query = request.query;

  let page = parseInt(query.page as string) || 1;

  if (page < 1) page = 1;

  let limit = parseInt(query.limit as string) || 10;

  if (limit > 100) limit = 100;

  if (limit < 1) limit = 1;

  return {
    page,
    limit,
  };
}
