'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  CreditCard, 
  DollarSign, 
  Home, 
  Receipt, 
  Settings,
  TrendingUp,
  Wallet,
  LogOut,
  User
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Bills', href: '/bills', icon: CreditCard },
  { name: 'Subscriptions', href: '/subscriptions', icon: Wallet },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-slate-200 shadow-lg">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <TrendingUp className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-slate-900">ExpenseFlow</span>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user?.email}
            </p>
            <p className="text-xs text-slate-500">Personal Account</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                  isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-slate-200 p-4 space-y-4">
        <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
            <DollarSign className="h-4 w-4 text-slate-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">Total Balance</p>
            <p className="text-lg font-bold text-green-600">$12,450.00</p>
          </div>
        </div>
        
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="w-full gap-2 text-slate-600 hover:text-slate-900"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}