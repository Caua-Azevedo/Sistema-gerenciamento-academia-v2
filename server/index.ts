import express from "express";
import cors from "cors";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import { seedDemoData } from "./utils/seed.js";
import authRoutes from "./routes/auth.routes.js";
import workoutRoutes from "./routes/workout.routes.js";
import consultationRoutes from "./routes/consultation.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  await connectDB();
  await seedDemoData();

  const app = express();
  const server = createServer(app);

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ---- Rotas da API ----
  app.use("/api/auth", authRoutes);
  app.use("/api/workouts", workoutRoutes);
  app.use("/api/consultations", consultationRoutes);
  app.use("/api/users", userRoutes);

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // Serve o frontend buildado (dist/public) e faz fallback de SPA
    const staticPath = path.resolve(__dirname, "public");
    app.use(express.static(staticPath));

    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      res.sendFile(path.join(staticPath, "index.html"));
    });
  }

  // Handler de rota da API não encontrada
  app.use("/api", (_req, res) => {
    res.status(404).json({ message: "Rota não encontrada" });
  });

  const port = process.env.PORT || 5000;

  server.listen(port, () => {
    console.log(`[server] Backend rodando em http://localhost:${port}/`);
  });
}

startServer().catch((error) => {
  console.error("[server] Erro fatal ao iniciar:", error);
  process.exit(1);
});
