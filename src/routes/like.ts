import express from "express";
import { onlyUser } from "../middlewares/isAllowedUser";
import isValidToken from "../middlewares/isValidToken";
import {
  createLikeController,
  deleteLikeController,
  getLikesController,
} from "../controllers/like";

const router = express.Router();

router
  .route("/")
  .all(isValidToken, onlyUser)
  .get(getLikesController)
  .post(createLikeController);

router.route("/:id").all(isValidToken, onlyUser).delete(deleteLikeController);

export default router;
