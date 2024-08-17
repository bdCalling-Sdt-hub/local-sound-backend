import type { Request, Response, NextFunction } from "express";
import { getAppData, createAppData, updateAppData } from "../services/appData";
import responseBuilder from "../utils/responseBuilder";
import { updateAppDataValidation } from "../validations/appData";

export async function getAppDataController(
  _: Request,
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
    next(error);
  }
}

export async function updateAppDataController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { about, privacy, terms } = updateAppDataValidation(request);

    const appData = await getAppData();

    if (!appData) {
      return response.status(404).json(responseBuilder(false, 404, "App data not found"));
    }

    const newAppData = await updateAppData({
      about,
      privacy,
      terms,
    });

    return response.json(
      responseBuilder(true, 200, "App data updated", newAppData)
    );
  } catch (error) {
    next(error);
  }
}

export async function getAboutController(
  _: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const appData = await getAppData();

    if (!appData) {
      return response.status(404).json(
        responseBuilder(false, 404, "About us data not found")
      );
    }

    return response.json(responseBuilder(true, 200, "About us", appData.about));
  } catch (error) {
    next(error);
  }
}
