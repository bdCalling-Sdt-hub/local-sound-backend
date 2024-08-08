import express from "express";
import isValidToken from "../middlewares/isValidToken";
import { allRegisteredUser, onlyAdmin } from "../middlewares/isAllowedUser";
import {
  getWithdrawalsController,
  createWithdrawalController,
  updateWithdrawalStatusController,
} from "../controllers/withdrawal";

const router = express.Router();

router
  .route("/")
  .all(isValidToken, allRegisteredUser)
  .get(getWithdrawalsController)
  .post(createWithdrawalController);

router
  .route("/:id")
  .put(isValidToken, onlyAdmin, updateWithdrawalStatusController);

export default router;
