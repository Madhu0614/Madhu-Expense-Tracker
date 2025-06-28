'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/auth/auth-provider';
import { supabase, type Expense } from '@/lib/supabase';
import { EXPENSE_CATEGORIES } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Search, Filter, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ExpenseList() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    purpose: '',
    amount: '',
    category: '',
    date: new Date(),
    description: ''
  });

  useEffect(() => {
    if (!user) return;
    fetchExpenses();
  }, [user]);

  useEffect(() => {
    // Filter expenses based on search and category
    let filtered = expenses;

    if (searchQuery) {
      filtered = filtered.filter(expense =>
        expense.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
    }

    setFilteredExpenses(filtered);
  }, [expenses, searchQuery, selectedCategory]);

  async function fetchExpenses() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      if (data) {
        setExpenses(data);
        setFilteredExpenses(data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddExpense(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([
          {
            purpose: formData.purpose,
            amount: parseFloat(formData.amount),
            category: formData.category,
            date: format(formData.date, 'yyyy-MM-dd'),
            description: formData.description || null,
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setExpenses(prev => [data, ...prev]);
      setIsAddModalOpen(false);
      setFormData({
        purpose: '',
        amount: '',
        category: '',
        date: new Date(),
        description: ''
      });
      toast.success('Expense added successfully!');
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    }
  }

  async function handleDeleteExpense(id: string) {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setExpenses(prev => prev.filter(expense => expense.id !== id));
      toast.success('Expense deleted successfully!');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food': 'bg-orange-100 text-orange-800 border-orange-200',
      'Transportation': 'bg-blue-100 text-blue-800 border-blue-200',
      'Entertainment': 'bg-purple-100 text-purple-800 border-purple-200',
      'Health': 'bg-green-100 text-green-800 border-green-200',
      'Education': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Shopping': 'bg-pink-100 text-pink-800 border-pink-200',
      'Utilities': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Housing': 'bg-gray-100 text-gray-800 border-gray-200',
      'Insurance': 'bg-red-100 text-red-800 border-red-200',
      'Software': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Expense List</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage and track all your expenses in one place.
            </p>
          </div>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                <span className="sm:inline">Add Expense</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md mx-4 sm:mx-0">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <Label htmlFor="purpose">Purpose</Label>
                  <Input
                    id="purpose"
                    value={formData.purpose}
                    onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                    placeholder="What did you spend on?"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Additional details..."
                    rows={3}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="submit" className="flex-1">
                    Add Expense
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 sm:flex-none"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search expenses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {EXPENSE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Expenses List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 text-lg sm:text-xl">
              All Expenses ({filteredExpenses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredExpenses.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                <AnimatePresence>
                  {filteredExpenses.map((expense, index) => (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-200 gap-3 sm:gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{expense.purpose}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <p className="text-xs sm:text-sm text-gray-500">
                                {format(new Date(expense.date), 'MMM dd, yyyy')}
                              </p>
                              {isToday(new Date(expense.date)) && (
                                <Badge variant="outline" className="text-xs">
                                  Today
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        {expense.description && (
                          <p className="text-xs sm:text-sm text-gray-500 mt-2 line-clamp-2">
                            {expense.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-row sm:flex-row items-center justify-between sm:justify-end gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Badge
                            variant="outline"
                            className={`${getCategoryColor(expense.category)} text-xs whitespace-nowrap`}
                          >
                            {expense.category}
                          </Badge>
                          <p className="font-semibold text-base sm:text-lg text-gray-900 whitespace-nowrap">
                            ${Number(expense.amount).toFixed(2)}
                          </p>
                        </div>
                        <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-600 text-base sm:text-lg">No expenses found</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {searchQuery || selectedCategory !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Add your first expense to get started'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}