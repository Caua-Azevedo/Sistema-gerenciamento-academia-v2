import { Request, Response } from "express";
import { User } from "../models/User.js";

export async function listUsers(req: Request, res: Response) {
  try {
    const { type } = req.query;

    const filter: Record<string, unknown> = {};
    if (type === "student" || type === "teacher" || type === "admin") {
      filter.type = type;
    }

    const users = await User.find(filter).select("-password").sort({ name: 1 });
    return res.json({ users: users.map((u) => u.toJSON()) });
  } catch (error) {
    console.error("[users] list error", error);
    return res.status(500).json({ message: "Erro ao buscar usuários" });
  }
}
