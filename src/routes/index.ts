import express from "express";

import authRouter from "./auth";
import notificationRouter from "./notification";
import userRouter from "./user";
import adRouter from "./ad";
import subscriptionRouter from "./subscription";
import paymentRouter from "./payment";
import musicRouter from "./music";
import likeRouter from "./like";
import purchasedMusicRouter from "./purchasedMusic";
import reSellRouter from "./reSell";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/notifications", notificationRouter);
router.use("/users", userRouter);
router.use("/ads", adRouter);
router.use("/subscriptions", subscriptionRouter);
router.use("/payments", paymentRouter);
router.use("/musics", musicRouter);
router.use("/likes", likeRouter);
router.use("/purchased-musics", purchasedMusicRouter);
router.use("/re-sells", reSellRouter);

export default router;
