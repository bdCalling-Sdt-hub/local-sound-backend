import { Request } from "express";
import error from "../utils/error";
import { isValidObjectId } from "../utils/validators";
import { TokenData } from "../types/token";

export async function userNotificationsValidation(request: Request): Promise<{
  userId: string;
  tokenData: TokenData;
  limit: number;
  page: number;
}> {
  const params = request.params;
  const query = request.query;

  let page = parseInt(query.page as string) || 1;

  if (page < 1) page = 1;

  let limit = parseInt(query.limit as string) || 10;

  if (limit > 100) limit = 100;

  if (limit < 1) limit = 1;

  if (!params.userId) throw error("User ID is required", 400);

  if (!isValidObjectId(params.userId)) throw error("Invalid user ID", 400);

  return {
    userId: params.userId,
    tokenData: request.body.tokenData,
    limit,
    page,
  };
}
