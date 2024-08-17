import { Request, Response, NextFunction } from "express";
import { TokenData } from "../types/token";
import { getUserById } from "../services/user";
import responseBuilder from "../utils/responseBuilder";

declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

export async function onlyAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const tokenData = request.tokenData as TokenData;

    const user = await getUserById(tokenData.id);

    if (!user) {
      return response.json(
        responseBuilder(false, 400, "Invalid Token User not found")
      );
    }

    if (user.type !== "ADMIN") {
      return response.json(
        responseBuilder(false, 401, "Unauthorized Only Admin can access")
      );
    }

    request.user = user;

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
    const tokenData = request.tokenData as TokenData;

    const user = await getUserById(tokenData.id);

    if (!user) {
      return response.json(
        responseBuilder(false, 400, "Invalid Token User not found")
      );
    }

    if (user.type !== "USER") {
      return response.json(
        responseBuilder(false, 401, "Unauthorized Only User can access")
      );
    }

    request.user = user;

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
    const tokenData = request.tokenData as TokenData;

    const user = await getUserById(tokenData.id);

    if (!user) {
      return response.json(
        responseBuilder(false, 400, "Invalid Token User not found")
      );
    }

    if (user.type !== "ARTIST") {
      return response.json(
        responseBuilder(false, 401, "Unauthorized Only Artist can access")
      );
    }

    request.user = user;

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

export async function allRegisteredUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const tokenData = request.tokenData as TokenData;

    const user = await getUserById(tokenData.id);

    if (!user) {
      return response.json(responseBuilder(false, 400, "User not found"));
    }

    request.user = user;

    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
}
