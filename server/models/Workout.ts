import mongoose, { Schema, Document } from "mongoose";

export interface IExercise {
  id: string;
  name: string;
  series: number;
  reps: number;
  weight?: number;
  notes?: string;
}

export interface IWorkout extends Document {
  name: string;
  description: string;
  teacherId: string;
  teacherName: string;
  exercises: IExercise[];
  assignedStudents: string[];
}

const exerciseSchema = new Schema<IExercise>(
  {
    id: { type: String, required: true },
    name: {
      type: String,
      required: [true, "Nome do exercício é obrigatório"],
      trim: true,
    },
    series: {
      type: Number,
      required: [true, "Número de séries é obrigatório"],
      min: [1, "Séries deve ser no mínimo 1"],
    },
    reps: {
      type: Number,
      required: [true, "Número de repetições é obrigatório"],
      min: [1, "Repetições deve ser no mínimo 1"],
    },
    weight: { type: Number, min: 0 },
    notes: { type: String, trim: true },
  },
  { _id: false },
);

const workoutSchema = new Schema<IWorkout>(
  {
    name: {
      type: String,
      required: [true, "Nome do treino é obrigatório"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Descrição do treino é obrigatória"],
      trim: true,
    },
    teacherId: { type: String, required: true },
    teacherName: { type: String, required: true },
    exercises: {
      type: [exerciseSchema],
      validate: {
        validator: (arr: IExercise[]) => Array.isArray(arr) && arr.length > 0,
        message: "O treino precisa de pelo menos um exercício",
      },
    },
    assignedStudents: { type: [String], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id.toString();
        ret.createdAt = ret.createdAt?.toISOString?.() ?? ret.createdAt;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const Workout = mongoose.model<IWorkout>("Workout", workoutSchema);
