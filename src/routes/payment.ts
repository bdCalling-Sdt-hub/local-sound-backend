import express from "express";
import {
  onlyAdmin,
  onlyArtist,
} from "../middlewares/isAllowedUser";
import isValidToken from "../middlewares/isValidToken";
import {
  createPaymentController,
  getPaymentsController,
} from "../controllers/payment";

const router = express.Router();

router
  .route("/")
  .all(isValidToken)
  .get(onlyAdmin, getPaymentsController)
  .post(onlyArtist, createPaymentController);

export default router;
