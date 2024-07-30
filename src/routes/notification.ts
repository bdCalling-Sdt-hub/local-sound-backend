import express from "express";
import { userNotificationsController } from "../controllers/notification";
import isValidToken from "../middlewares/isValidToken";
import { AllRegisteredUser } from "../middlewares/isAllowedUser";

const router = express.Router();

router.get("/:userId",isValidToken,AllRegisteredUser,userNotificationsController);

export default router;