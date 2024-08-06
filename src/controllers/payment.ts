import type { Request, Response, NextFunction } from "express";
import {
  createPaymentValidation,
  getPaymentsValidation,
} from "../validations/payment";
import { countPayments, createPayment, getPayments } from "../services/payment";
import { getSubscriptionById } from "../services/subscription";
import responseBuilder from "../utils/responseBuilder";
import { createNotification } from "../services/notification";
import { getAdmin } from "../services/user";
import chargeAmount from "../utils/chargeAmount";
import paginationBuilder from "../utils/paginationBuilder";

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

export async function getPaymentsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { limit, page } = getPaymentsValidation(request);

    const totalPayments = await countPayments();

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalPayments,
    });

    if (page > pagination.totalPage) {
      return response.json(responseBuilder(false, 404, "Page not found"));
    }

    const skip = (page - 1) * limit;
    const payments = await getPayments(limit, skip);

    return response.json(
      responseBuilder(true, 200, "Payments retrieved", payments, pagination)
    );
  } catch (error) {
    next(error);
  }
}
