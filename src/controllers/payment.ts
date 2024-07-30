import type { Request, Response, NextFunction } from "express";
import { createPaymentValidation } from "../validations/payment";
import { createPayment } from "../services/payments";
import { getSubscriptionById } from "../services/subscription";
import Stripe from "stripe";
import responseBuilder from "../utils/responseBuilder";

const stripe_secret_key = process.env.STRIPE_SECRET_KEY;

if (!stripe_secret_key) {
  throw new Error("Stripe secret key is not provided");
}

const stripe = new Stripe(stripe_secret_key);

export async function createPaymentController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { stripeToken, subscriptionId } = createPaymentValidation(request);
    const user = request.body.user;

    const subscription = await getSubscriptionById(subscriptionId);

    if (!subscription) {
      return response.json({
        success: false,
        status: 404,
        message: "Subscription not found",
      });
    }

    const customer = await stripe.customers.create({
      source: stripeToken,
      email: user.email,
    });

    const charge = await stripe.charges.create({
      amount: subscription.price * 100,
      currency: "usd",
      customer: customer.id,
      description: `Payment for ${subscription.name} subscription`,
    });

    if (charge.status !== "succeeded") {
      return response.json({
        success: false,
        status: 400,
        message: "Payment failed",
      });
    }

    const expireAt = new Date(
      Date.now() + subscription.duration * 30 * 24 * 60 * 60 * 1000
    );

    await createPayment({
      userId: user.id,
      subscriptionId,
      amount: subscription.price,
      transactionId: charge.id,
      expireAt,
    });

    return response.json(responseBuilder(true, 200, "Payment successful"));
  } catch (error) {
    console.error(error);
    next(error);
  }
}
