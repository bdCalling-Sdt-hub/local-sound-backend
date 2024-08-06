import express from "express";
import {
  getUsersController,
  updateUserController,
  changePasswordController,
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

export default router;
