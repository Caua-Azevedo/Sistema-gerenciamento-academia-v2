import { Request, Response } from "express";
import { Workout } from "../models/Workout.js";

export async function listWorkouts(_req: Request, res: Response) {
  try {
    const workouts = await Workout.find().sort({ createdAt: -1 });
    return res.json({ workouts: workouts.map((w) => w.toJSON()) });
  } catch (error) {
    console.error("[workouts] list error", error);
    return res.status(500).json({ message: "Erro ao buscar treinos" });
  }
}

export async function getWorkout(req: Request, res: Response) {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: "Treino não encontrado" });
    }
    return res.json({ workout: workout.toJSON() });
  } catch (error) {
    return res.status(404).json({ message: "Treino não encontrado" });
  }
}

export async function createWorkout(req: Request, res: Response) {
  try {
    const { name, description, exercises } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Nome e descrição são obrigatórios" });
    }

    if (!Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({ message: "Adicione pelo menos um exercício" });
    }

    for (const ex of exercises) {
      if (!ex.name || !ex.series || !ex.reps) {
        return res.status(400).json({ message: "Todos os exercícios precisam de nome, séries e repetições" });
      }
    }

    const normalizedExercises = exercises.map((ex: any, index: number) => ({
      id: ex.id?.toString() || `${Date.now()}-${index}`,
      name: ex.name,
      series: Number(ex.series),
      reps: Number(ex.reps),
      weight: ex.weight !== undefined && ex.weight !== "" ? Number(ex.weight) : undefined,
      notes: ex.notes || undefined,
    }));

    const workout = await Workout.create({
      name,
      description,
      teacherId: req.user!.id,
      teacherName: req.user!.name,
      exercises: normalizedExercises,
      assignedStudents: Array.isArray(req.body.assignedStudents) ? req.body.assignedStudents : [],
    });

    return res.status(201).json({ workout: workout.toJSON() });
  } catch (error: any) {
    if (error?.name === "ValidationError") {
      const message = Object.values(error.errors)[0] as any;
      return res.status(400).json({ message: message?.message || "Dados inválidos" });
    }
    console.error("[workouts] create error", error);
    return res.status(500).json({ message: "Erro ao criar treino" });
  }
}

export async function updateWorkout(req: Request, res: Response) {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: "Treino não encontrado" });
    }

    if (workout.teacherId !== req.user!.id) {
      return res.status(403).json({ message: "Você só pode editar seus próprios treinos" });
    }

    const { name, description, exercises, assignedStudents } = req.body;

    if (name !== undefined) workout.name = name;
    if (description !== undefined) workout.description = description;
    if (Array.isArray(exercises)) {
      workout.exercises = exercises.map((ex: any, index: number) => ({
        id: ex.id?.toString() || `${Date.now()}-${index}`,
        name: ex.name,
        series: Number(ex.series),
        reps: Number(ex.reps),
        weight: ex.weight !== undefined && ex.weight !== "" ? Number(ex.weight) : undefined,
        notes: ex.notes || undefined,
      }));
    }
    if (Array.isArray(assignedStudents)) workout.assignedStudents = assignedStudents;

    await workout.save();
    return res.json({ workout: workout.toJSON() });
  } catch (error: any) {
    if (error?.name === "ValidationError") {
      const message = Object.values(error.errors)[0] as any;
      return res.status(400).json({ message: message?.message || "Dados inválidos" });
    }
    console.error("[workouts] update error", error);
    return res.status(500).json({ message: "Erro ao atualizar treino" });
  }
}

export async function deleteWorkout(req: Request, res: Response) {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: "Treino não encontrado" });
    }

    if (workout.teacherId !== req.user!.id) {
      return res.status(403).json({ message: "Você só pode deletar seus próprios treinos" });
    }

    await workout.deleteOne();
    return res.json({ message: "Treino deletado com sucesso", id: req.params.id });
  } catch (error) {
    console.error("[workouts] delete error", error);
    return res.status(500).json({ message: "Erro ao deletar treino" });
  }
}

export async function assignWorkout(req: Request, res: Response) {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ message: "studentId é obrigatório" });
    }

    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: "Treino não encontrado" });
    }

    if (workout.teacherId !== req.user!.id) {
      return res.status(403).json({ message: "Você só pode atribuir seus próprios treinos" });
    }

    if (!workout.assignedStudents.includes(studentId)) {
      workout.assignedStudents.push(studentId);
      await workout.save();
    }

    return res.json({ workout: workout.toJSON() });
  } catch (error) {
    console.error("[workouts] assign error", error);
    return res.status(500).json({ message: "Erro ao atribuir treino" });
  }
}
