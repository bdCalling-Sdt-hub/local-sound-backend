import type { Request } from "express";
import error from "../utils/error";
import { isValidObjectId } from "../utils/validators";

export function createReSellValidation(request: Request): {
  musicId: string;
  price: number;
  quantity: number;
} {
  const body = request.body;

  if (!body.musicId || typeof body.musicId !== "string") {
    throw error("Music id is required and must be a string", 400);
  }

  if (!isValidObjectId(body.musicId)) {
    throw error("Music id is invalid", 400);
  }

  if (!body.price || typeof body.price !== "number") {
    throw error("Price is required and must be a number", 400);
  }

  if (!Number.isInteger(body.price)) {
    throw error("Price must be an integer", 400);
  }

  if (body.price < 1) {
    throw error("Price must be greater than 0", 400);
  }

  if (!body.quantity || typeof body.quantity !== "number") {
    throw error("Quantity is required and must be a number", 400);
  }

  if (!Number.isInteger(body.quantity)) {
    throw error("Quantity must be an integer", 400);
  }

  if (body.quantity < 1) {
    throw error("Quantity must be greater than 0", 400);
  }

  return {
    musicId: body.musicId,
    price: body.price,
    quantity: body.quantity,
  };
}

export function getResellsValidation(request: Request): {
  limit: number;
  page: number;
} {
  const query = request.query;

  let page = parseInt(query.page as string) || 1;

  if (page < 1) page = 1;

  let limit = parseInt(query.limit as string) || 10;

  if (limit > 100) limit = 100;

  if (limit < 1) limit = 1;

  return { limit, page };
}

export function updateResellPriceValidation(request: Request): {
  id: string;
  price: number;
} {
  const body = request.body;
  const resellId = request.params?.id;

  if (!resellId) {
    throw error("Resell ID is required", 400);
  }

  if (!isValidObjectId(resellId)) {
    throw error("Resell ID is invalid", 400);
  }

  if (!body.price || typeof body.price !== "number") {
    throw error("Price is required and must be a number", 400);
  }

  if (!Number.isInteger(body.price)) {
    throw error("Price must be an integer", 400);
  }

  if (body.price < 1) {
    throw error("Price must be greater than 0", 400);
  }

  return {
    id: resellId,
    price: body.price,
  };
}
