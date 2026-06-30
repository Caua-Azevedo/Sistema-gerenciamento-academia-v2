import { Request, Response } from "express";
import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, type } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Preencha todos os campos obrigatórios" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "A senha deve ter no mínimo 6 caracteres" });
    }

    if (type && !["student", "teacher"].includes(type)) {
      return res.status(400).json({ message: "Tipo de usuário inválido" });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: "Já existe uma conta com este email" });
    }

    const user = await User.create({
      name,
      email,
      password,
      type: type || "student",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
    });

    const token = signToken({ id: user.id, email: user.email, type: user.type, name: user.name });

    return res.status(201).json({ user: user.toJSON(), token });
  } catch (error: any) {
    if (error?.name === "ValidationError") {
      const message = Object.values(error.errors)[0] as any;
      return res.status(400).json({ message: message?.message || "Dados inválidos" });
    }
    console.error("[auth] register error", error);
    return res.status(500).json({ message: "Erro ao criar conta" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Informe email e senha" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    const token = signToken({ id: user.id, email: user.email, type: user.type, name: user.name });

    return res.json({ user: user.toJSON(), token });
  } catch (error) {
    console.error("[auth] login error", error);
    return res.status(500).json({ message: "Erro ao fazer login" });
  }
}

export async function me(req: Request, res: Response) {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    return res.json({ user: user.toJSON() });
  } catch (error) {
    console.error("[auth] me error", error);
    return res.status(500).json({ message: "Erro ao buscar usuário" });
  }
}
