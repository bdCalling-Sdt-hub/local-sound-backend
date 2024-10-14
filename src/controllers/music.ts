import type { Request, Response, NextFunction } from "express";
import {
  createMusicValidation,
  getMusicsValidation,
  getSingleMusicValidation,
  updateMusicValidation,
} from "../validations/music";
import {
  countMusic,
  createMusic,
  getMusicById,
  getMusics,
  updateMusic,
} from "../services/music";
import responseBuilder from "../utils/responseBuilder";
import paginationBuilder from "../utils/paginationBuilder";
import { getLastPaymentByUserId } from "../services/payment";

import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";
import path from "path";

ffmpeg.setFfmpegPath(ffmpegStatic!);
ffmpeg.setFfprobePath(ffprobeStatic.path);

export async function createMusicController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { audio, image, name, price } = createMusicValidation(request);
    const user = request.user;

    const payment = await getLastPaymentByUserId(user.id);

    if (!payment)
      return response.status(400).json(
        responseBuilder(false, 400, "No subscription found")
      );

    if (payment.expireAt < new Date())
      return response
        .status(400)
        .json(responseBuilder(false, 400, "Subscription expired"));

    const audioFilePath = path.resolve("public", audio);

    ffmpeg.ffprobe(audioFilePath, async (err, metadata) => {
      if (err || !metadata.format.duration) throw err;

      const duration = metadata.format.duration;
      if (!duration)
        return response
          .status(400)
          .json(responseBuilder(false, 400, "Failed to get audio duration"));

      const music = await createMusic({
        audio,
        image,
        name,
        price,
        duration,
        userId: user.id,
      });

      response.json(responseBuilder(true, 200, "Music created", music));
    });
  } catch (error) {
    next(error);
  }
}

export async function getMusicsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { limit, name, page, price, userId } = getMusicsValidation(request);

    const totalMusics = await countMusic({ name, userId });

    const pagination = paginationBuilder({
      totalData: totalMusics,
      currentPage: page,
      limit,
    });

    if (page > pagination.totalPage) {
      return response
        .status(404)
        .json(responseBuilder(false, 404, "Page not found"));
    }

    const skip = (page - 1) * limit;
    const musics = await getMusics({
      limit,
      price,
      skip,
      name,
      userId,
    });

    response.json(responseBuilder(true, 200, "Musics", musics, pagination));
  } catch (error) {
    next(error);
  }
}

export async function updateMusicController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { changes, musicId } = updateMusicValidation(request);
    const user = request.user;

    if (Object.keys(changes).length === 0) {
      return response
        .status(400)
        .json(responseBuilder(false, 400, "Nothing to update"));
    }

    const music = await getMusicById(musicId);

    if (music?.userId !== user.id) {
      return response.status(403).json(
        responseBuilder(false, 403, "You are not allowed to update this music")
      );
    }

    const payment = await getLastPaymentByUserId(user.id);

    if (!payment)
      return response.status(400).json(
        responseBuilder(false, 400, "No subscription found")
      );

    if (payment.expireAt < new Date())
      return response
        .status(400)
        .json(responseBuilder(false, 400, "Subscription expired"));

    const newMusic = await updateMusic(musicId, changes);

    response.json(responseBuilder(true, 200, "Music updated", newMusic));
  } catch (error) {
    next(error);
  }
}

export async function getSingleMusicController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { musicId } = getSingleMusicValidation(request);

    const music = await getMusicById(musicId);

    if (!music)
      return response
        .status(404)
        .json(responseBuilder(false, 404, "Music not found"));

    response.json(responseBuilder(true, 200, "Music", music));
  } catch (error) {
    next(error);
  }
}
