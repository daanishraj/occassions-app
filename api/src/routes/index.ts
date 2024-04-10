import express from "express";
import occassionsRouter from "./occassions.route";


const router = express.Router();

router.use('/occassions', occassionsRouter)

export default router;
