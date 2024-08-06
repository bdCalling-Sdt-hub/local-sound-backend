import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import { createReSellValidation } from "../validations/reSell";
import { getPurchasedMusicByUserIdAndMusicId } from "../services/purchasedMusic";
import { createReSell } from "../services/reSell";

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
