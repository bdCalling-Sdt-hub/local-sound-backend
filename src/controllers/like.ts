import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import {
  createLikeValidation,
  deleteLikeValidation,
  getLikesValidation,
} from "../validations/like";
import {
  countLikes,
  createLike,
  getLikesByUserId,
  deleteLike,
  getLikeById,
} from "../services/like";
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

    const totalLikes = await countLikes(user.id);

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalLikes,
    });

    if(page > pagination.totalPage) {
      return response.json(
        responseBuilder(false, 404, "page not found")
      );
    }

    const skip = (page - 1) * limit;
    const likes = await getLikesByUserId({ userId: user.id, limit, skip });

    return response.json(
      responseBuilder(true, 200, "Likes retrieved", likes, pagination)
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function deleteLikeController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    const { id } = deleteLikeValidation(request);

    const like = await getLikeById(id);

    if (!like) {
      return response.status(404).json(responseBuilder(false, 404, "Like not found"));
    }

    if (like.userId !== user.id) {
      return response.json(
        responseBuilder(false, 403, "You are not allowed to delete this like")
      );
    }

    await deleteLike(like.id);

    return response.json(responseBuilder(true, 200, "Like deleted"));
  } catch (error) {
    console.error(error);
    next(error);
  }
}
