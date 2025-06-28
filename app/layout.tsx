import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth/auth-provider';
import { MainLayout } from '@/components/layout/main-layout';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ExpenseFlow - Smart Expense Tracker',
  description: 'Track, analyze, and manage your expenses with beautiful insights and smart reminders.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}