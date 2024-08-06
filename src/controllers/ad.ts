import { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import { countAds, createAd, getAds } from "../services/ad";
import type { User } from "../types/user";
import { createAdValidation, getAdsValidation } from "../validations/ad";
import paginationBuilder from "../utils/paginationBuilder";
import { getLastPaymentByUserId } from "../services/payment";

export async function createAdController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user as User;

    const { date, description, image, time, title, venue } =
      createAdValidation(request);

    const payment = await getLastPaymentByUserId(user.id);

    if (!payment)
      return response.json(
        responseBuilder(false, 400, "No subscription found")
      );

    if (payment.expireAt < new Date())
      return response.json(responseBuilder(false, 400, "Subscription expired"));

    const ad = await createAd({
      date,
      description,
      image,
      time,
      title,
      venue,
      userId: user.id,
    });

    return response.json(responseBuilder(true, 200, "Ad created", ad));
  } catch (error) {
    next(error);
  }
}

export async function getAdsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { limit, page } = getAdsValidation(request);

    const totalAd = await countAds();

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalAd,
    });

    if(page > pagination.totalPage) {
      return response.json(
        responseBuilder(false, 400, "Page not found")
      );
    }

    const skip = (page - 1) * limit;

    const ads = await getAds(limit, skip);

    return response.json(
      responseBuilder(true, 200, "Ads retrieved", ads, pagination)
    );
  } catch (error) {
    next(error);
  }
}
