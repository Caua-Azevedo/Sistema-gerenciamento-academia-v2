import { useData } from '@/contexts/DataContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Dumbbell, Clock, Info } from 'lucide-react';
import { Link, useRoute } from 'wouter';

export default function WorkoutDetails() {
  const [, params] = useRoute('/workouts/:id');
  const { workouts } = useData();
  
  const workout = workouts.find(w => w.id === params?.id);

  if (!workout) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold">Treino não encontrado</h2>
          <Link href="/dashboard">
            <Button className="mt-4">Voltar para o Dashboard</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="font-display text-3xl text-foreground">{workout.name}</h1>
            <p className="text-muted-foreground">Professor: {workout.teacherName}</p>
          </div>
        </div>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Descrição do Treino
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{workout.description}</p>
          </CardContent>
        </Card>

        {/* Exercises List */}
        <div className="space-y-4">
          <h2 className="font-heading text-xl flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-primary" />
            Exercícios ({workout.exercises.length})
          </h2>
          
          <div className="grid gap-4">
            {workout.exercises.map((exercise, index) => (
              <Card key={exercise.id || index} className="overflow-hidden border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground mb-1">{exercise.name}</h3>
                      {exercise.notes && (
                        <p className="text-sm text-muted-foreground italic mb-2">
                          "{exercise.notes}"
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="bg-muted px-3 py-2 rounded-lg flex items-center gap-2">
                        <span className="font-bold text-primary">{exercise.series}</span>
                        <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">Séries</span>
                      </div>
                      <div className="bg-muted px-3 py-2 rounded-lg flex items-center gap-2">
                        <span className="font-bold text-primary">{exercise.reps}</span>
                        <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">Reps</span>
                      </div>
                      {exercise.weight && (
                        <div className="bg-muted px-3 py-2 rounded-lg flex items-center gap-2">
                          <span className="font-bold text-primary">{exercise.weight}kg</span>
                          <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">Carga</span>
                        </div>
                      )}
                      {exercise.restTime && (
                        <div className="bg-muted px-3 py-2 rounded-lg flex items-center gap-2">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="font-bold text-primary">{exercise.restTime}s</span>
                          <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">Descanso</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
