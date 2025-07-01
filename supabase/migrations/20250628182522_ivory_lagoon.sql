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

