import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Dumbbell, Users, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-display text-xl text-foreground">IronPro</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-blue-700">Registrar</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <h1 className="font-display text-5xl md:text-6xl text-foreground leading-tight">
            Gestão de Treinos
            <br />
            <span className="text-primary">Simples e Eficiente</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            IronPro é a plataforma completa para academias e personal trainers gerenciarem treinos, alunos e acompanhamento de forma centralizada.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/register">
              <Button size="lg" className="bg-primary hover:bg-blue-700 gap-2">
                Começar Agora
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="gap-2">
                Já tem conta?
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl text-foreground mb-4">Funcionalidades Principais</h2>
            <p className="text-muted-foreground text-lg">Tudo que você precisa para gerenciar sua academia</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 border border-border rounded-lg hover:border-primary transition-colors">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl text-foreground mb-2">Gestão de Treinos</h3>
              <p className="text-muted-foreground">
                Crie e organize treinos personalizados com exercícios, séries, repetições e cargas.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 border border-border rounded-lg hover:border-primary transition-colors">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl text-foreground mb-2">Gestão de Alunos</h3>
              <p className="text-muted-foreground">
                Atribua treinos aos alunos e acompanhe seu progresso em tempo real.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 border border-border rounded-lg hover:border-primary transition-colors">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl text-foreground mb-2">Acompanhamento</h3>
              <p className="text-muted-foreground">
                Visualize o progresso dos alunos com métricas e histórico de treinos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl text-foreground mb-6">Por que usar IronPro?</h2>
              <div className="space-y-4">
                {[
                  'Centraliza todos os dados em um único lugar',
                  'Elimina o uso de papéis e planilhas',
                  'Facilita a comunicação com alunos',
                  'Acompanhamento em tempo real',
                  'Interface intuitiva e fácil de usar',
                  'Suporte para múltiplos professores',
                ].map((benefit, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                    <p className="text-foreground text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg border border-border">
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Professores Ativos</p>
                  <p className="font-display text-3xl text-primary">150+</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Alunos Registrados</p>
                  <p className="font-display text-3xl text-secondary">2.500+</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Treinos Criados</p>
                  <p className="font-display text-3xl text-primary">5.000+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="font-display text-4xl text-foreground">Pronto para começar?</h2>
          <p className="text-xl text-muted-foreground">
            Crie sua conta agora e comece a gerenciar seus treinos de forma profissional.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/register">
              <Button size="lg" className="bg-primary hover:bg-blue-700 gap-2">
                Criar Conta
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/80">© 2024 IronPro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
