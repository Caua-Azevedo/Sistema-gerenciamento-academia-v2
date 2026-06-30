import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/academia";

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri);
    console.log("[mongo] Conectado ao MongoDB com sucesso");
  } catch (error) {
    console.error("[mongo] Falha ao conectar ao MongoDB:", error);
    process.exit(1);
  }
}
