import express from "express";
import { onlyUser } from "../middlewares/isAllowedUser";
import isValidToken from "../middlewares/isValidToken";
import { createReSellController } from "../controllers/reSell";

const router = express.Router();

router.route("/").all(isValidToken, onlyUser).post(createReSellController);

export default router;
