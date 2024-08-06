import express from "express";
import { allRegisteredUser, onlyAdmin } from "../middlewares/isAllowedUser";
import isValidToken from "../middlewares/isValidToken";
import {
  createSubscriptionController,
  deleteSubscriptionController,
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
  .put(onlyAdmin, updateSubscriptionController)
  .delete(onlyAdmin, deleteSubscriptionController);

export default router;
