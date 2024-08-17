import express from "express";
import { allRegisteredUser, onlyAdmin } from "../middlewares/isAllowedUser";
import isValidToken from "../middlewares/isValidToken";
import {
  createSubscriptionController,
  deleteSubscriptionController,
  getCurrentSubscriptionController,
  getSubscriptionByIdController,
  getSubscriptionsController,
  updateSubscriptionController,
} from "../controllers/subscription";

const router = express.Router();

router
  .route("/")
  .all(isValidToken)
  .post(onlyAdmin, createSubscriptionController)
  .get(allRegisteredUser, getSubscriptionsController);

router
  .route("/:id")
  .all(isValidToken)
  .get(getSubscriptionByIdController)
  .put(onlyAdmin, updateSubscriptionController)
  .delete(onlyAdmin, deleteSubscriptionController);

router
  .route("/current")
  .get(isValidToken, allRegisteredUser, getCurrentSubscriptionController);

export default router;
