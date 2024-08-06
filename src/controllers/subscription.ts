import type { Request, Response, NextFunction } from "express";
import {
  createSubscriptionValidation,
  deleteSubscriptionValidation,
  getSubscriptionsValidation,
  updateSubscriptionValidation,
} from "../validations/subscription";
import {
  countSubscription,
  createSubscription,
  deleteSubscription,
  getSubscriptions,
  updateSubscription,
} from "../services/subscription";
import paginationBuilder from "../utils/paginationBuilder";
import responseBuilder from "../utils/responseBuilder";

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

    return response.json(responseBuilder(true, 201, "Subscription created", subscription));
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
      return response.json(responseBuilder(false, 404, "Page not found"));
    }

    return response.json(responseBuilder(true, 200, "Subscriptions retrieved", subscriptions, pagination));
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
    const { name, duration, price, Benefits, subscriptionId } =
      updateSubscriptionValidation(request);

    const subscription = await updateSubscription(subscriptionId, {
      name,
      duration,
      price,
      Benefits,
    });

    if (!subscription) {
      return response.json(responseBuilder(false, 404, "Subscription not found"));
    }

    return response.json(responseBuilder(true, 200, "Subscription updated",subscription));
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
