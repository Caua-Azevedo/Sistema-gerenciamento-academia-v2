import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Dumbbell, Users, FileText, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { workouts, consultationRequests } = useData();

  if (!user) {
    return null;
  }

  const isTeacher = user.type === 'teacher';
  const studentWorkouts = workouts.filter(w => w.assignedStudents?.includes(user.id));
  const pendingRequests = consultationRequests.filter(r => r.status === 'pending');

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-blue-700 rounded-lg p-8 text-white">
          <h1 className="font-display text-3xl mb-2">Bem-vindo, {user.name}!</h1>
          <p className="text-blue-100">
            {isTeacher 
              ? 'Gerencie seus treinos e alunos de forma eficiente'
              : 'Acompanhe seu progresso e siga seus treinos'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isTeacher ? (
            <>
              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-primary" />
                    Meus Treinos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {workouts.filter(w => w.teacherId === user.id).length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Treinos criados</p>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4 text-secondary" />
                    Alunos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {new Set(workouts.filter(w => w.teacherId === user.id).flatMap(w => w.assignedStudents || [])).size}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Alunos ativos</p>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" />
                    Solicitações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {pendingRequests.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Pendentes</p>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    Atividade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">85%</div>
                  <p className="text-xs text-muted-foreground mt-1">Taxa de conclusão</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-primary" />
                    Meus Treinos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {studentWorkouts.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Treinos atribuídos</p>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4 text-secondary" />
                    Professores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {new Set(studentWorkouts.map(w => w.teacherId)).size}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Professores</p>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" />
                    Consultoria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {consultationRequests.filter(r => r.studentId === user.id).length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Solicitações</p>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    Progresso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">72%</div>
                  <p className="text-xs text-muted-foreground mt-1">Treinos concluídos</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isTeacher ? (
            <>
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Criar Novo Treino</CardTitle>
                  <CardDescription>Adicione um novo treino para seus alunos</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/workouts/new">
                    <Button className="w-full bg-primary hover:bg-blue-700">
                      Novo Treino
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Solicitações de Consultoria</CardTitle>
                  <CardDescription>Visualize as solicitações pendentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/consultations">
                    <Button variant="outline" className="w-full">
                      Ver Solicitações ({pendingRequests.length})
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Meus Treinos</CardTitle>
                  <CardDescription>Visualize todos os treinos atribuídos</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/my-workouts">
                    <Button className="w-full bg-primary hover:bg-blue-700">
                      Ver Treinos ({studentWorkouts.length})
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Solicitar Consultoria</CardTitle>
                  <CardDescription>Peça uma consultoria com um professor</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/request-consultation">
                    <Button variant="outline" className="w-full">
                      Solicitar Consultoria
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
