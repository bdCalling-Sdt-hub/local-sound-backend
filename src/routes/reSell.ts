import express from "express";
import {
  allRegisteredUser,
  onlyAdmin,
  onlyUser,
} from "../middlewares/isAllowedUser";
import isValidToken from "../middlewares/isValidToken";
import {
  createReSellController,
  getResellsMusicController,
  updateResellPriceController,
} from "../controllers/reSell";

const router = express.Router();

router
  .route("/")
  .all(isValidToken)
  .post(onlyUser, createReSellController)
  .get(allRegisteredUser, getResellsMusicController);

router
  .route("/:id")
  .all(isValidToken)
  .put(onlyAdmin, updateResellPriceController);

export default router;
