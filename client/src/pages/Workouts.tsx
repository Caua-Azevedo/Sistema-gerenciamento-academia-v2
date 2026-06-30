import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Link } from 'wouter';
import { Trash2, Edit2, Plus, Dumbbell, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  email: string;
}

export default function Workouts() {
  const { user } = useAuth();
  const { workouts, deleteWorkout, assignWorkoutToStudent } = useData();
  const [students, setStudents] = useState<Student[]>([]);
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.type !== 'teacher') return;
    api
      .get('/users', { params: { type: 'student' } })
      .then(({ data }) => setStudents(data.users))
      .catch((error) => console.error('Erro ao buscar alunos:', error));
  }, [user]);

  if (!user || user.type !== 'teacher') {
    return null;
  }

  const myWorkouts = workouts.filter(w => w.teacherId === user.id);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja deletar o treino "${name}"?`)) {
      deleteWorkout(id);
      toast.success('Treino deletado com sucesso!');
    }
  };

  const getStudentName = (studentId: string) => {
    return students.find((s) => s.id === studentId)?.name || `Aluno ${studentId.slice(0, 4)}`;
  };

  const handleAssign = (workoutId: string, studentId: string, studentName: string) => {
    assignWorkoutToStudent(workoutId, studentId);
    toast.success(`Treino atribuído a ${studentName}!`);
    setOpenDialogId(null);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-foreground">Meus Treinos</h1>
            <p className="text-muted-foreground mt-1">Gerencie todos os seus treinos</p>
          </div>
          <Link href="/workouts/new">
            <Button className="bg-primary hover:bg-blue-700 gap-2">
              <Plus className="w-4 h-4" />
              Novo Treino
            </Button>
          </Link>
        </div>

        {/* Workouts List */}
        {myWorkouts.length === 0 ? (
          <Card className="border border-border">
            <CardContent className="pt-12 pb-12 text-center">
              <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-heading text-lg text-foreground mb-2">Nenhum treino criado</h3>
              <p className="text-muted-foreground mb-6">Comece criando seu primeiro treino</p>
              <Link href="/workouts/new">
                <Button className="bg-primary hover:bg-blue-700">
                  Criar Primeiro Treino
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myWorkouts.map((workout) => (
              <Card key={workout.id} className="border border-border hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{workout.name}</CardTitle>
                      <CardDescription className="mt-1">{workout.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/workouts/${workout.id}/edit`}>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-1 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(workout.id, workout.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Exercises */}
                  <div>
                    <h4 className="font-medium text-sm text-foreground mb-3">Exercícios ({workout.exercises.length})</h4>
                    <div className="space-y-2">
                      {workout.exercises.map((exercise) => (
                        <div key={exercise.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium text-sm text-foreground">{exercise.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {exercise.series}x{exercise.reps} {exercise.weight && `@ ${exercise.weight}kg`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assigned Students */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm text-foreground">
                        Alunos Atribuídos: {workout.assignedStudents?.length || 0}
                      </h4>
                      <Dialog
                        open={openDialogId === workout.id}
                        onOpenChange={(open) => setOpenDialogId(open ? workout.id : null)}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="gap-1">
                            <UserPlus className="w-4 h-4" />
                            Atribuir
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Atribuir treino a um aluno</DialogTitle>
                            <DialogDescription>
                              Selecione um aluno para atribuir o treino "{workout.name}"
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-2 max-h-80 overflow-y-auto">
                            {students.length === 0 ? (
                              <p className="text-sm text-muted-foreground text-center py-6">
                                Nenhum aluno cadastrado ainda
                              </p>
                            ) : (
                              students.map((student) => {
                                const alreadyAssigned = workout.assignedStudents?.includes(student.id);
                                return (
                                  <button
                                    key={student.id}
                                    type="button"
                                    disabled={alreadyAssigned}
                                    onClick={() => handleAssign(workout.id, student.id, student.name)}
                                    className={`w-full text-left p-3 rounded-lg border transition-colors flex items-center justify-between ${
                                      alreadyAssigned
                                        ? 'border-border bg-muted text-muted-foreground cursor-not-allowed'
                                        : 'border-border hover:border-primary hover:bg-blue-50'
                                    }`}
                                  >
                                    <div>
                                      <p className="font-medium text-sm text-foreground">{student.name}</p>
                                      <p className="text-xs text-muted-foreground">{student.email}</p>
                                    </div>
                                    {alreadyAssigned && (
                                      <span className="text-xs font-medium text-primary">Já atribuído</span>
                                    )}
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    {workout.assignedStudents && workout.assignedStudents.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {workout.assignedStudents.map((studentId) => (
                          <span key={studentId} className="px-2 py-1 bg-blue-50 text-primary text-xs rounded-full font-medium">
                            {getStudentName(studentId)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Nenhum aluno atribuído ainda</p>
                    )}
                  </div>

                  {/* Action Button */}
                  <Link href={`/workouts/${workout.id}`}>
                    <Button variant="outline" className="w-full">
                      Ver Detalhes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
