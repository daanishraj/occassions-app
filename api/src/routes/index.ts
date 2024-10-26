import express from "express";
import occassionsRouter from "./occasions.route";
import profileRouter from "./profile.route";

const router = express.Router();

router.use("/occasions", occassionsRouter);
router.use("/profile", profileRouter);

export default router;
