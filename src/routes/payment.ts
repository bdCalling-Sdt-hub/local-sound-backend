import express from "express";
import { AllRegisteredUser, onlyArtist } from "../middlewares/isAllowedUser";
import isValidToken from "../middlewares/isValidToken";
import { createPaymentController } from "../controllers/payment";

const router = express.Router();

router
  .route("/")
  .post(isValidToken, AllRegisteredUser, createPaymentController);

export default router;
