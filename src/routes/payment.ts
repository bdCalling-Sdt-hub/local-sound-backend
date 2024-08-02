import express from "express";
import { allRegisteredUser, onlyArtist } from "../middlewares/isAllowedUser";
import isValidToken from "../middlewares/isValidToken";
import { createPaymentController } from "../controllers/payment";

const router = express.Router();

router
  .route("/")
  .post(isValidToken, allRegisteredUser, createPaymentController);

export default router;
