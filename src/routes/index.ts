import express from "express";

import authRouter from "./auth";
import notificationRouter from "./notification";
import userRouter from "./user";
import adRouter from "./ad";
import subscriptionRouter from "./subscription";
import paymentRouter from "./payment";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/notifications", notificationRouter);
router.use("/users", userRouter);
router.use("/ads", adRouter);
router.use("/subscriptions", subscriptionRouter);
router.use("/payments", paymentRouter);

export default router;
