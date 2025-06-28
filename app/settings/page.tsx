'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  DollarSign, 
  Bell, 
  Palette, 
  Shield, 
  Download,
  Upload,
  Trash2,
  Save,
  Moon,
  Sun
} from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const [settings, setSettings] = useState({
    profile: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      currency: 'USD',
      timezone: 'America/New_York'
    },
    budget: {
      monthlyBudget: '2000',
      budgetAlerts: true,
      overspendWarning: 80
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      billReminders: true,
      subscriptionAlerts: true,
      reminderDays: 3
    },
    appearance: {
      theme: 'system',
      compactMode: false,
      showCategories: true
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      crashReports: true
    }
  });

  const currencies = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'AUD', label: 'Australian Dollar (A$)' }
  ];

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'UTC', label: 'UTC' }
  ];

  const handleSave = () => {
    // Here you would typically save to backend/localStorage
    toast.success('Settings saved successfully!');
  };

  const handleExportData = () => {
    toast.success('Data export started! You\'ll receive an email when ready.');
  };

  const handleImportData = () => {
    toast.info('Data import functionality coming soon!');
  };

  const handleResetData = () => {
    toast.error('This would permanently delete all your data!');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Customize your expense tracking experience.
        </p>
      </motion.div>

      {/* Profile Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
              Profile & Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div>
                <Label htmlFor="name" className="text-sm">Full Name</Label>
                <Input
                  id="name"
                  value={settings.profile.name}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    profile: { ...prev.profile, name: e.target.value }
                  }))}
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    profile: { ...prev.profile, email: e.target.value }
                  }))}
                  className="text-sm"
                />
              </div>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div>
                <Label htmlFor="currency" className="text-sm">Default Currency</Label>
                <Select
                  value={settings.profile.currency}
                  onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    profile: { ...prev.profile, currency: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timezone" className="text-sm">Timezone</Label>
                <Select
                  value={settings.profile.timezone}
                  onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    profile: { ...prev.profile, timezone: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Budget Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
              Budget Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div>
                <Label htmlFor="monthlyBudget" className="text-sm">Monthly Budget</Label>
                <Input
                  id="monthlyBudget"
                  type="number"
                  step="0.01"
                  value={settings.budget.monthlyBudget}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    budget: { ...prev.budget, monthlyBudget: e.target.value }
                  }))}
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="overspendWarning" className="text-sm">Overspend Warning (%)</Label>
                <Input
                  id="overspendWarning"
                  type="number"
                  min="1"
                  max="100"
                  value={settings.budget.overspendWarning}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    budget: { ...prev.budget, overspendWarning: parseInt(e.target.value) }
                  }))}
                  className="text-sm"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="budgetAlerts" className="text-sm">Budget Alerts</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Get notified when approaching budget limits
                </p>
              </div>
              <Switch
                id="budgetAlerts"
                checked={settings.budget.budgetAlerts}
                onCheckedChange={(checked) => setSettings(prev => ({
                  ...prev,
                  budget: { ...prev.budget, budgetAlerts: checked }
                }))}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Email Notifications</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, emailNotifications: checked }
                  }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Push Notifications</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Receive browser push notifications
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, pushNotifications: checked }
                  }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Bill Reminders</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Get reminders before bill due dates
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.billReminders}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, billReminders: checked }
                  }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Subscription Alerts</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Notifications for subscription renewals
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.subscriptionAlerts}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, subscriptionAlerts: checked }
                  }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="reminderDays" className="text-sm">Reminder Days Before Due Date</Label>
              <Input
                id="reminderDays"
                type="number"
                min="1"
                max="30"
                value={settings.notifications.reminderDays}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, reminderDays: parseInt(e.target.value) }
                }))}
                className="w-24 text-sm"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appearance Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme" className="text-sm">Theme</Label>
              <Select
                value={settings.appearance.theme}
                onValueChange={(value) => setSettings(prev => ({
                  ...prev,
                  appearance: { ...prev.appearance, theme: value }
                }))}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Compact Mode</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Use smaller spacing and components
                  </p>
                </div>
                <Switch
                  checked={settings.appearance.compactMode}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    appearance: { ...prev.appearance, compactMode: checked }
                  }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Show Category Colors</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Display colored badges for categories
                  </p>
                </div>
                <Switch
                  checked={settings.appearance.showCategories}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    appearance: { ...prev.appearance, showCategories: checked }
                  }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy & Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Data Sharing</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Share anonymized data to improve the service
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.dataSharing}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, dataSharing: checked }
                  }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Analytics</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Help us understand how you use the app
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.analytics}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, analytics: checked }
                  }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Crash Reports</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Automatically send crash reports to help fix bugs
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.crashReports}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, crashReports: checked }
                  }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
              
              <Button onClick={handleExportData} className="gap-2 text-sm">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button onClick={handleImportData} variant="outline" className="gap-2 text-sm">
                <Upload className="h-4 w-4" />
                Import Data
              </Button>
              <Button onClick={handleResetData} variant="destructive" className="gap-2 text-sm">
                <Trash2 className="h-4 w-4" />
                Reset All Data
              </Button>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
              <p>• Export: Download all your data in JSON format</p>
              <p>• Import: Upload previously exported data</p>
              <p>• Reset: Permanently delete all expenses, bills, and subscriptions</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex justify-end"
      >
        <Button onClick={handleSave} size="lg" className="gap-2 w-full sm:w-auto">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </motion.div>
    </div>
  );
}