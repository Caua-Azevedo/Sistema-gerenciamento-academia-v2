import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';

export default function MyWorkouts() {
  const { user } = useAuth();
  const { workouts } = useData();

  if (!user || user.type !== 'student') {
    return null;
  }

  const myWorkouts = workouts.filter(w => w.assignedStudents?.includes(user.id));

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl text-foreground">Meus Treinos</h1>
          <p className="text-muted-foreground mt-1">Treinos atribuídos pelos seus professores</p>
        </div>

        {/* Workouts List */}
        {myWorkouts.length === 0 ? (
          <Card className="border border-border">
            <CardContent className="pt-12 pb-12 text-center">
              <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-heading text-lg text-foreground mb-2">Nenhum treino atribuído</h3>
              <p className="text-muted-foreground">Aguarde seu professor atribuir um treino para você</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {myWorkouts.map((workout) => (
              <Card key={workout.id} className="border border-border hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-heading text-xl text-foreground">{workout.name}</h3>
                        <span className="px-2 py-1 bg-blue-50 text-primary text-xs rounded-full font-medium">
                          {workout.exercises.length} exercícios
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-4">{workout.description}</p>

                      {/* Professor Info */}
                      <div className="mb-4 p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Professor</p>
                        <p className="font-medium text-sm text-foreground">{workout.teacherName}</p>
                      </div>

                      {/* Exercises Preview */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-foreground">Exercícios:</p>
                        <div className="space-y-2">
                          {workout.exercises.slice(0, 3).map((exercise) => (
                            <div key={exercise.id} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                              <span className="text-foreground font-medium">{exercise.name}</span>
                              <span className="text-muted-foreground">
                                {exercise.series}x{exercise.reps} {exercise.weight && `@ ${exercise.weight}kg`}
                              </span>
                            </div>
                          ))}
                        </div>
                        {workout.exercises.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{workout.exercises.length - 3} exercícios
                          </p>
                        )}
                      </div>
                    </div>

                    <Link href={`/workouts/${workout.id}`}>
                      <Button variant="outline" size="sm" className="gap-2 ml-4">
                        Ver Detalhes
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
