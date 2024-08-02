import type { Request } from "express";
import error from "../utils/error";
import { isValidObjectId } from "../utils/validators";

export function createMusicValidation(request: Request): {
  name: string;
  image: string;
  audio: string;
  price: number;
} {
  const body = JSON.parse(JSON.stringify(request.body));

  const files = request?.files as any;
  const music = files?.music;
  const image = files?.image;

  if (!music || music.length === 0) {
    throw error("Music is required", 400);
  }

  if (typeof music[0].filename !== "string")
    throw error("Audio can't save", 400);

  if (!body.name) {
    throw error("Name is required", 400);
  }

  if (!image || image.length === 0) {
    throw error("Image is required", 400);
  }

  if (!body.price) {
    throw error("Price is required", 400);
  }

  if (typeof body.name !== "string") throw error("Name must be string", 400);

  if (typeof image[0].filename !== "string")
    throw error("Image must be string", 400);

  const price = Number(body.price);

  if (isNaN(price)) {
    throw error("Price must be a number", 400);
  }

  if (price < 0) {
    throw error("Price must be positive", 400);
  }

  return {
    name: body.name,
    image: image[0].filename,
    audio: music[0].filename,
    price,
  };
}

export function getMusicsValidation(request: Request): {
  limit: number;
  page: number;
  name?: string;
  price: "asc" | "desc";
} {
  const query = request.query;

  let page = parseInt(query.page as string) || 1;

  if (page < 1) page = 1;

  let limit = parseInt(query.limit as string) || 10;

  if (limit > 100) limit = 100;

  if (limit < 1) limit = 1;

  if (query.name && typeof query.name !== "string") {
    throw error("Name must be string ", 400);
  }

  if (!query.price) {
    query.price = "asc";
  }

  if (query.price !== "asc" && query.price !== "desc") {
    throw error("Price must be asc or desc", 400);
  }

  return {
    limit,
    page,
    name: query.name,
    price: query.price,
  };
}

export function updateMusicValidation(request: Request): {
  musicId: string;
  changes: {
    name?: string;
    image?: string;
    audio?: string;
    price?: number;
  };
} {
  const body = JSON.parse(JSON.stringify(request.body));
  const params = request.params;

  if (!params.musicId) {
    throw error("Music ID is required", 400);
  }

  if (!isValidObjectId(params.musicId)) {
    throw error("Invalid music ID", 400);
  }

  const musicData: {
    name?: string;
    image?: string;
    audio?: string;
    price?: number;
  } = {};

  const files = request?.files as any;
  const music = files?.music;
  const image = files?.image;

  if (body.name) musicData.name = body.name;

  if (body.price) {
    const price = Number(body.price);

    if (isNaN(price)) {
      throw error("Price must be a number", 400);
    }

    if (price < 0) {
      throw error("Price must be positive", 400);
    }

    musicData.price = price;
  }

  if (music?.length > 0 && music[0]?.filename)
    musicData.audio = music[0]?.filename;

  if (image?.length > 0 && image[0]?.filename)
    musicData.image = image[0]?.filename;

  return { musicId: params.musicId, changes: musicData };
}
