import { NextFunction, Request, Response } from "express";
import {
  countUsers,
  getUserById,
  getUsers,
  updateUserById,
} from "../services/user";
import {
  getUserValidation,
  updateUserValidation,
  changePasswordValidation,
  getUsersValidation,
} from "../validations/user";
import responseBuilder from "../utils/responseBuilder";
import { comparePassword, hashPassword } from "../services/hash";
import paginationBuilder from "../utils/paginationBuilder";

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
      return response.status(401).json(
        responseBuilder(false, 401, "Unauthorized"));
    }

    if (Object.keys(userData).length === 0) {
      return response.status(400).json(
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
      const user = await getUserById(userId);

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

export async function getUsersController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { limit, page, type,name } = getUsersValidation(request);

    const totalUser = await countUsers(type);

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalUser,
    });

    if (page > pagination.totalPage) {
      return response.json(responseBuilder(false, 404, "Page not found"));
    }

    const skip = (page - 1) * limit;
    const users = await getUsers({ limit, skip, type,name });

    return response.json(
      responseBuilder(true, 200, "Users retrieved", users, pagination)
    );
  } catch (error) {
    next(error);
  }
}

export async function getTotalUserAndArtist(
  _: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const totalUser = await countUsers("USER");
    const totalArtist = await countUsers("ARTIST");

    return response.json(
      responseBuilder(true, 200, "Total user and artist", {
        totalUser,
        totalArtist,
      })
    );
  } catch (error) {
    next(error);
  }
}