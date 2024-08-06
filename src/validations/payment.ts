import type { Request } from "express";
import { isValidObjectId } from "../utils/validators";
import error from "../utils/error";

export function createPaymentValidation(request: Request): {
  stripeToken: string;
  subscriptionId: string;
} {
  const body = request.body;

  if (!body.stripeToken) {
    throw error("stripeToken is required", 400);
  }

  if (typeof body.stripeToken !== "string") {
    throw error("stripeToken should be a string", 400);
  }

  if (!body.subscriptionId) {
    throw error("subscriptionId is required", 400);
  }

  if (typeof body.subscriptionId !== "string") {
    throw error("subscriptionId should be a string", 400);
  }

  if (!isValidObjectId(body.subscriptionId)) {
    throw error("subscriptionId is invalid", 400);
  }

  return {
    stripeToken: body.stripeToken,
    subscriptionId: body.subscriptionId,
  };
}
