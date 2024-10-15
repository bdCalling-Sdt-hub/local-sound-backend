import { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import paginationBuilder from "../utils/paginationBuilder";
import {
  countRadioMusic,
  createRadioMusic,
  deleteRadioMusic,
  getRadioMusics,
} from "../services/radioMusic";
import {
  createRadioMusicValidation,
  deleteRadioMusicValidation,
  getRadioMusicsValidation,
} from "../validations/radioMusic";

export async function createRadioMusicController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { musicId } = createRadioMusicValidation(request);
    await createRadioMusic(musicId);
    return response.json(responseBuilder(true, 200, "Radio music created"));
  } catch (error) {
    next(error);
  }
}

export async function getRadioMusicsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { page, limit } = getRadioMusicsValidation(request);
    const totalRadioMusics = await countRadioMusic();

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalRadioMusics,
    });

    if (page > pagination.totalPage) {
      return response
        .status(404)
        .json(responseBuilder(false, 404, "Page not found"));
    }

    const skip = (page - 1) * limit;
    const radioMusics = await getRadioMusics({ limit, skip });
    return response.json(
      responseBuilder(
        true,
        200,
        "Radio musics retrieved",
        radioMusics,
        pagination
      )
    );
  } catch (error) {
    next(error);
  }
}

export async function deleteRadioMusicController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { musicId } = deleteRadioMusicValidation(request);
    await deleteRadioMusic(musicId);
    return response.json(responseBuilder(true, 200, "Radio music deleted"));
  } catch (error) {
    next(error);
  }
}
