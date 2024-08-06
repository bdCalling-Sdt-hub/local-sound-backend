import { NextFunction, Request, Response } from "express";
import { getUserById, updateUserById } from "../services/user";
import {
  getUserValidation,
  updateUserValidation,
  changePasswordValidation,
} from "../validations/user";
import responseBuilder from "../utils/responseBuilder";
import { comparePassword, hashPassword } from "../services/hash";

export async function getUserController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { userId } = getUserValidation(request);

    // if (tokenData.id !== userId) {
    //   return response.json({
    //     success: false,
    //     status: 401,
    //     message: "Unauthorized",
    //   });
    // }

    const user = await getUserById(userId);

    if (!user) {
      return response.json(responseBuilder(false, 400, "User not found"));
    }

    return response.json(responseBuilder(true, 200, "User retrieved", user));
  } catch (error) {
    next(error);
  }
}

export async function updateUserController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { tokenData, userData, userId } = updateUserValidation(request);

    if (tokenData.id !== userId) {
      return response.json({
        success: false,
        status: 401,
        message: "Unauthorized",
      });
    }

    if (Object.keys(userData).length === 0) {
      return response.json(
        responseBuilder(false, 400, "Provide data not allowed to update")
      );
    }

    const user = await updateUserById(userId, userData);

    return response.json(responseBuilder(true, 200, "User updated", user));
  } catch (error) {
    next(error);
  }
}

export async function changePasswordController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { oldPassword, newPassword, userId, tokenData } =
      changePasswordValidation(request);

    if (tokenData.id !== userId) {
      return response.json(responseBuilder(false, 401, "Unauthorized"));
    }

    if (oldPassword) {
      const user = await getUserById(userId, true);

      if (!user) {
        return response.json(responseBuilder(false, 400, "User not found"));
      }

      const isMatch = await comparePassword(oldPassword, user.password);

      if (!isMatch) {
        return response.json(responseBuilder(false, 400, "Invalid password"));
      }
    }

    const hashedPassword = await hashPassword(newPassword);

    await updateUserById(userId, { password: hashedPassword });

    return response.json(responseBuilder(true, 200, "Password updated"));
  } catch (error) {
    next(error);
  }
}
