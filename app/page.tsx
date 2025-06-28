'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/auth-provider';
import { supabase, type Expense, type Budget } from '@/lib/supabase';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingDown, TrendingUp, Calculator, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isToday } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!user) return; 
    
const userId = user.id;

  async function fetchData() {
    try {
      const [expensesResponse, budgetsResponse] = await Promise.all([
        supabase
          .from('expenses')
          .select('*')
          .eq('user_id', userId) 
          .order('created_at', { ascending: false }),
        supabase
          .from('budgets')
          .select('*')
          .eq('user_id', userId)
      ]);

      if (expensesResponse.data) setExpenses(expensesResponse.data);
      if (budgetsResponse.data) setBudgets(budgetsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, [user]);


  // Calculate statistics
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= monthStart && expenseDate <= monthEnd;
  });

  const totalMonthlyExpense = monthlyExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const totalBudget = budgets.reduce((sum, budget) => sum + Number(budget.amount), 0);
  const remainingBudget = totalBudget - totalMonthlyExpense;
  const averageDailySpend = monthlyExpenses.length > 0 ? totalMonthlyExpense / new Date().getDate() : 0;

  // Latest 10 expenses
  const latestExpenses = expenses.slice(0, 10);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food': 'bg-orange-100/80 text-orange-800 border-orange-200/50',
      'Transportation': 'bg-blue-100/80 text-blue-800 border-blue-200/50',
      'Entertainment': 'bg-purple-100/80 text-purple-800 border-purple-200/50',
      'Health': 'bg-green-100/80 text-green-800 border-green-200/50',
      'Education': 'bg-indigo-100/80 text-indigo-800 border-indigo-200/50',
      'Shopping': 'bg-pink-100/80 text-pink-800 border-pink-200/50',
      'Utilities': 'bg-yellow-100/80 text-yellow-800 border-yellow-200/50',
      'Housing': 'bg-gray-100/80 text-gray-800 border-gray-200/50',
      'Insurance': 'bg-red-100/80 text-red-800 border-red-200/50',
      'Software': 'bg-cyan-100/80 text-cyan-800 border-cyan-200/50',
    };
    return colors[category] || 'bg-gray-100/80 text-gray-800 border-gray-200/50';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center lg:text-left"
      >
        <motion.div
          className="flex items-center gap-2 sm:gap-3 justify-center lg:justify-start mb-3 sm:mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Financial Dashboard
          </h1>
        </motion.div>
        <motion.p 
          className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 px-4 sm:px-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Welcome back, {user?.email?.split('@')[0]}! Here's your expense overview for{' '}
          <span className="font-semibold text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
        </motion.p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <StatCard
            title="Monthly Expense"
            value={`$${totalMonthlyExpense.toFixed(2)}`}
            description={`${monthlyExpenses.length} transactions this month`}
            icon={DollarSign}
            trend={{ value: 12, isPositive: false }}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <StatCard
            title="Budget Used"
            value={`${totalBudget > 0 ? ((totalMonthlyExpense / totalBudget) * 100).toFixed(1) : 0}%`}
            description={`$${totalMonthlyExpense.toFixed(2)} of $${totalBudget.toFixed(2)}`}
            icon={TrendingUp}
            trend={{ value: 8, isPositive: false }}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <StatCard
            title="Remaining Budget"
            value={`$${remainingBudget.toFixed(2)}`}
            description={remainingBudget >= 0 ? "Within budget" : "Over budget"}
            icon={TrendingDown}
            trend={{ value: 5, isPositive: remainingBudget >= 0 }}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <StatCard
            title="Daily Average"
            value={`$${averageDailySpend.toFixed(2)}`}
            description="Average spending per day"
            icon={Calculator}
            trend={{ value: 3, isPositive: true }}
          />
        </motion.div>
      </motion.div>

      {/* Recent Expenses */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
      >
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader className="pb-3 sm:pb-4">
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-gray-900 text-lg sm:text-xl">
                <motion.div
                  className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </motion.div>
                Recent Expenses
              </CardTitle>
              
              <motion.div
                className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-gray-700 cursor-pointer group"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <span className="text-sm">View all</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </motion.div>
          </CardHeader>
          
          <CardContent className="space-y-2 sm:space-y-3">
            {latestExpenses.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {latestExpenses.map((expense, index) => (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.6 + (index * 0.05),
                      ease: "easeOut"
                    }}
                    whileHover={{ 
                      scale: 1.01, 
                      x: 4,
                      transition: { type: "spring", stiffness: 300, damping: 30 }
                    }}
                    className="group flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 group-hover:text-gray-800 transition-colors text-sm sm:text-base truncate">
                            {expense.purpose}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs sm:text-sm text-gray-500">
                              {format(new Date(expense.date), 'MMM dd, yyyy')}
                            </p>
                            {isToday(new Date(expense.date)) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full font-medium"
                              >
                                Today
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                      {expense.description && (
                        <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2 line-clamp-1">
                          {expense.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 ml-2 sm:ml-4">
                      <Badge
                        variant="secondary"
                        className={`${getCategoryColor(expense.category)} backdrop-blur-sm font-medium text-xs whitespace-nowrap`}
                      >
                        {expense.category}
                      </Badge>
                      <motion.p 
                        className="font-bold text-base sm:text-xl text-gray-900 whitespace-nowrap"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        ${Number(expense.amount).toFixed(2)}
                      </motion.p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="text-center py-8 sm:py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <motion.div
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center border border-blue-200"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                </motion.div>
                <p className="text-gray-700 text-base sm:text-lg font-medium">No expenses found</p>
                <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
                  Start tracking your expenses to see them here
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}