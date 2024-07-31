import type { Request, Response, NextFunction } from "express";
import { getAppData, createAppData } from "../services/appData";
import responseBuilder from "../utils/responseBuilder";

export async function getAppDataController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const appData = await getAppData();

    if (!appData) {
      const newAppData = await createAppData({
        about: "About us",
        privacy: "Privacy policy",
        terms: "Terms and conditions",
      });
      return response.json(responseBuilder(true, 200, "App data", newAppData));
    }

    return response.json(responseBuilder(true, 200, "App data", appData));
  } catch (error) {
    console.error(error);
    next(error);
  }
}
