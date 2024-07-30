import { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import { countAds, createAd, getAds } from "../services/ad";
import type { User } from "../types/user";
import type { TokenData } from "../types/token";
import { getLastOtpByUserId } from "../services/otp";
import { createAdValidation, getAdsValidation } from "../validations/ad";
import paginationBuilder from "../utils/paginationBuilder";

export async function createAdController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { user } = request.body as {
      user: User;
      tokenData: TokenData;
    };

    const { date, description, image, time, title, venue } =
      createAdValidation(request);

    const payment = await getLastOtpByUserId(user.id);

    if (!payment)
      return response.json(
        responseBuilder(false, 400, "No subscription found")
      );

    if (payment.expiredAt < new Date())
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
    console.error(error);
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

    const skip = (page - 1) * limit;

    const ads = await getAds(limit, skip);

    return response.json(
      responseBuilder(true, 200, "Ads retrieved", ads, pagination)
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
}
