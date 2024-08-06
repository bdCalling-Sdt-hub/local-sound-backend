import express from "express";
import { onlyUser } from "../middlewares/isAllowedUser";
import isValidToken from "../middlewares/isValidToken";
import {
  createPlayListController,
  getPlayListsController,
} from "../controllers/playList";

const router = express.Router();

router
  .route("/")
  .all(isValidToken, onlyUser)
  .get(getPlayListsController)
  .post(createPlayListController);

export default router;
