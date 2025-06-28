'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, type Bill } from '@/lib/supabase';
import { BILL_CATEGORIES } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Calendar as CalendarIcon, Clock, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { format, isAfter, isBefore, addDays, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function BillReminders() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    due_date: new Date()
  });

  useEffect(() => {
    fetchBills();
  }, []);

  async function fetchBills() {
    try {
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      if (data) setBills(data);
    } catch (error) {
      console.error('Error fetching bills:', error);
      toast.error('Failed to fetch bills');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddBill(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('bills')
        .insert([
          {
            name: formData.name,
            amount: parseFloat(formData.amount),
            category: formData.category,
            due_date: format(formData.due_date, 'yyyy-MM-dd'),
            is_paid: false
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setBills(prev => [...prev, data].sort((a, b) => 
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      ));
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        amount: '',
        category: '',
        due_date: new Date()
      });
      toast.success('Bill reminder added successfully!');
    } catch (error) {
      console.error('Error adding bill:', error);
      toast.error('Failed to add bill reminder');
    }
  }

  async function handleTogglePaid(id: string, isPaid: boolean) {
    try {
      const { error } = await supabase
        .from('bills')
        .update({ is_paid: !isPaid })
        .eq('id', id);

      if (error) throw error;

      setBills(prev => prev.map(bill => 
        bill.id === id ? { ...bill, is_paid: !isPaid } : bill
      ));
      toast.success(isPaid ? 'Bill marked as unpaid' : 'Bill marked as paid');
    } catch (error) {
      console.error('Error updating bill:', error);
      toast.error('Failed to update bill status');
    }
  }

  async function handleDeleteBill(id: string) {
    try {
      const { error } = await supabase
        .from('bills')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBills(prev => prev.filter(bill => bill.id !== id));
      toast.success('Bill reminder deleted successfully!');
    } catch (error) {
      console.error('Error deleting bill:', error);
      toast.error('Failed to delete bill reminder');
    }
  }

  const getBillStatus = (dueDate: string, isPaid: boolean) => {
    if (isPaid) return { status: 'paid', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle };
    
    const due = new Date(dueDate);
    const today = new Date();
    const daysUntilDue = differenceInDays(due, today);
    
    if (daysUntilDue < 0) {
      return { status: 'overdue', color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle };
    } else if (daysUntilDue <= 3) {
      return { status: 'due-soon', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock };
    } else {
      return { status: 'upcoming', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock };
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Utilities': 'bg-blue-100 text-blue-800 border-blue-200',
      'Housing': 'bg-purple-100 text-purple-800 border-purple-200',
      'Insurance': 'bg-green-100 text-green-800 border-green-200',
      'Transportation': 'bg-orange-100 text-orange-800 border-orange-200',
      'Health': 'bg-pink-100 text-pink-800 border-pink-200',
      'Education': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Separate bills by status
  const upcomingBills = bills.filter(bill => !bill.is_paid);
  const paidBills = bills.filter(bill => bill.is_paid);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bill Payment Reminders</h1>
          <p className="text-muted-foreground">
            Stay on top of your recurring bills and never miss a payment.
          </p>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Bill Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Bill Reminder</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddBill} className="space-y-4">
              <div>
                <Label htmlFor="name">Bill Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Electricity Bill"
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
                    {BILL_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.due_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.due_date ? format(formData.due_date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.due_date}
                      onSelect={(date) => date && setFormData(prev => ({ ...prev, due_date: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Add Bill Reminder
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-6 md:grid-cols-3"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Bills</p>
                <p className="text-2xl font-bold">{upcomingBills.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Amount Due</p>
                <p className="text-2xl font-bold">
                  ${upcomingBills.reduce((sum, bill) => sum + Number(bill.amount), 0).toFixed(2)}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paid This Month</p>
                <p className="text-2xl font-bold">{paidBills.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upcoming Bills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bills ({upcomingBills.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingBills.length > 0 ? (
              <div className="space-y-4">
                <AnimatePresence>
                  {upcomingBills.map((bill, index) => {
                    const billStatus = getBillStatus(bill.due_date, bill.is_paid);
                    const StatusIcon = billStatus.icon;
                    const daysUntilDue = differenceInDays(new Date(bill.due_date), new Date());
                    
                    return (
                      <motion.div
                        key={bill.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        className="group flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <Checkbox
                            checked={bill.is_paid}
                            onCheckedChange={() => handleTogglePaid(bill.id, bill.is_paid)}
                          />
                          <div>
                            <p className="font-medium">{bill.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm text-muted-foreground">
                                Due: {format(new Date(bill.due_date), 'MMM dd, yyyy')}
                              </p>
                              <Badge variant="outline" className={billStatus.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {daysUntilDue < 0 ? 'Overdue' : 
                                 daysUntilDue === 0 ? 'Due Today' :
                                 daysUntilDue <= 3 ? `Due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}` :
                                 'Upcoming'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            variant="outline"
                            className={getCategoryColor(bill.category)}
                          >
                            {bill.category}
                          </Badge>
                          <p className="font-semibold text-lg">
                            ${Number(bill.amount).toFixed(2)}
                          </p>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteBill(bill.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No upcoming bills</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add bill reminders to stay organized
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Paid Bills */}
      {paidBills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Paid Bills ({paidBills.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paidBills.map((bill, index) => (
                  <motion.div
                    key={bill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    className="group flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-200 opacity-60"
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={bill.is_paid}
                        onCheckedChange={() => handleTogglePaid(bill.id, bill.is_paid)}
                      />
                      <div>
                        <p className="font-medium line-through">{bill.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {format(new Date(bill.due_date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Paid
                      </Badge>
                      <p className="font-semibold text-lg">
                        ${Number(bill.amount).toFixed(2)}
                      </p>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteBill(bill.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}