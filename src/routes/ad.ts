import express from "express";
import { createAdController, getAdsController } from "../controllers/ads";
import { AllRegisteredUser, onlyArtist } from "../middlewares/isAllowedUser";
import isValidToken from "../middlewares/isValidToken";
import upload from "../utils/upload";

const router = express.Router();

router
  .route("/")
  .all(isValidToken)
  .get(AllRegisteredUser, getAdsController)
  .post(onlyArtist, upload.single("image"), createAdController);

export default router;
