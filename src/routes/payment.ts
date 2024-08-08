import express from "express";
import { onlyAdmin, onlyArtist } from "../middlewares/isAllowedUser";
import isValidToken from "../middlewares/isValidToken";
import {
  createPaymentController,
  getPaymentChartController,
  getPaymentsController,
  getPaymentTotalsController,
} from "../controllers/payment";

const router = express.Router();

router
  .route("/")
  .all(isValidToken)
  .get(onlyAdmin, getPaymentsController)
  .post(onlyArtist, createPaymentController);

router.get("/chart", isValidToken, onlyAdmin, getPaymentChartController);
router.get("/totals", isValidToken, onlyAdmin, getPaymentTotalsController);

export default router;
