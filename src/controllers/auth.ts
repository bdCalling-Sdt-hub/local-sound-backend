import { Request, Response, NextFunction } from "express";
import {
  loginValidation,
  resendOtpValidation,
  registerValidation,
  verifyOtpValidation,
  forgotPasswordValidation,
} from "../validations/auth";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserById,
} from "../services/user";
import { createOtp, getLastOtpByUserId } from "../services/otp";
import responseBuilder from "../utils/responseBuilder";
import { hashPassword, comparePassword } from "../services/hash";
import { sentOtpByEmail } from "../services/mail";
import { generateToken } from "../services/jwt";
import { createNotification } from "../services/notification";
import { TokenData } from "../types/token";

export async function registerController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, email, password, type } = registerValidation(request);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return response.status(400).json(
        responseBuilder(false, 400, "User already exists with this email")
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      type,
    });

    const otp = await createOtp(user.id);

    sentOtpByEmail(email, otp.code);

    await createNotification({
      userId: user.id,
      message: `Hello ${name}, welcome to our platform`,
    });

    return response.status(201).json(
      responseBuilder(true, 201, "A OTP sent to your email", user)
    );
  } catch (error) {
    next(error);
  }
}

export async function loginController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { email, password } = loginValidation(request);

    const user = await getUserByEmail(email);

    if (!user) {
      return response
        .status(400)
        .json(responseBuilder(false, 400, "User not found with this email"));
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return response
        .status(400)
        .json(responseBuilder(false, 400, "Invalid password"));
    }

    if (!user.isVerified) {
      const prevuesOtp = await getLastOtpByUserId(user.id);

      if (!prevuesOtp) {
        const otp = await createOtp(user.id);
        sentOtpByEmail(user.email, otp.code);

        return response.status(401).json(
          responseBuilder(false, 401, "Please verify your email", {
            id: user.id,
          })
        );
      }

      if (prevuesOtp.createdAt > new Date(new Date().getTime() - 120000)) {
        return response.status(401).json(
          responseBuilder(false, 401, "Please verify your email", {
            id: user.id,
          })
        );
      }

      const otp = await createOtp(user.id);
      sentOtpByEmail(user.email, otp.code);

      return response.status(401).json(
        responseBuilder(true, 401, "Please verify your email", { id: user.id })
      );
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      type: user.type,
    });

    const { id, name, address, dateOfBirth, image, isVerified, number, type } =
      user;

    return response.json(
      responseBuilder(true, 200, "Login successful", {
        token,
        user: {
          id,
          name,
          email,
          address,
          dateOfBirth,
          image,
          isVerified,
          number,
          type,
        },
      })
    );
  } catch (error) {
    next(error);
  }
}

export async function verifyOtpController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { code, userId } = verifyOtpValidation(request);

    const user = await getUserById(userId);

    if (!user) {
      return response
        .status(400)
        .json(responseBuilder(false, 400, "User not found"));
    }

    const otp = await getLastOtpByUserId(userId);

    if (!otp) {
      return response.status(400).json(
        responseBuilder(false, 400, "No OTP found for user")
      );
    }

    if (otp.expiredAt < new Date()) {
      return response
        .status(400)
        .json(responseBuilder(false, 400, "OTP expired"));
    }

    if (otp.code === code) {
      await updateUserById(userId, { isVerified: true });

      const token = generateToken({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        type: user.type,
      });

      const {
        id,
        email,
        name,
        address,
        dateOfBirth,
        image,
        isVerified,
        number,
        type,
      } = user;

      return response.json(
        responseBuilder(true, 200, "OTP verified successfully", {
          token,
          user: {
            id,
            name,
            email,
            address,
            dateOfBirth,
            image,
            isVerified,
            number,
            type,
          },
        })
      );
    }

    return response
      .status(400)
      .json(responseBuilder(false, 400, "Invalid OTP"));
  } catch (error) {
    next(error);
  }
}

export async function resendOTPController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { userId } = resendOtpValidation(request);

    const user = await getUserById(userId);

    if (!user) {
      return response
        .status(400)
        .json(responseBuilder(false, 400, "User not found"));
    }

    const prevuesOtp = await getLastOtpByUserId(userId);

    if (!prevuesOtp) {
      const otp = await createOtp(userId);
      sentOtpByEmail(user.email, otp.code);

      return response.json(
        responseBuilder(true, 200, "A OTP sent to your email", { id: user.id })
      );
    }

    if (prevuesOtp.createdAt > new Date(new Date().getTime() - 120000)) {
      const timeLeft = Math.ceil(
        (prevuesOtp.createdAt.getTime() + 120000 - new Date().getTime()) / 1000
      );

      return response.status(400).json(
        responseBuilder(
          false,
          400,
          `Please wait ${timeLeft} seconds before sending another OTP`,
          { timeLeft }
        )
      );
    }

    const otp = await createOtp(userId);
    sentOtpByEmail(user.email, otp.code);

    return response.json(
      responseBuilder(true, 200, "A new OTP sent to your email", {
        id: user.id,
      })
    );
  } catch (error) {
    next(error);
  }
}

export async function forgotController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { email } = forgotPasswordValidation(request);
    const user = await getUserByEmail(email);
    if (!user) {
      return response
        .status(400)
        .json(responseBuilder(false, 400, "User not found"));
    }

    const prevuesOtp = await getLastOtpByUserId(user.id);

    if (
      prevuesOtp &&
      prevuesOtp.createdAt > new Date(new Date().getTime() - 120000)
    ) {
      const timeLeft = Math.ceil(
        (prevuesOtp.createdAt.getTime() + 120000 - new Date().getTime()) / 1000
      );

      return response.status(400).json(
        responseBuilder(
          false,
          400,
          `Please wait ${timeLeft} seconds before sending another OTP`,
          timeLeft
        )
      );
    }

    const otp = await createOtp(user.id);

    sentOtpByEmail(email, otp.code);
    return response.json(
      responseBuilder(true, 200, "A OTP sent to your email", { id: user.id })
    );
  } catch (error) {
    next(error);
  }
}

export async function getSessionController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const tokenData = request.tokenData as TokenData;

    const user = await getUserById(tokenData.id);

    if (!user) {
      return response
        .status(400)
        .json(responseBuilder(false, 400, "User not found"));
    }

    const {
      id,
      email,
      name,
      address,
      dateOfBirth,
      image,
      isVerified,
      number,
      type,
    } = user;

    return response.json(
      responseBuilder(true, 200, "User found", {
        id,
        name,
        email,
        address,
        dateOfBirth,
        image,
        isVerified,
        number,
        type,
      })
    );
  } catch (error) {
    next(error);
  }
}
