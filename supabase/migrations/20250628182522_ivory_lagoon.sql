/*
  # Expense Tracker Database Schema

  1. New Tables
    - `expenses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `purpose` (text, expense purpose/title)
      - `amount` (decimal, expense amount)
      - `category` (text, expense category)
      - `date` (date, expense date)
      - `description` (text, optional description)
      - `created_at` (timestamp)
    
    - `bills`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text, bill name)
      - `amount` (decimal, bill amount)
      - `due_date` (date, monthly due date)
      - `category` (text, bill category)
      - `is_paid` (boolean, payment status)
      - `created_at` (timestamp)
    
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text, subscription name)
      - `amount` (decimal, monthly cost)
      - `billing_cycle` (text, billing frequency)
      - `next_payment` (date, next payment date)
      - `category` (text, subscription category)
      - `is_active` (boolean, subscription status)
      - `created_at` (timestamp)
    
    - `budgets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `category` (text, budget category)
      - `amount` (decimal, budget limit)
      - `period` (text, budget period)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data

  3. Sample Data
    - Insert sample expenses, bills, and subscriptions for demo (with dummy user_id)
*/

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  purpose text NOT NULL,
  amount decimal(10,2) NOT NULL,
  category text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create bills table
CREATE TABLE IF NOT EXISTS bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  amount decimal(10,2) NOT NULL,
  due_date date NOT NULL,
  category text NOT NULL DEFAULT 'Utilities',
  is_paid boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  amount decimal(10,2) NOT NULL,
  billing_cycle text DEFAULT 'monthly',
  next_payment date NOT NULL,
  category text DEFAULT 'Entertainment',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  category text NOT NULL,
  amount decimal(10,2) NOT NULL,
  period text DEFAULT 'monthly',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Create policies for expenses
CREATE POLICY "Users can read own expenses"
  ON expenses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON expenses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for bills
CREATE POLICY "Users can read own bills"
  ON bills
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bills"
  ON bills
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bills"
  ON bills
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bills"
  ON bills
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for subscriptions
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions"
  ON subscriptions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for budgets
CREATE POLICY "Users can read own budgets"
  ON budgets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets"
  ON budgets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets"
  ON budgets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets"
  ON budgets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create a dummy user ID for sample data (this would normally be a real user ID from auth.users)
DO $$
DECLARE
  dummy_user_id uuid := '6a96cad8-d86e-4043-a648-387f98a4dd54';
BEGIN
  -- Insert sample expenses
  INSERT INTO expenses (user_id, purpose, amount, category, date, description) VALUES
    (dummy_user_id, 'Grocery Shopping', 85.50, 'Food', CURRENT_DATE - INTERVAL '1 day', 'Weekly grocery shopping at supermarket'),
    (dummy_user_id, 'Gas Station', 45.00, 'Transportation', CURRENT_DATE - INTERVAL '2 days', 'Fuel for car'),
    (dummy_user_id, 'Coffee Shop', 12.50, 'Food', CURRENT_DATE - INTERVAL '3 days', 'Morning coffee and pastry'),
    (dummy_user_id, 'Online Course', 99.99, 'Education', CURRENT_DATE - INTERVAL '4 days', 'Web development course'),
    (dummy_user_id, 'Restaurant Dinner', 67.80, 'Food', CURRENT_DATE - INTERVAL '5 days', 'Dinner with friends'),
    (dummy_user_id, 'Gym Membership', 29.99, 'Health', CURRENT_DATE - INTERVAL '6 days', 'Monthly gym subscription'),
    (dummy_user_id, 'Book Purchase', 24.99, 'Education', CURRENT_DATE - INTERVAL '7 days', 'Programming books'),
    (dummy_user_id, 'Movie Theater', 35.00, 'Entertainment', CURRENT_DATE - INTERVAL '8 days', 'Movie tickets for two'),
    (dummy_user_id, 'Pharmacy', 18.75, 'Health', CURRENT_DATE - INTERVAL '9 days', 'Vitamins and supplements'),
    (dummy_user_id, 'Uber Ride', 22.50, 'Transportation', CURRENT_DATE - INTERVAL '10 days', 'Ride to downtown'),
    (dummy_user_id, 'Clothing Store', 125.00, 'Shopping', CURRENT_DATE - INTERVAL '11 days', 'New work shirts'),
    (dummy_user_id, 'Internet Bill', 79.99, 'Utilities', CURRENT_DATE - INTERVAL '12 days', 'Monthly internet service');

  -- Insert sample bills
  INSERT INTO bills (user_id, name, amount, due_date, category, is_paid) VALUES
    (dummy_user_id, 'Electricity Bill', 120.50, DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '15 days', 'Utilities', false),
    (dummy_user_id, 'Water Bill', 45.25, DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '20 days', 'Utilities', false),
    (dummy_user_id, 'Rent Payment', 1200.00, DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 day', 'Housing', true),
    (dummy_user_id, 'Phone Bill', 55.00, DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '10 days', 'Utilities', false),
    (dummy_user_id, 'Internet Service', 79.99, DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '25 days', 'Utilities', false),
    (dummy_user_id, 'Car Insurance', 145.00, DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '5 days', 'Insurance', true);

  -- Insert sample subscriptions
  INSERT INTO subscriptions (user_id, name, amount, billing_cycle, next_payment, category, is_active) VALUES
    (dummy_user_id, 'Netflix', 15.99, 'monthly', CURRENT_DATE + INTERVAL '10 days', 'Entertainment', true),
    (dummy_user_id, 'Spotify Premium', 9.99, 'monthly', CURRENT_DATE + INTERVAL '15 days', 'Entertainment', true),
    (dummy_user_id, 'Adobe Creative Suite', 52.99, 'monthly', CURRENT_DATE + INTERVAL '5 days', 'Software', true),
    (dummy_user_id, 'Amazon Prime', 14.99, 'monthly', CURRENT_DATE + INTERVAL '20 days', 'Shopping', true),
    (dummy_user_id, 'YouTube Premium', 11.99, 'monthly', CURRENT_DATE + INTERVAL '8 days', 'Entertainment', true),
    (dummy_user_id, 'Dropbox Pro', 9.99, 'monthly', CURRENT_DATE + INTERVAL '12 days', 'Software', true);

  -- Insert sample budgets
  INSERT INTO budgets (user_id, category, amount, period) VALUES
    (dummy_user_id, 'Food', 400.00, 'monthly'),
    (dummy_user_id, 'Transportation', 200.00, 'monthly'),
    (dummy_user_id, 'Entertainment', 100.00, 'monthly'),
    (dummy_user_id, 'Shopping', 150.00, 'monthly'),
    (dummy_user_id, 'Health', 80.00, 'monthly'),
    (dummy_user_id, 'Education', 50.00, 'monthly');
END $$;