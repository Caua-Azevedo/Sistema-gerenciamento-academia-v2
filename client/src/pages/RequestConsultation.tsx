import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function RequestConsultation() {
  const { user } = useAuth();
  const { addConsultationRequest } = useData();
  const [, navigate] = useLocation();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!user || user.type !== 'student') {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error('Escreva uma mensagem para sua solicitação');
      return;
    }

    setIsLoading(true);
    try {
      const newRequest = {
        id: Date.now().toString(),
        studentId: user.id,
        studentName: user.name,
        status: 'pending' as const,
        message,
        createdAt: new Date().toISOString(),
      };

      addConsultationRequest(newRequest);
      toast.success('Solicitação enviada com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erro ao enviar solicitação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-3xl text-foreground">Solicitar Consultoria</h1>
            <p className="text-muted-foreground mt-1">Peça orientação a um professor</p>
          </div>
        </div>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info Card */}
            <Card className="border border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <p className="text-sm text-blue-900">
                  Sua solicitação será enviada aos professores disponíveis. Eles poderão aceitar ou recusar sua solicitação.
                </p>
              </CardContent>
            </Card>

            {/* Consultation Request Form */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Detalhes da Solicitação</CardTitle>
                <CardDescription>Descreva o que você gostaria de consultar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Seu Nome</Label>
                  <Input
                    id="name"
                    type="text"
                    value={user.name}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Seu Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem *</Label>
                  <textarea
                    id="message"
                    placeholder="Descreva o que você gostaria de consultar. Ex: Tenho dúvidas sobre a execução correta dos exercícios de peito..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    {message.length}/500 caracteres
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-primary hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar Solicitação'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
