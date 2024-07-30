import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/jwt";
import responseBuilder from "../utils/responseBuilder";

export default function isValidToken(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const bearerToken = request.headers.authorization;
  if (!bearerToken)
    return response
      .status(400)
      .json(responseBuilder(false, 400, "Authorization token is required"));

  const token = bearerToken.split(" ")[1];

  const tokenData = verifyToken(token);

  if (!tokenData)
    return response
      .status(401)
      .json(responseBuilder(false, 401, "Invalid token"));

  request.body.tokenData = tokenData;

  return next();
}
