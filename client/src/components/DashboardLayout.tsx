import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigationItems = user?.type === 'teacher' 
    ? [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Meus Treinos', href: '/workouts' },
        { label: 'Solicitações', href: '/consultations' },
        { label: 'Alunos', href: '/students' },
      ]
    : [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Meus Treinos', href: '/my-workouts' },
        { label: 'Solicitar Consultoria', href: '/request-consultation' },
        { label: 'Progresso', href: '/progress' },
      ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 ease-out bg-white border-r border-border overflow-hidden flex flex-col`}>
        <div className="p-6 border-b border-border">
          <h1 className="font-display text-2xl text-primary">IronPro</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestão de Treinos</p>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a className="block px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors duration-200 font-medium">
                {item.label}
              </a>
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t border-border bg-white">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={user?.avatar} 
              alt={user?.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button 
            onClick={logout}
            variant="outline"
            size="sm"
            className="w-full justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
          </button>
          <div className="text-center">
            <h2 className="font-heading text-lg text-foreground">IronPro</h2>
          </div>
          <div className="w-10" />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
