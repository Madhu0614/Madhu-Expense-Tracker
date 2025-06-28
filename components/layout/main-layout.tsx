'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { AuthForm } from '@/components/auth/auth-form';
import { Sidebar } from './sidebar';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-sm px-4 shadow-sm lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="text-slate-700 hover:text-slate-900 p-2"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          <h1 className="text-base sm:text-lg font-semibold text-slate-900">ExpenseFlow</h1>
          <div className="w-9 sm:w-10" /> {/* Spacer for centering */}
        </div>

        {/* Page content */}
        <main className="min-h-screen">
          <div className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}