import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function Consultations() {
  const { user } = useAuth();
  const { consultationRequests, updateConsultationRequest } = useData();

  if (!user || user.type !== 'teacher') {
    return null;
  }

  const handleAccept = (id: string, studentName: string) => {
    updateConsultationRequest(id, 'accepted');
    toast.success(`Consultoria com ${studentName} aceita!`);
  };

  const handleReject = (id: string, studentName: string) => {
    updateConsultationRequest(id, 'rejected');
    toast.info(`Consultoria com ${studentName} recusada`);
  };

  const pendingRequests = consultationRequests.filter(r => r.status === 'pending');
  const acceptedRequests = consultationRequests.filter(r => r.status === 'accepted');
  const rejectedRequests = consultationRequests.filter(r => r.status === 'rejected');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'accepted':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'accepted':
        return 'Aceita';
      case 'rejected':
        return 'Recusada';
      default:
        return status;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl text-foreground">Solicitações de Consultoria</h1>
          <p className="text-muted-foreground mt-1">Gerencie as solicitações de consultoria dos alunos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold text-foreground">{pendingRequests.length}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aceitas</p>
                  <p className="text-2xl font-bold text-foreground">{acceptedRequests.length}</p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Recusadas</p>
                  <p className="text-2xl font-bold text-foreground">{rejectedRequests.length}</p>
                </div>
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-heading text-xl text-foreground">Solicitações Pendentes</h2>
            {pendingRequests.map((request) => (
              <Card key={request.id} className="border border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-heading text-lg text-foreground">{request.studentName}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{request.message}</p>
                      </div>
                      <Badge className={`${getStatusColor('pending')} border`}>
                        {getStatusLabel('pending')}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAccept(request.id, request.studentName)}
                        className="flex-1 bg-secondary hover:bg-green-600 text-white gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Aceitar
                      </Button>
                      <Button
                        onClick={() => handleReject(request.id, request.studentName)}
                        variant="outline"
                        className="flex-1 gap-2"
                      >
                        <X className="w-4 h-4" />
                        Recusar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Accepted Requests */}
        {acceptedRequests.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-heading text-xl text-foreground">Solicitações Aceitas</h2>
            {acceptedRequests.map((request) => (
              <Card key={request.id} className="border border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-heading text-lg text-foreground">{request.studentName}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{request.message}</p>
                    </div>
                    <Badge className={`${getStatusColor('accepted')} border`}>
                      {getStatusLabel('accepted')}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Rejected Requests */}
        {rejectedRequests.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-heading text-xl text-foreground">Solicitações Recusadas</h2>
            {rejectedRequests.map((request) => (
              <Card key={request.id} className="border border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-heading text-lg text-foreground">{request.studentName}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{request.message}</p>
                    </div>
                    <Badge className={`${getStatusColor('rejected')} border`}>
                      {getStatusLabel('rejected')}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {consultationRequests.length === 0 && (
          <Card className="border border-border">
            <CardContent className="pt-12 pb-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-heading text-lg text-foreground mb-2">Nenhuma solicitação</h3>
              <p className="text-muted-foreground">Você não tem solicitações de consultoria no momento</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
