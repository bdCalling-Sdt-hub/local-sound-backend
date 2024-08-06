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
  getPurchasedMusicByUserIdAndMusicId,
  getPurchasedMusicsByUserId,
} from "../services/purchasedMusic";
import paginationBuilder from "../utils/paginationBuilder";

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
      return response.json(responseBuilder(false, 404, "Music not found"));
    }

    if (sellerId) {
      if (sellerId === user.id) {
        return response.json(
          responseBuilder(false, 400, "You can't buy your own music")
        );
      }

      const purchasedMusic = await getPurchasedMusicByUserIdAndMusicId({
        musicId,
        userId: sellerId,
      });

      if (!purchasedMusic) {
        return response.json(
          responseBuilder(false, 400, "Seller has not purchased this music")
        );
      }

      if (purchasedMusic.quantity < quantity) {
        return response.json(
          responseBuilder(false, 400, "Seller has not enough quantity")
        );
      }
    }

    const charge = await chargeAmount({
      stripeToken,
      amount: music.price * quantity,
      description: `Payment for ${music.name} music`,
      email: user.email,
    });

    await createTransaction({
      amount: music.price * quantity,
      musicId,
      quantity,
      stripeTransactionId: charge.id,
      buyerId: user.id,
      sellerId: sellerId || music.userId,
      resell: !!sellerId,
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
    const purchasedMusics = await getPurchasedMusicsByUserId({
      userId: user.id,
      limit,
      skip,
    });

    const totalMusic = await countPurchasedMusics(user.id);

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalMusic,
    });

    return response.json(
      responseBuilder(true, 200, "Purchased music", purchasedMusics, pagination)
    );
  } catch (error) {
    next(error);
  }
}
