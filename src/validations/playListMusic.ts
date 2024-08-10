import type { Request } from "express";
import error from "../utils/error";
import { isValidObjectId } from "../utils/validators";

export function createPlayListMusicValidation(request: Request): {
  playListId: string;
  musicId: string;
} {
  const params = request.params
  const data = request.body;

  if (!data.musicId) throw error("MusicId is required", 400);

  if (typeof data.musicId !== "string")
    throw error("MusicId must be a string", 400);

  if (!params.id) throw error("Playlist ID is required", 400);

  if (!isValidObjectId(params.id)) throw error("Invalid Playlist ID", 400);

  return {
    playListId: params.id,
    musicId: data.musicId,
  };
}

export function getPlayListMusicsValidation(request: Request): {
  playListId: string;
  limit: number;
  page: number;
} {
  const params = request.params;
  const query = request.query;

  let page = parseInt(query.page as string) || 1;

  if (page < 1) page = 1;

  let limit = parseInt(query.limit as string) || 10;

  if (limit > 100) limit = 100;

  if (limit < 1) limit = 1;

  if (!params.id) throw error("Playlist ID is required", 400);

  if (!isValidObjectId(params.id)) throw error("Invalid Playlist ID", 400);

  return {
    playListId: params.id,
    limit,
    page,
  };
}

export function deletePlayListMusicValidation(request: Request): {
  playListId: string;
  musicId: string;
} {
  const params = request.params;
  const body = request.body;

  if (!params.id) throw error("Playlist ID is required", 400);

  if (!isValidObjectId(params.id)) throw error("Invalid Playlist ID", 400);

  if (!body.musicId) throw error("Music ID is required", 400);

  if (!isValidObjectId(body.musicId)) throw error("Invalid Music ID", 400);

  return {
    playListId: params.id,
    musicId: params.musicId,
  };
}
