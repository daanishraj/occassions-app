import express from "express";
import occassionsRouter from "./occassions.route";
import profileRouter from "./profile.route";

const router = express.Router();

router.use("/occassions", occassionsRouter);
router.use("/profile", profileRouter);

export default router;
