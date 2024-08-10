import express from "express";
import {
  getUsersController,
  updateUserController,
  changePasswordController,
  getTotalUserAndArtist,
} from "../controllers/user";
import upload from "../utils/upload";
import isValidToken from "../middlewares/isValidToken";
import { allRegisteredUser, onlyAdmin } from "../middlewares/isAllowedUser";

const router = express.Router();

router.route("/").get(isValidToken, onlyAdmin, getUsersController);

router
  .route("/:userId")
  .all(isValidToken, allRegisteredUser)
  // .get(getUserController)
  .put(upload.single("image"), updateUserController)
  .patch(changePasswordController);

router.get("/totals", isValidToken, onlyAdmin, getTotalUserAndArtist);

export default router;
