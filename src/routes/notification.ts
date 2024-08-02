import express from "express";
import { userNotificationsController } from "../controllers/notification";
import isValidToken from "../middlewares/isValidToken";
import { allRegisteredUser } from "../middlewares/isAllowedUser";

const router = express.Router();

router.get(
  "/:userId",
  isValidToken,
  allRegisteredUser,
  userNotificationsController
);

export default router;
