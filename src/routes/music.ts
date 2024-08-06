import express from "express";
import { allRegisteredUser, onlyArtist } from "../middlewares/isAllowedUser";
import isValidToken from "../middlewares/isValidToken";
import upload from "../utils/upload";
import {
  createMusicController,
  getMusicsController,
  getSingleMusicController,
  updateMusicController,
} from "../controllers/music";

const router = express.Router();

router
  .route("/")
  .all(isValidToken)
  .get(allRegisteredUser, getMusicsController)
  .post(
    onlyArtist,
    upload.fields([
      {
        name: "image",
        maxCount: 1,
      },
      {
        name: "music",
        maxCount: 1,
      },
    ]),
    createMusicController
  );

router
  .route("/:musicId")
  .all(isValidToken)
  .get(allRegisteredUser, getSingleMusicController)
  .put(
    onlyArtist,
    upload.fields([
      {
        name: "image",
        maxCount: 1,
      },
      {
        name: "music",
        maxCount: 1,
      },
    ]),
    updateMusicController
  );

export default router;
