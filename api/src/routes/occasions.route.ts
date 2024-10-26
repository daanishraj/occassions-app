import { occasionsController } from "@/controllers/occasions.controller";
import express from "express";

const router = express.Router();

router.get("/", occasionsController.getOccasions);
router.post("/", occasionsController.addOccasion);
router.delete("/:id", occasionsController.deleteOccasion);

export default router;
