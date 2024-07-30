import { Request, Response, NextFunction } from "express";
import { TokenData } from "../types/token";
import { getUserById } from "../services/user";

export async function onlyAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const tokenData = request.body.tokenData as TokenData;

    const user = await getUserById(tokenData.id);

    if (!user) {
      return response.json({
        success: false,
        status: 400,
        message: "Invalid Token User not found",
      });
    }

    if (user.type !== "ADMIN") {
      return response.json({
        success: false,
        status: 401,
        message: "Unauthorized Only Admin can access",
      });
    }

    request.body.user = user;

    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function onlyUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const tokenData = request.body.tokenData as TokenData;

    const user = await getUserById(tokenData.id);

    if (!user) {
      return response.json({
        success: false,
        status: 400,
        message: "Invalid Token User not found",
      });
    }

    if (user.type !== "USER") {
      return response.json({
        success: false,
        status: 401,
        message: "Unauthorized Only User can access",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function onlyArtist(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const tokenData = request.body.tokenData as TokenData;

    const user = await getUserById(tokenData.id);

    if (!user) {
      return response.json({
        success: false,
        status: 400,
        message: "Invalid Token User not found",
      });
    }

    if (user.type !== "ARTIST") {
      return response.json({
        success: false,
        status: 401,
        message: "Unauthorized Only Artist can access",
      });
    }

    request.body.user = user;

    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
}

// export async function onlyUserOrArtist(
//   request: Request,
//   response: Response,
//   next: NextFunction
// ) {
//   try {
//     const tokenData = request.body.tokenData as TokenData;

//     const user = await getUserById(tokenData.id);

//     if (!user) {
//       return response.json({
//         success: false,
//         status: 400,
//         message: "User not found",
//       });
//     }

//     if (user.type !== "ARTIST" && user.type !== "USER") {
//       return response.json({
//         success: false,
//         status: 401,
//         message: "Unauthorized",
//       });
//     }

//     request.body.user = user;

//     next();
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// }

export async function AllRegisteredUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const tokenData = request.body.tokenData as TokenData;

    const user = await getUserById(tokenData.id);

    if (!user) {
      return response.json({
        success: false,
        status: 400,
        message: "Invalid Token User not found",
      });
    }

    request.body.user = user;

    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
}
