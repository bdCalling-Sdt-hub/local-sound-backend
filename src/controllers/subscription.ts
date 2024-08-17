import type { Request, Response, NextFunction } from "express";
import {
  createSubscriptionValidation,
  deleteSubscriptionValidation,
  getSubscriptionByIdValidation,
  getSubscriptionsValidation,
  updateSubscriptionValidation,
} from "../validations/subscription";
import {
  countSubscription,
  createSubscription,
  deleteSubscription,
  getSubscriptionById,
  getSubscriptions,
  updateSubscription,
} from "../services/subscription";
import paginationBuilder from "../utils/paginationBuilder";
import responseBuilder from "../utils/responseBuilder";
import { getLastPaymentByUserId } from "../services/payment";

export async function createSubscriptionController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, duration, price, benefits } =
      createSubscriptionValidation(request);

    const subscription = await createSubscription({
      name,
      duration,
      price,
      benefits,
    });

    return response.json(
      responseBuilder(true, 201, "Subscription created", subscription)
    );
  } catch (error) {
    next(error);
  }
}

export async function getSubscriptionsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { limit, page } = getSubscriptionsValidation(request);

    const skip = (page - 1) * limit;
    const subscriptions = await getSubscriptions(limit, skip);

    const totalSubscriptions = await countSubscription();

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalSubscriptions,
    });

    if (page > pagination.totalPage) {
      return response.status(404).json(responseBuilder(false, 404, "Page not found"));
    }

    return response.json(
      responseBuilder(
        true,
        200,
        "Subscriptions retrieved",
        subscriptions,
        pagination
      )
    );
  } catch (error) {
    next(error);
  }
}

export async function updateSubscriptionController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, duration, price, benefits, subscriptionId } =
      updateSubscriptionValidation(request);

    const subscription = await updateSubscription(subscriptionId, {
      name,
      duration,
      price,
      benefits,
    });

    if (!subscription) {
      return response.status(404).json(
        responseBuilder(false, 404, "Subscription not found")
      );
    }

    return response.json(
      responseBuilder(true, 200, "Subscription updated", subscription)
    );
  } catch (error) {
    next(error);
  }
}

export async function deleteSubscriptionController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { subscriptionId } = deleteSubscriptionValidation(request);

    await deleteSubscription(subscriptionId);

    return response.json(responseBuilder(true, 200, "Subscription deleted"));
  } catch (error) {
    next(error);
  }
}

export async function getCurrentSubscriptionController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    const payment = await getLastPaymentByUserId(user.id);

    if (!payment) {
      return response.json(
        responseBuilder(false, 400, "No subscription found")
      );
    }

    if (payment.expireAt < new Date()) {
      return response.json(responseBuilder(false, 400, "Subscription expired"));
    }

    const subscription = await getSubscriptionById(payment.subscriptionId);

    if (!subscription) {
      return response.json(
        responseBuilder(false, 400, "Subscription not found")
      );
    }

    return response.json(
      responseBuilder(true, 200, "Subscription retrieved", subscription)
    );
  } catch (error) {
    next(error);
  }
}

export async function getSubscriptionByIdController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { subscriptionId } = getSubscriptionByIdValidation(request);
    const subscription = await getSubscriptionById(subscriptionId);

    if (!subscription || subscription.isDeleted === true) {
      return response.status(404).json(
        responseBuilder(false, 404, "Subscription not found")
      );
    }

    return response.json(
      responseBuilder(true, 200, "Subscription retrieved", {
        id: subscription.id,
        name: subscription.name,
        price: subscription.price,
        duration: subscription.duration,
        benefits: subscription.benefits,
      })
    );
  } catch (error) {
    next(error);
  }
}
