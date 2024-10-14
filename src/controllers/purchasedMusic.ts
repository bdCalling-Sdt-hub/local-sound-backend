import { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import {
  createPurchasedMusicValidation,
  getPurchasedMusicsValidation,
} from "../validations/purchasedMusic";
import { getMusicById } from "../services/music";
import chargeAmount from "../utils/chargeAmount";
import { createTransaction } from "../services/transaction";
import {
  countPurchasedMusics,
  createPurchasedMusic,
  getPurchasedMusicByUserIdAndMusicId,
  getPurchasedMusicsByUserId,
} from "../services/purchasedMusic";
import paginationBuilder from "../utils/paginationBuilder";
import { updateBalance } from "../services/user";
import { updateReSellMusicQuantity } from "../services/reSell";

export async function createPurchasedMusicController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;
    const { musicId, quantity, stripeToken, sellerId } =
      createPurchasedMusicValidation(request);

    const music = await getMusicById(musicId);

    if (!music) {
      return response
        .status(404)
        .json(responseBuilder(false, 404, "Music not found"));
    }

    if (sellerId) {
      if (sellerId === user.id) {
        return response
          .status(400)
          .json(responseBuilder(false, 400, "You can't buy your own music"));
      }

      const purchasedMusic = await getPurchasedMusicByUserIdAndMusicId({
        musicId,
        userId: sellerId,
      });

      if (!purchasedMusic) {
        return response
          .status(400)
          .json(
            responseBuilder(false, 400, "Seller has not purchased this music")
          );
      }

      if (purchasedMusic.quantity < quantity) {
        return response
          .status(400)
          .json(responseBuilder(false, 400, "Seller has not enough quantity"));
      }
    }

    const charge = await chargeAmount({
      stripeToken,
      amount: music.price * quantity,
      description: `Payment for ${music.name} music`,
      email: user.email,
    });

    await createPurchasedMusic({
      userId: user.id,
      musicId,
      quantity,
    });

    await updateBalance({
      userId: sellerId || music.userId,
      amount: music.price * quantity,
    });

    if (sellerId)
      await updateReSellMusicQuantity(sellerId, { musicId, quantity });

    await createTransaction({
      amount: music.price * quantity,
      musicId,
      quantity,
      stripeTransactionId: charge.id,
      buyerId: user.id,
      sellerId: sellerId || music.userId,
    });

    return response.json(
      responseBuilder(true, 200, "Music purchased successfully")
    );
  } catch (error) {
    next(error);
  }
}

export async function getPurchasedMusicsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;
    const { limit, page } = getPurchasedMusicsValidation(request);

    const skip = (page - 1) * limit;

    const totalMusic = await countPurchasedMusics(user.id);

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalMusic,
    });

    if (page > pagination.totalPage) {
      return response
        .status(404)
        .json(responseBuilder(false, 404, "Page not found"));
    }

    const purchasedMusics = await getPurchasedMusicsByUserId({
      userId: user.id,
      limit,
      skip,
    });

    return response.json(
      responseBuilder(true, 200, "Purchased music", purchasedMusics, pagination)
    );
  } catch (error) {
    next(error);
  }
}
