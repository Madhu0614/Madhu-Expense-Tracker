'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { AuthForm } from '@/components/auth/auth-form';
import { Sidebar } from './sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar for desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0 border-r border-slate-200 bg-white shadow-sm">
        <Sidebar />
      </div>

      {/* Sidebar overlay and drawer for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
          bg-white shadow-md lg:hidden
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
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
          <div className="w-9 sm:w-10" /> {/* spacer */}
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-3 sm:px-4 py-4 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
