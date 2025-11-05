import { occasionsController } from "@/controllers/occasions.controller";
import { requireAuth } from "@/middleware/auth";
import express from "express";

const router = express.Router();

// All occasions routes require authentication
router.get("/", requireAuth, occasionsController.getOccasions);
router.post("/", requireAuth, occasionsController.addOccasion);
router.put("/:id", requireAuth, occasionsController.editOccasion);
router.delete("/:id", requireAuth, occasionsController.deleteOccasion);

export default router;
