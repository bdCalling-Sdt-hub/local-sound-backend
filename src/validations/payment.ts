import type { Request } from "express";
import { isValidObjectId } from "../utils/validators";

export function createPaymentValidation(request: Request) {
  const body = request.body;

  if (!body.stripeToken) {
    throw new Error("stripeToken is required");
  }

  if (typeof body.stripeToken !== "string") {
    throw new Error("stripeToken should be a string");
  }

  if (!body.subscriptionId) {
    throw new Error("subscriptionId is required");
  }

  if (typeof body.subscriptionId !== "string") {
    throw new Error("subscriptionId should be a string");
  }

  if (!isValidObjectId(body.subscriptionId)) {
    throw new Error("subscriptionId is invalid");
  }

  return {
    stripeToken: body.stripeToken,
    subscriptionId: body.subscriptionId,
  };
}
