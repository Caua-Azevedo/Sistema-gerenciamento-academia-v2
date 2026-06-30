import { Router } from "express";
import {
  listWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  assignWorkout,
} from "../controllers/workout.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", listWorkouts);
router.get("/:id", getWorkout);
router.post("/", requireRole("teacher"), createWorkout);
router.put("/:id", requireRole("teacher"), updateWorkout);
router.delete("/:id", requireRole("teacher"), deleteWorkout);
router.patch("/:id/assign", requireRole("teacher"), assignWorkout);

export default router;
