import { Router } from "express";
import {
  listConsultations,
  getConsultation,
  createConsultation,
  updateConsultationStatus,
  deleteConsultation,
} from "../controllers/consultation.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", listConsultations);
router.get("/:id", getConsultation);
router.post("/", requireRole("student"), createConsultation);
router.patch("/:id", requireRole("teacher"), updateConsultationStatus);
router.delete("/:id", requireRole("teacher"), deleteConsultation);

export default router;
