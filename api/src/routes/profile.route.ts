import { profileController } from "@/controllers";
import express from "express";

const router = express.Router();

router.get("/", profileController.getProfile);
router.put("/", profileController.editProfile);

export default router;
