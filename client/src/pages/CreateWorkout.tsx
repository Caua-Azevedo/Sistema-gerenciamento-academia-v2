import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData, Exercise, Workout } from '@/contexts/DataContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';

export default function CreateWorkout() {
  const { user } = useAuth();
  const { addWorkout } = useData();
  const [, navigate] = useLocation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: '1', name: '', series: 3, reps: 10, weight: 0 }
  ]);

  if (!user || user.type !== 'teacher') {
    return null;
  }

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: '',
      series: 3,
      reps: 10,
      weight: 0,
    };
    setExercises([...exercises, newExercise]);
  };

  const updateExercise = (id: string, field: keyof Exercise, value: any) => {
    setExercises(exercises.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeExercise = (id: string) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter(e => e.id !== id));
    } else {
      toast.error('Você precisa ter pelo menos um exercício');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description) {
      toast.error('Preencha o nome e descrição do treino');
      return;
    }

    if (exercises.some(e => !e.name)) {
      toast.error('Todos os exercícios precisam ter um nome');
      return;
    }

    const newWorkout: Workout = {
      id: Date.now().toString(),
      name,
      description,
      teacherId: user.id,
      teacherName: user.name,
      exercises,
      createdAt: new Date().toISOString(),
      assignedStudents: [],
    };

    addWorkout(newWorkout);
    toast.success('Treino criado com sucesso!');
    navigate('/workouts');
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/workouts')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-3xl text-foreground">Criar Novo Treino</h1>
            <p className="text-muted-foreground mt-1">Preencha os detalhes do seu treino</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Nome e descrição do treino</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Treino</Label>
                <Input
                  id="name"
                  placeholder="Ex: Treino de Peito e Tríceps"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Ex: Treino focado em desenvolvimento de peito e tríceps"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Exercises */}
          <Card className="border border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Exercícios</CardTitle>
                <CardDescription>Adicione os exercícios do treino</CardDescription>
              </div>
              <Button 
                type="button"
                onClick={addExercise}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {exercises.map((exercise, index) => (
                <div key={exercise.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm text-foreground">Exercício {index + 1}</span>
                    {exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExercise(exercise.id)}
                        className="text-destructive hover:bg-red-50 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 space-y-2">
                      <Label className="text-xs">Nome do Exercício</Label>
                      <Input
                        placeholder="Ex: Supino Reto"
                        value={exercise.name}
                        onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Séries</Label>
                      <Input
                        type="number"
                        min="1"
                        value={exercise.series}
                        onChange={(e) => updateExercise(exercise.id, 'series', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Repetições</Label>
                      <Input
                        type="number"
                        min="1"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(exercise.id, 'reps', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="col-span-2 space-y-2">
                      <Label className="text-xs">Peso (kg) - Opcional</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="Ex: 100"
                        value={exercise.weight || ''}
                        onChange={(e) => updateExercise(exercise.id, 'weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </div>

                    <div className="col-span-2 space-y-2">
                      <Label className="text-xs">Notas - Opcional</Label>
                      <Input
                        placeholder="Ex: Manter ritmo controlado"
                        value={exercise.notes || ''}
                        onChange={(e) => updateExercise(exercise.id, 'notes', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              type="button"
              variant="outline"
              onClick={() => navigate('/workouts')}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-primary hover:bg-blue-700"
            >
              Criar Treino
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
