import express from "express";
import { onlyAdmin } from "../middlewares/isAllowedUser";
import isValidToken from "../middlewares/isValidToken";
import { createSubscriptionController } from "../controllers/subscription";

const router = express.Router();

router.route("/").post(isValidToken, onlyAdmin, createSubscriptionController);

export default router;
