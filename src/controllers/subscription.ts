import type { Request, Response, NextFunction } from "express";
import { createSubscriptionValidation } from "../validations/subscription";
import { createSubscription } from "../services/subscription";

export async function createSubscriptionController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, duration, price, Benefits } =
      createSubscriptionValidation(request);

    const subscription = await createSubscription({
      name,
      duration,
      price,
      Benefits,
    });

    return response.json({
      success: true,
      status: 200,
      message: "Subscription created successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
}
