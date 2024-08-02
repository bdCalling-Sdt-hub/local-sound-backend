import type { Request } from "express";
import error from "../utils/error";
import { isBooleanObject } from "util/types";

export function createLikeValidation(request: Request): {
  musicId: string;
} {
  const body = request.body;

  if (!body.musicId || typeof body.musicId !== "string") {
    throw error("Music id is required and must be a string", 400);
  }

  if(isBooleanObject(body.musicId)){
    throw error("Music id must be a string", 400);
  }

  return {
    musicId: body.musicId,
  };
}

export function getLikesValidation(request: Request): {
  limit: number;
  page: number;
} {
  const query = request.query;

  let page = parseInt(query.page as string) || 1;

  if (page < 1) page = 1;

  let limit = parseInt(query.limit as string) || 10;

  if (limit > 100) limit = 100;

  if (limit < 1) limit = 1;

  return {
    limit,
    page,
  };
}