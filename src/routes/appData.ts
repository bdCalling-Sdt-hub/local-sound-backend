import express from "express";
import isValidToken from "../middlewares/isValidToken";
import { onlyAdmin } from "../middlewares/isAllowedUser";
import {
  getAppDataController,
  updateAppDataController,
} from "../controllers/appData";

const router = express.Router();

router
  .route("/")
  .get(getAppDataController)
  .put(isValidToken, onlyAdmin, updateAppDataController);

router.get("/about.html")
router.get("/privacy.html")
router.get("/terms.html")

export default router;
