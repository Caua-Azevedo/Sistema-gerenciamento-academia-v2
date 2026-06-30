import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./../config/db.js";
import { seedDemoData } from "./seed.js";

dotenv.config();

async function run() {
  await connectDB();
  await seedDemoData();
  await mongoose.disconnect();
  console.log("[seed] Finalizado.");
  process.exit(0);
}

run().catch((error) => {
  console.error("[seed] Erro:", error);
  process.exit(1);
});
