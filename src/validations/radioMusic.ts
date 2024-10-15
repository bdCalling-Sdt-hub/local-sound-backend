import { Request } from "express";
import { isValidObjectId } from "../utils/validators";
import error from "../utils/error";

export function createRadioMusicValidation(request: Request): {
  musicId: string;
} {
  const body = request.body;

  if (!body.musicId || typeof body.musicId !== "string") {
    throw error("Music id is required and must be a string", 400);
  }

  if (!isValidObjectId(body.musicId)) {
    throw error("Music id is invalid", 400);
  }

  return {
    musicId: body.musicId,
  };
}

export function getRadioMusicsValidation(request: Request): {
  page: number;
  limit: number;
} {
  const query = request.query;

  let page = parseInt(query.page as string) || 1;

  if (page < 1) page = 1;

  let limit = parseInt(query.limit as string) || 10;

  if (limit < 1) limit = 1;

  return {
    page,
    limit,
  };
}

export function deleteRadioMusicValidation(request: Request): {
  musicId: string;
} {
  const body = request.body;

  if (!body.musicId || typeof body.musicId !== "string") {
    throw error("Music id is required and must be a string", 400);
  }

  if (!isValidObjectId(body.musicId)) {
    throw error("Music id is invalid", 400);
  }

  return {
    musicId: body.musicId,
  };
}
