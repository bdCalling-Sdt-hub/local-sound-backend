import { Request } from "express";
import error from "../utils/error";

export function createAdValidation(request: Request): {
  date: string;
  description: string;
  image: string;
  time: string;
  title: string;
  venue: string;
} {
  const body = JSON.parse(JSON.stringify(request.body));

  if (!body.date) throw error("Date is required", 400);
  if (!body.description) throw error("Description is required", 400);
  if (!body.image) throw error("Image is required", 400);
  if (!body.time) throw error("Time is required", 400);
  if (!body.title) throw error("Title is required", 400);
  if (!body.venue) throw error("Venue is required", 400);

  if (typeof body.date !== "string") throw error("Date must be a string", 400);
  if (typeof body.description !== "string")
    throw error("Description must be a string", 400);
  if (typeof body.image !== "string")
    throw error("Image must be a string", 400);
  if (typeof body.time !== "string") throw error("Time must be a string", 400);
  if (typeof body.title !== "string")
    throw error("Title must be a string", 400);
  if (typeof body.venue !== "string")
    throw error("Venue must be a string", 400);

  return {
    date: body.date,
    description: body.description,
    image: body.image,
    time: body.time,
    title: body.title,
    venue: body.venue,
  };
}

export function getAdsValidation(request: Request): {
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
