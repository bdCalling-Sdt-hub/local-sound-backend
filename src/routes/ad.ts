import express from "express";
import { createAdController, getAdsController } from "../controllers/ads";
import { AllRegisteredUser, onlyArtist } from "../middlewares/isAllowedUser";
import isValidToken from "../middlewares/isValidToken";

const router = express.Router();

router
  .route("/")
  .all(isValidToken)
  .get(AllRegisteredUser, getAdsController)
  .post(onlyArtist, createAdController);

export default router;
