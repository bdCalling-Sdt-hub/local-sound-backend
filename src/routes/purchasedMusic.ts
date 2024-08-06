import express from "express";
import { onlyUser } from "../middlewares/isAllowedUser";
import isValidToken from "../middlewares/isValidToken";
import {
  createPurchasedMusicController,
  getPurchasedMusicsController,
} from "../controllers/purchasedMusic";

const router = express.Router();

router
  .route("/")
  .all(isValidToken, onlyUser)
  .get(getPurchasedMusicsController)
  .post(createPurchasedMusicController);

export default router;
