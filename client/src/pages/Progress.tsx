import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, Calendar, CheckCircle2, Award } from 'lucide-react';

export default function Progress() {
  const { user } = useAuth();
  const { workouts } = useData();

  if (!user || user.type !== 'student') {
    return null;
  }

  const myWorkouts = workouts.filter(w => w.assignedStudents?.includes(user.id));
  
  // Como o sistema não tem persistência de histórico ainda, 
  // vamos simular alguns dados baseados nos treinos atribuídos
  const totalWorkouts = myWorkouts.length;
  const completedThisWeek = Math.min(totalWorkouts, 3); 
  const completionRate = totalWorkouts > 0 ? 75 : 0;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="font-display text-3xl text-foreground">Meu Progresso</h1>
          <p className="text-muted-foreground mt-1">Acompanhe sua evolução e consistência</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Treinos Concluídos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedThisWeek}</div>
              <p className="text-xs text-muted-foreground mt-1">Nesta semana</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Taxa de Adesão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">Frequência média</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                Nível Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Bronze</div>
              <p className="text-xs text-muted-foreground mt-1">15 dias seguidos</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Chart Simulation */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Semanal</CardTitle>
            <CardDescription>Sua frequência de treinos nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full flex items-end justify-between gap-2 pt-4">
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map((day, i) => {
                const height = [60, 0, 80, 40, 90, 20, 0][i];
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-primary/20 rounded-t-sm transition-all hover:bg-primary/40 relative group"
                      style={{ height: `${height}%` }}
                    >
                      {height > 0 && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Concluído
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{day}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Próximos Objetivos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-primary">1</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Completar 5 treinos na semana</p>
                  <div className="w-full bg-muted h-2 rounded-full mt-1">
                    <div className="bg-primary h-full rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-primary">2</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Manter consistência por 30 dias</p>
                  <div className="w-full bg-muted h-2 rounded-full mt-1">
                    <div className="bg-primary h-full rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dica de Evolução</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800 leading-relaxed">
                  "A consistência é mais importante que a intensidade no início. Tente não faltar mais de dois dias seguidos para manter o hábito ativo!"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
