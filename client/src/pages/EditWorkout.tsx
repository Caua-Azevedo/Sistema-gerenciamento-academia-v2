import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData, Exercise } from '@/contexts/DataContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocation, useParams } from 'wouter';
import { toast } from 'sonner';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';

export default function EditWorkout() {
  const { user } = useAuth();
  const { workouts, updateWorkout } = useData();
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();

  const workout = workouts.find((w) => w.id === params.id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Preenche o formulário assim que o treino é encontrado no contexto
  useEffect(() => {
    if (workout && !loaded) {
      setName(workout.name);
      setDescription(workout.description);
      setExercises(workout.exercises);
      setLoaded(true);
    }
  }, [workout, loaded]);

  if (!user || user.type !== 'teacher') {
    return null;
  }

  if (!workout) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card className="border border-border">
            <CardContent className="pt-12 pb-12 text-center">
              <h3 className="font-heading text-lg text-foreground mb-2">Treino não encontrado</h3>
              <p className="text-muted-foreground mb-6">Este treino não existe ou foi removido</p>
              <Button onClick={() => navigate('/workouts')} className="bg-primary hover:bg-blue-700">
                Voltar para Meus Treinos
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (workout.teacherId !== user.id) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card className="border border-border">
            <CardContent className="pt-12 pb-12 text-center">
              <h3 className="font-heading text-lg text-foreground mb-2">Acesso negado</h3>
              <p className="text-muted-foreground mb-6">Você só pode editar treinos criados por você</p>
              <Button onClick={() => navigate('/workouts')} className="bg-primary hover:bg-blue-700">
                Voltar para Meus Treinos
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
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
    setExercises(exercises.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const removeExercise = (id: string) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((e) => e.id !== id));
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

    if (exercises.some((e) => !e.name)) {
      toast.error('Todos os exercícios precisam ter um nome');
      return;
    }

    updateWorkout(workout.id, { name, description, exercises });
    toast.success('Treino atualizado com sucesso!');
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
            <h1 className="font-display text-3xl text-foreground">Editar Treino</h1>
            <p className="text-muted-foreground mt-1">Atualize os detalhes do seu treino</p>
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
                <CardDescription>Adicione ou edite os exercícios do treino</CardDescription>
              </div>
              <Button type="button" onClick={addExercise} variant="outline" size="sm" className="gap-2">
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
                        onChange={(e) =>
                          updateExercise(exercise.id, 'weight', e.target.value ? parseFloat(e.target.value) : undefined)
                        }
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
            <Button type="button" variant="outline" onClick={() => navigate('/workouts')} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-blue-700">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
