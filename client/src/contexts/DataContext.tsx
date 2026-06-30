import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from './AuthContext';

export interface Exercise {
  id: string;
  name: string;
  series: number;
  reps: number;
  weight?: number;
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  teacherName: string;
  exercises: Exercise[];
  createdAt: string;
  assignedStudents?: string[];
}

export interface ConsultationRequest {
  id: string;
  studentId: string;
  studentName: string;
  teacherId?: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
  createdAt: string;
}

interface DataContextType {
  workouts: Workout[];
  consultationRequests: ConsultationRequest[];
  addWorkout: (workout: Workout) => void;
  updateWorkout: (id: string, workout: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  assignWorkoutToStudent: (workoutId: string, studentId: string) => void;
  addConsultationRequest: (request: ConsultationRequest) => void;
  updateConsultationRequest: (id: string, status: 'accepted' | 'rejected') => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([]);

  // Busca os dados reais da API sempre que o usuário autentica
  useEffect(() => {
    if (!isAuthenticated) {
      setWorkouts([]);
      setConsultationRequests([]);
      return;
    }

    const loadData = async () => {
      try {
        const [workoutsRes, consultationsRes] = await Promise.all([
          api.get('/workouts'),
          api.get('/consultations'),
        ]);
        setWorkouts(workoutsRes.data.workouts);
        setConsultationRequests(consultationsRes.data.consultations);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();
  }, [isAuthenticated]);

  const addWorkout = (workout: Workout) => {
    // Atualização otimista para resposta imediata na UI
    setWorkouts((prev) => [workout, ...prev]);

    api
      .post('/workouts', workout)
      .then(({ data }) => {
        setWorkouts((prev) => prev.map((w) => (w.id === workout.id ? data.workout : w)));
      })
      .catch((error) => {
        console.error('Erro ao criar treino:', error);
        setWorkouts((prev) => prev.filter((w) => w.id !== workout.id));
      });
  };

  const updateWorkout = (id: string, updates: Partial<Workout>) => {
    setWorkouts((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));

    api
      .put(`/workouts/${id}`, updates)
      .then(({ data }) => {
        setWorkouts((prev) => prev.map((w) => (w.id === id ? data.workout : w)));
      })
      .catch((error) => {
        console.error('Erro ao atualizar treino:', error);
      });
  };

  const deleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));

    api.delete(`/workouts/${id}`).catch((error) => {
      console.error('Erro ao deletar treino:', error);
    });
  };

  const assignWorkoutToStudent = (workoutId: string, studentId: string) => {
    setWorkouts((prev) =>
      prev.map((w) => {
        if (w.id === workoutId) {
          const assignedStudents = w.assignedStudents || [];
          if (!assignedStudents.includes(studentId)) {
            return { ...w, assignedStudents: [...assignedStudents, studentId] };
          }
        }
        return w;
      }),
    );

    api.patch(`/workouts/${workoutId}/assign`, { studentId }).catch((error) => {
      console.error('Erro ao atribuir treino:', error);
    });
  };

  const addConsultationRequest = (request: ConsultationRequest) => {
    setConsultationRequests((prev) => [request, ...prev]);

    api
      .post('/consultations', request)
      .then(({ data }) => {
        setConsultationRequests((prev) => prev.map((r) => (r.id === request.id ? data.consultation : r)));
      })
      .catch((error) => {
        console.error('Erro ao enviar solicitação:', error);
        setConsultationRequests((prev) => prev.filter((r) => r.id !== request.id));
      });
  };

  const updateConsultationRequest = (id: string, status: 'accepted' | 'rejected') => {
    setConsultationRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

    api.patch(`/consultations/${id}`, { status }).catch((error) => {
      console.error('Erro ao atualizar solicitação:', error);
    });
  };

  return (
    <DataContext.Provider
      value={{
        workouts,
        consultationRequests,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        assignWorkoutToStudent,
        addConsultationRequest,
        updateConsultationRequest,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
}
