import type { Request } from "express";
import error from "../utils/error";

export function createPlayListValidation(request: Request): {
  name: string;
  image: string;
} {
  const body = request.body;

  if (!body.name || typeof body.name !== "string") {
    throw error("Name is required and must be a string", 400);
  }

  if (!body.image || typeof body.image !== "string") {
    throw error("Image is required and must be a string", 400);
  }

  return {
    name: body.name,
    image: body.image,
  };
}

export function getPlayListsValidation(request:Request){
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