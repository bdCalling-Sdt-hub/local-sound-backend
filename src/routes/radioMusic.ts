import express from "express";
import { onlyAdmin } from "../middlewares/isAllowedUser";
import isValidToken from "../middlewares/isValidToken";
import {
  getRadioMusicsController,
  createRadioMusicController,
  deleteRadioMusicController,
} from "../controllers/radioMusic";

const router = express.Router();

router
  .route("/")
  .all(isValidToken, onlyAdmin)
  .get(getRadioMusicsController)
  .post(createRadioMusicController)
  .delete(deleteRadioMusicController);

export default router;
