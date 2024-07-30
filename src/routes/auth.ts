import express from "express";
import {
  loginController,
  registerController,
  resendOTPController,
  verifyOtpController,
  forgotController,
  getSessionController,
} from "../controllers/auth";
import isValidToken from "../middlewares/isValidToken";

const router = express.Router();

router.post("/login", loginController);

router.post("/register", registerController);

router.get("/forgot", forgotController);

router.get("/session", isValidToken, getSessionController);

router.route("/otp").post(verifyOtpController).get(resendOTPController);

export default router;