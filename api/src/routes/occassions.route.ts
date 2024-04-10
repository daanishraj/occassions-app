import { occassionsController } from "@/controllers/occassions.controller";
import express from "express";

const router = express.Router();

router.get("/", occassionsController.getOccasions)

export default router;