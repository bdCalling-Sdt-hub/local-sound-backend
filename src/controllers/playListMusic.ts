import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import {
  createPlayListMusicValidation,
  deletePlayListMusicValidation,
  getPlayListMusicsValidation,
} from "../validations/playListMusic";
import {
  countPlayListMusic,
  createPlayListMusic,
  deletePlayListMusic,
  getPlayListMusicByPlayListIdAndMusicId,
  getPlayListMusicsByPlayListId,
} from "../services/playListMusic";
import { getPurchasedMusicByUserIdAndMusicId } from "../services/purchasedMusic";
import { getPlayListById } from "../services/playList";
import paginationBuilder from "../utils/paginationBuilder";

export async function createPlayListMusicController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;
    const { musicId, playListId } = createPlayListMusicValidation(request);

    const playListMusic = await getPlayListMusicByPlayListIdAndMusicId({
      musicId,
      playListId,
    });

    if (playListMusic) {
      return response.json(
        responseBuilder(false, 400, "PlayListMusic already exists")
      );
    }

    const PurchasedMusic = await getPurchasedMusicByUserIdAndMusicId({
      userId: user.id,
      musicId,
    });

    if (!PurchasedMusic) {
      return response.status(400).json(
        responseBuilder(false, 400, "Music is not purchased by user")
      );
    }

    await createPlayListMusic({ musicId, playListId });

    return response.json(responseBuilder(true, 200, "PlayListMusic created"));
  } catch (error) {
    next(error);
  }
}

export async function getPlayListMusicsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;
    const { limit, page, playListId } = getPlayListMusicsValidation(request);

    const playList = await getPlayListById(playListId);

    if (!playList) {
      return response.status(404).json(responseBuilder(false, 404, "PlayList not found"));
    }

    if (playList.userId !== user.id) {
      return response.status(403).json(responseBuilder(false, 403, "Forbidden"));
    }

    const totalPlayListMusics = await countPlayListMusic(playListId);

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalPlayListMusics,
    });

    if (page > pagination.totalPage) {
      return response.status(404).json(responseBuilder(false, 404, "page not found"));
    }

    const skip = (page - 1) * limit;
    const playListMusics = await getPlayListMusicsByPlayListId({
      playListId,
      limit,
      skip,
    });

    return response.json(
      responseBuilder(true, 200, "PlayListMusics found", playListMusics)
    );
  } catch (error) {
    next(error);
  }
}

export async function deletePlayListMusicController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;
    const { musicId, playListId } = deletePlayListMusicValidation(request);

    const playList = await getPlayListById(playListId);

    if (!playList) {
      return response.status(404).json(responseBuilder(false, 404, "PlayList not found"));
    }

    if (playList.userId !== user.id) {
      return response.status(403).json(responseBuilder(false, 403, "Forbidden"));
    }

    const playListMusic = await getPlayListMusicByPlayListIdAndMusicId({
      musicId,
      playListId,
    });

    if (!playListMusic) {
      return response.json(
        responseBuilder(false, 404, "PlayListMusic not found")
      );
    }

    await deletePlayListMusic({ musicId, playListId });

    return response.json(
      responseBuilder(true, 200, "PlayListMusic deleted successfully")
    );
  } catch (error) {
    next(error);
  }
}
