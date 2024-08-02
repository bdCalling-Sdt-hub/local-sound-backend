import { Request, Response, NextFunction } from "express";
import { userNotificationsValidation } from "../validations/notification";
import responseBuilder from "../utils/responseBuilder";
import {
  getNotificationsByUserId,
  countNotifications,
} from "../services/notification";
import paginationBuilder from "../utils/paginationBuilder";

export async function userNotificationsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { tokenData, userId, limit, page } =
      await userNotificationsValidation(request);

    if (tokenData.id !== userId) {
      return response.json(
        responseBuilder(
          false,
          401,
          "unauthorized"
        )
      );
    }

    const skip = (page - 1) * limit;

    const totalNotifications = await countNotifications(userId);
    const notifications = await getNotificationsByUserId(userId, limit, skip);

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalNotifications,
    });

    return response.json(
      responseBuilder(
        true,
        200,
        "Notifications retrieved",
        notifications,
        pagination
      )
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
}
