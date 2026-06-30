import { Router } from "express";
import { listUsers } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

// GET /api/users?type=student  -> usado para listar alunos disponíveis na atribuição de treinos
router.get("/", listUsers);

export default router;
