import type { Request } from "express";
import error from "../utils/error";

export function updateAppDataValidation(request: Request): {
  about?: string;
  privacy?: string;
  terms?: string;
} {
  const body = request.body;

  if (Object.keys(body).length === 0) throw error("No data provided", 400);

  if (body?.about && typeof body.about !== "string") {
    throw error("About must be a string", 400);
  }

  if (body?.privacy && typeof body.privacy !== "string") {
    throw error("Privacy must be a string", 400);
  }

  if (body?.terms && typeof body.terms !== "string") {
    throw error("Terms must be a string", 400);
  }

  if(!body.about && !body.privacy && !body.terms) {
    throw error("No valid data provided to update", 400);
  }

  return {
    about: body.about,
    privacy: body.privacy,
    terms: body.terms,
  };
}
