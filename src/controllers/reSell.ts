import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import {
  createReSellValidation,
  getResellsValidation,
  updateResellPriceValidation,
} from "../validations/reSell";
import { getPurchasedMusicByUserIdAndMusicId } from "../services/purchasedMusic";
import {
  countResells,
  createReSell,
  getResells,
  updateReSells,
} from "../services/reSell";
import paginationBuilder from "../utils/paginationBuilder";
import { createNotification } from "../services/notification";

export async function createReSellController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;
    const { musicId, price, quantity } = createReSellValidation(request);

    const purchasedMusic = await getPurchasedMusicByUserIdAndMusicId({
      musicId,
      userId: user.id,
    });

    if (!purchasedMusic) {
      return response.json(responseBuilder(false, 400, "Music not found"));
    }

    if (purchasedMusic.quantity < quantity) {
      return response.json(
        responseBuilder(false, 400, "You don't have enough quantity")
      );
    }

    await createReSell({
      musicId,
      price,
      quantity,
      userId: user.id,
    });

    return response.json(
      responseBuilder(true, 200, "Music is listed for sale")
    );
  } catch (error) {
    next(error);
  }
}

export async function getResellsMusicController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { limit, page } = getResellsValidation(request);

    const totalResells = await countResells();

    const pagination = paginationBuilder({
      totalData: totalResells,
      limit,
      currentPage: page,
    });

    if (page > pagination.totalPage) {
      return response.json(responseBuilder(false, 400, "Page not found"));
    }

    const skip = (page - 1) * limit;

    const resells = await getResells({ limit, skip });

    return response.json(
      responseBuilder(true, 200, "Resells fetched successfully", resells)
    );
  } catch (error) {
    next(error);
  }
}

export async function updateResellPriceController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { id, price } = updateResellPriceValidation(request);

    const resell = await updateReSells({
      id,
      changes: {
        price,
      },
    });

    createNotification({
      userId: resell.userId,
      message: `Your music ${resell.music.name} price has been updated to ${price} by Admin`,
    });

    return response.json(responseBuilder(true, 200, "updated successfully"));
  } catch (error) {
    next(error);
  }
}
