import { Request, Response } from "express";
import { Consultation } from "../models/Consultation.js";

export async function listConsultations(_req: Request, res: Response) {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    return res.json({ consultations: consultations.map((c) => c.toJSON()) });
  } catch (error) {
    console.error("[consultations] list error", error);
    return res.status(500).json({ message: "Erro ao buscar solicitações" });
  }
}

export async function getConsultation(req: Request, res: Response) {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ message: "Solicitação não encontrada" });
    }
    return res.json({ consultation: consultation.toJSON() });
  } catch (error) {
    return res.status(404).json({ message: "Solicitação não encontrada" });
  }
}

export async function createConsultation(req: Request, res: Response) {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Escreva uma mensagem para sua solicitação" });
    }

    if (message.length > 500) {
      return res.status(400).json({ message: "A mensagem deve ter no máximo 500 caracteres" });
    }

    const consultation = await Consultation.create({
      studentId: req.user!.id,
      studentName: req.user!.name,
      message,
      status: "pending",
    });

    return res.status(201).json({ consultation: consultation.toJSON() });
  } catch (error: any) {
    if (error?.name === "ValidationError") {
      const m = Object.values(error.errors)[0] as any;
      return res.status(400).json({ message: m?.message || "Dados inválidos" });
    }
    console.error("[consultations] create error", error);
    return res.status(500).json({ message: "Erro ao enviar solicitação" });
  }
}

export async function updateConsultationStatus(req: Request, res: Response) {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status deve ser 'accepted' ou 'rejected'" });
    }

    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ message: "Solicitação não encontrada" });
    }

    consultation.status = status;
    consultation.teacherId = req.user!.id;
    await consultation.save();

    return res.json({ consultation: consultation.toJSON() });
  } catch (error) {
    console.error("[consultations] update error", error);
    return res.status(500).json({ message: "Erro ao atualizar solicitação" });
  }
}

export async function deleteConsultation(req: Request, res: Response) {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ message: "Solicitação não encontrada" });
    }
    await consultation.deleteOne();
    return res.json({ message: "Solicitação deletada com sucesso", id: req.params.id });
  } catch (error) {
    console.error("[consultations] delete error", error);
    return res.status(500).json({ message: "Erro ao deletar solicitação" });
  }
}
