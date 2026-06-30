import mongoose, { Schema, Document } from "mongoose";

export type ConsultationStatus = "pending" | "accepted" | "rejected";

export interface IConsultation extends Document {
  studentId: string;
  studentName: string;
  teacherId?: string;
  status: ConsultationStatus;
  message: string;
}

const consultationSchema = new Schema<IConsultation>(
  {
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    teacherId: { type: String },
    status: {
      type: String,
      enum: {
        values: ["pending", "accepted", "rejected"],
        message: "Status inválido",
      },
      default: "pending",
    },
    message: {
      type: String,
      required: [true, "Mensagem é obrigatória"],
      trim: true,
      minlength: [1, "Mensagem não pode ser vazia"],
      maxlength: [500, "Mensagem deve ter no máximo 500 caracteres"],
    },
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

export const Consultation = mongoose.model<IConsultation>("Consultation", consultationSchema);
