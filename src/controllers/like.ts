import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import { createLikeValidation, getLikesValidation } from "../validations/like";
import { countLikes, createLike, getLikesByUserId } from "../services/like";
import paginationBuilder from "../utils/paginationBuilder";

export async function createLikeController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    const { musicId } = createLikeValidation(request);

    const like = await createLike({
      musicId,
      userId: user.id,
    });

    return response.json(responseBuilder(true, 200, "Like created", like));
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function getLikesController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    const { limit, page } = getLikesValidation(request);

    const skip = (page - 1) * limit;
    const likes = await getLikesByUserId({ userId: user.id, limit, skip });

    const totalLikes = await countLikes(user.id);

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalLikes,
    });

    return response.json(
      responseBuilder(true, 200, "Likes retrieved", likes, pagination)
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
}
