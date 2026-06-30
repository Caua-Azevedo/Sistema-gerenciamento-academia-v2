import { User } from "../models/User.js";
import { Workout } from "../models/Workout.js";
import { Consultation } from "../models/Consultation.js";

/**
 * Popula o banco com dados de demonstração na primeira execução,
 * preservando as credenciais já anunciadas na tela de Login do frontend.
 */
export async function seedDemoData() {
  const existingUsers = await User.countDocuments();
  if (existingUsers > 0) {
    return;
  }

  console.log("[seed] Nenhum usuário encontrado. Criando dados de demonstração...");

  const teacher = await User.create({
    name: "Prof. Carlos",
    email: "professor@ironpro.com",
    password: "123456",
    type: "teacher",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=professor",
  });

  const student = await User.create({
    name: "João Silva",
    email: "aluno@ironpro.com",
    password: "123456",
    type: "student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
  });

  await Workout.create({
    name: "Treino de Peito e Tríceps",
    description: "Treino focado em desenvolvimento de peito e tríceps",
    teacherId: teacher.id,
    teacherName: teacher.name,
    exercises: [
      { id: "1", name: "Supino Reto", series: 4, reps: 8, weight: 100 },
      { id: "2", name: "Supino Inclinado", series: 3, reps: 10, weight: 80 },
      { id: "3", name: "Rosca Tríceps", series: 3, reps: 12, weight: 40 },
    ],
    assignedStudents: [student.id],
  });

  await Workout.create({
    name: "Treino de Costas e Bíceps",
    description: "Treino para desenvolvimento de costas e bíceps",
    teacherId: teacher.id,
    teacherName: teacher.name,
    exercises: [
      { id: "4", name: "Puxada Frontal", series: 4, reps: 8, weight: 80 },
      { id: "5", name: "Rosca Direta", series: 3, reps: 10, weight: 30 },
      { id: "6", name: "Remada Curvada", series: 3, reps: 8, weight: 60 },
    ],
    assignedStudents: [],
  });

  await Consultation.create({
    studentId: student.id,
    studentName: student.name,
    message: "Gostaria de uma consultoria sobre nutrição e treino",
    status: "pending",
  });

  console.log("[seed] Dados de demonstração criados com sucesso!");
  console.log("[seed] Aluno: aluno@ironpro.com / 123456");
  console.log("[seed] Professor: professor@ironpro.com / 123456");
}
