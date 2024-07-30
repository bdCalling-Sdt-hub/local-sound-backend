import { Request } from "express";

export function createAdValidation(request: Request): {
  date: string;
  description: string;
  image: string;
  time: string;
  title: string;
  venue: string;
} {
  const body = request.body;

  if (!body.date) throw new Error("Date is required");
  if (!body.description) throw new Error("Description is required");
  if (!body.image) throw new Error("Image is required");
  if (!body.time) throw new Error("Time is required");
  if (!body.title) throw new Error("Title is required");
  if (!body.venue) throw new Error("Venue is required");

  if (typeof body.date !== "string") throw new Error("Date must be a string");
  if (typeof body.description !== "string")
    throw new Error("Description must be a string");
  if (typeof body.image !== "string") throw new Error("Image must be a string");
  if (typeof body.time !== "string") throw new Error("Time must be a string");
  if (typeof body.title !== "string") throw new Error("Title must be a string");
  if (typeof body.venue !== "string") throw new Error("Venue must be a string");

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
