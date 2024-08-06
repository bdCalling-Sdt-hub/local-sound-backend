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
        responseBuilder(false, 403, "You are not allowed to access this data")
      );
    }

    const skip = (page - 1) * limit;

    const totalNotifications = await countNotifications(userId);

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalNotifications,
    });

    if (page > pagination.totalPage) {
      return response.json(responseBuilder(false, 404, "Page not found"));
    }
    
    const notifications = await getNotificationsByUserId(userId, limit, skip);

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
    next(error);
  }
}
