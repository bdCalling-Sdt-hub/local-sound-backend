import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import {
  createPlayList,
  getPlayListsByUserId,
  countPlayLists,
} from "../services/playList";
import {
  createPlayListValidation,
  getPlayListsValidation,
} from "../validations/playList";
import paginationBuilder from "../utils/paginationBuilder";

export async function createPlayListController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    const { name } = createPlayListValidation(request);

    const playList = await createPlayList({ name, userId: user.id });

    return response.json(
      responseBuilder(true, 200, "PlayList created", playList)
    );
  } catch (error) {
    next(error);
  }
}

export async function getPlayListsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    const { limit, page } = getPlayListsValidation(request);

    const totalPlayLists = await countPlayLists(user.id);

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalPlayLists,
    });

    if (page > pagination.totalPage) {
      return response.json(responseBuilder(false, 404, "page not found"));
    }

    const skip = (page - 1) * limit;
    const playLists = await getPlayListsByUserId({
      userId: user.id,
      limit,
      skip,
    });

    return response.json(
      responseBuilder(true, 200, "PlayLists retrieved", playLists, pagination)
    );
  } catch (error) {
    next(error);
  }
}
