import express from "express";
import {
  getUserController,
  updateUserController,
  changePasswordController,
} from "../controllers/user";
import upload from "../utils/upload";
import isValidToken from "../middlewares/isValidToken";
import { AllRegisteredUser } from "../middlewares/isAllowedUser";

const router = express.Router();

router
  .route("/:userId")
  .all(isValidToken, AllRegisteredUser)
  // .get(getUserController)
  .put(upload.single("image"), updateUserController)
  .patch(changePasswordController);

export default router;
