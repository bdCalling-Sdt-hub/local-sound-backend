import express from "express";
import isValidToken from "../middlewares/isValidToken";
import { onlyAdmin } from "../middlewares/isAllowedUser";

const router = express.Router();

router
  .route("/")

export default router;
