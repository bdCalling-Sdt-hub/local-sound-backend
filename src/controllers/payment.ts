import type { Request, Response, NextFunction } from "express";
import { createPaymentValidation } from "../validations/payment";
import { createPayment } from "../services/payment";
import { getSubscriptionById } from "../services/subscription";
import responseBuilder from "../utils/responseBuilder";
import { createNotification } from "../services/notification";
import { getAdmin } from "../services/user";
import chargeAmount from "../utils/chargeAmount";

export async function createPaymentController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { stripeToken, subscriptionId } = createPaymentValidation(request);
    const user = request.user;

    const subscription = await getSubscriptionById(subscriptionId);

    if (!subscription) {
      return response.json({
        success: false,
        status: 404,
        message: "Subscription not found",
      });
    }

    const charge = await chargeAmount({
      stripeToken,
      amount: subscription.price,
      description: `Payment for ${subscription.name} subscription`,
      email: user.email,
    });

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

    sendNotifications({
      subscriptionName: subscription.name,
      userId: user.id,
      userName: user.name,
    });

    return response.json(responseBuilder(true, 200, "Payment successful"));
  } catch (error) {
    next(error);
  }
}

async function sendNotifications({
  subscriptionName,
  userId,
  userName,
}: {
  subscriptionName: string;
  userId: string;
  userName: string;
}) {
  await createNotification({
    userId: userId,
    message: `You have successfully subscribed to ${subscriptionName} subscription`,
  });

  const admin = await getAdmin();

  if (admin) {
    await createNotification({
      userId: admin.id,
      message: `${userName} has successfully subscribed to ${subscriptionName} subscription`,
    });
  }
}
