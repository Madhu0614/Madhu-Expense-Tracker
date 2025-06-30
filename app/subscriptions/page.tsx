'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, type Subscription } from '@/lib/supabase';
import { SUBSCRIPTION_CATEGORIES, BILLING_CYCLES } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Plus, Calendar as CalendarIcon, Repeat, DollarSign, TrendingUp, Trash2, Pause, Play } from 'lucide-react';
import { format, addMonths, addWeeks, addYears, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    billing_cycle: 'monthly',
    next_payment: new Date()
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  async function fetchSubscriptions() {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('next_payment', { ascending: true });

      if (error) throw error;
      if (data) setSubscriptions(data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSubscription(e: React.FormEvent) {
  e.preventDefault();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([
        {
          user_id: user.id, 
          name: formData.name,
          amount: parseFloat(formData.amount),
          category: formData.category,
          billing_cycle: formData.billing_cycle,
          next_payment: format(formData.next_payment, 'yyyy-MM-dd'),
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    setSubscriptions((prev) =>
      [...prev, data].sort(
        (a, b) => new Date(a.next_payment).getTime() - new Date(b.next_payment).getTime()
      )
    );

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      amount: '',
      category: '',
      billing_cycle: 'monthly',
      next_payment: new Date(),
    });

    toast.success('Subscription added successfully!');
  } catch (error) {
    console.error('Error adding subscription:', error);
    toast.error('Failed to add subscription');
  }
}


  async function handleToggleActive(id: string, isActive: boolean) {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      setSubscriptions(prev => prev.map(sub => 
        sub.id === id ? { ...sub, is_active: !isActive } : sub
      ));
      toast.success(isActive ? 'Subscription paused' : 'Subscription activated');
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('Failed to update subscription status');
    }
  }

  async function handleDeleteSubscription(id: string) {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSubscriptions(prev => prev.filter(sub => sub.id !== id));
      toast.success('Subscription deleted successfully!');
    } catch (error) {
      console.error('Error deleting subscription:', error);
      toast.error('Failed to delete subscription');
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Entertainment': 'bg-purple-100 text-purple-800 border-purple-200',
      'Software': 'bg-blue-100 text-blue-800 border-blue-200',
      'Shopping': 'bg-pink-100 text-pink-800 border-pink-200',
      'Health': 'bg-green-100 text-green-800 border-green-200',
      'Education': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'News': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getBillingCycleColor = (cycle: string) => {
    const colors: Record<string, string> = {
      'weekly': 'bg-green-100 text-green-800 border-green-200',
      'monthly': 'bg-blue-100 text-blue-800 border-blue-200',
      'quarterly': 'bg-orange-100 text-orange-800 border-orange-200',
      'yearly': 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[cycle] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Calculate totals
  const activeSubscriptions = subscriptions.filter(sub => sub.is_active);
  const monthlyTotal = activeSubscriptions.reduce((sum, sub) => {
    const amount = Number(sub.amount);
    switch (sub.billing_cycle) {
      case 'weekly': return sum + (amount * 4.33); // average weeks per month
      case 'quarterly': return sum + (amount / 3);
      case 'yearly': return sum + (amount / 12);
      default: return sum + amount; // monthly
    }
  }, 0);

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
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Subscriptions</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage all your recurring subscriptions in one place.
            </p>
          </div>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Add Subscription
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md mx-4 sm:mx-0">
              <DialogHeader>
                <DialogTitle>Add New Subscription</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSubscription} className="space-y-4">
                <div>
                  <Label htmlFor="name">Subscription Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Netflix, Spotify"
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
                      {SUBSCRIPTION_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="billing_cycle">Billing Cycle</Label>
                  <Select
                    value={formData.billing_cycle}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, billing_cycle: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      {BILLING_CYCLES.map((cycle) => (
                        <SelectItem key={cycle} value={cycle}>
                          {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Next Payment Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.next_payment && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.next_payment ? format(formData.next_payment, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.next_payment}
                        onSelect={(date) => date && setFormData(prev => ({ ...prev, next_payment: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="submit" className="flex-1">
                    Add Subscription
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

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3"
      >
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                <p className="text-xl sm:text-2xl font-bold">{activeSubscriptions.length}</p>
              </div>
              <Repeat className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Total</p>
                <p className="text-xl sm:text-2xl font-bold">${monthlyTotal.toFixed(2)}</p>
              </div>
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Annual Cost</p>
                <p className="text-xl sm:text-2xl font-bold">${(monthlyTotal * 12).toFixed(2)}</p>
              </div>
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Subscriptions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">All Subscriptions ({subscriptions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {subscriptions.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                <AnimatePresence>
                  {subscriptions.map((subscription, index) => {
                    const daysUntilPayment = differenceInDays(new Date(subscription.next_payment), new Date());
                    
                    return (
                      <motion.div
                        key={subscription.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        className={cn(
                          "group flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-200 gap-3 sm:gap-4",
                          !subscription.is_active && "opacity-60"
                        )}
                      >
                        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                          <Switch
                            checked={subscription.is_active}
                            onCheckedChange={() => handleToggleActive(subscription.id, subscription.is_active)}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "font-medium text-sm sm:text-base truncate",
                              !subscription.is_active && "line-through"
                            )}>
                              {subscription.name}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                Next payment: {format(new Date(subscription.next_payment), 'MMM dd, yyyy')}
                              </p>
                              {daysUntilPayment <= 7 && subscription.is_active && (
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                                  {daysUntilPayment === 0 ? 'Due Today' : 
                                   daysUntilPayment === 1 ? 'Due Tomorrow' :
                                   `Due in ${daysUntilPayment} days`}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row sm:flex-row items-center justify-between sm:justify-end gap-3 sm:gap-4">
                          <div className="flex flex-col items-start sm:items-end gap-1">
                            <Badge
                              variant="outline"
                              className={`${getCategoryColor(subscription.category)} text-xs`}
                            >
                              {subscription.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`${getBillingCycleColor(subscription.billing_cycle)} text-xs`}
                            >
                              {subscription.billing_cycle}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-base sm:text-lg">
                              ${Number(subscription.amount).toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              per {subscription.billing_cycle.replace('ly', '')}
                            </p>
                          </div>
                          <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleActive(subscription.id, subscription.is_active)}
                              className="h-8 w-8 p-0"
                            >
                              {subscription.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteSubscription(subscription.id)}
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
              <div className="text-center py-8 sm:py-12">
                <p className="text-muted-foreground text-base sm:text-lg">No subscriptions found</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Add your subscriptions to track your recurring expenses
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}