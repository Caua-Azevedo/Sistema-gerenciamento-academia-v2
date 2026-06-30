import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, Lock, Dumbbell } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'student' | 'teacher'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password, userType);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-lg mb-4">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl text-foreground">IronPro</h1>
          <p className="text-muted-foreground mt-2">Gestão de Treinos para Academias</p>
        </div>

        <Card className="border border-border shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Bem-vindo</CardTitle>
            <CardDescription>Faça login para acessar sua conta</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Tipo de Usuário</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType('student')}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                      userType === 'student'
                        ? 'border-primary bg-blue-50 text-primary'
                        : 'border-border bg-white text-foreground hover:border-primary'
                    }`}
                  >
                    Aluno
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('teacher')}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                      userType === 'teacher'
                        ? 'border-primary bg-blue-50 text-primary'
                        : 'border-border bg-white text-foreground hover:border-primary'
                    }`}
                  >
                    Professor
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-2 h-10"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>

              {/* Register Link */}
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Não tem conta? </span>
                <a href="/register" className="text-primary font-medium hover:underline">
                  Criar conta
                </a>
              </div>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3 font-medium">Credenciais de Demonstração:</p>
              <div className="space-y-2 text-xs">
                <div>
                  <p className="font-medium text-foreground">Aluno:</p>
                  <p className="text-muted-foreground">Email: aluno@ironpro.com</p>
                  <p className="text-muted-foreground">Senha: 123456</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Professor:</p>
                  <p className="text-muted-foreground">Email: professor@ironpro.com</p>
                  <p className="text-muted-foreground">Senha: 123456</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
