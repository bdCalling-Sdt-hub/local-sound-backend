import express from "express";
import { onlyUser } from "../middlewares/isAllowedUser";
import isValidToken from "../middlewares/isValidToken";
import {
  createPlayListController,
  getPlayListsController,
} from "../controllers/playList";
import {
  createPlayListMusicController,
  deletePlayListMusicController,
  getPlayListMusicsController,
} from "../controllers/playListMusic";
import upload from "../utils/upload";

const router = express.Router();

router
  .route("/")
  .all(isValidToken, onlyUser)
  .get(getPlayListsController)
  .post(upload.single("image"),createPlayListController);

router
  .route("/:id")
  .all(isValidToken, onlyUser)
  .get(getPlayListMusicsController)
  .post(createPlayListMusicController)
  .delete(deletePlayListMusicController);

export default router;
