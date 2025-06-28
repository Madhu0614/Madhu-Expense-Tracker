/*
  # Expense Tracker Database Schema

  1. New Tables
    - `expenses`
      - `id` (uuid, primary key)
      - `purpose` (text, expense purpose/title)
      - `amount` (decimal, expense amount)
      - `category` (text, expense category)
      - `date` (date, expense date)
      - `description` (text, optional description)
      - `created_at` (timestamp)
    
    - `bills`
      - `id` (uuid, primary key)
      - `name` (text, bill name)
      - `amount` (decimal, bill amount)
      - `due_date` (date, monthly due date)
      - `category` (text, bill category)
      - `is_paid` (boolean, payment status)
      - `created_at` (timestamp)
    
    - `subscriptions`
      - `id` (uuid, primary key)
      - `name` (text, subscription name)
      - `amount` (decimal, monthly cost)
      - `billing_cycle` (text, billing frequency)
      - `next_payment` (date, next payment date)
      - `category` (text, subscription category)
      - `is_active` (boolean, subscription status)
      - `created_at` (timestamp)
    
    - `budgets`
      - `id` (uuid, primary key)
      - `category` (text, budget category)
      - `amount` (decimal, budget limit)
      - `period` (text, budget period)
      - `created_at` (timestamp)

  2. Security
    - RLS is disabled for all tables (public access)
    - No authentication required

  3. Sample Data
    - Insert sample expenses, bills, and subscriptions for demo
*/

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
  category text NOT NULL,
  amount decimal(10,2) NOT NULL,
  period text DEFAULT 'monthly',
  created_at timestamptz DEFAULT now()
);

-- Insert sample expenses
INSERT INTO expenses (purpose, amount, category, date, description) VALUES
  ('Grocery Shopping', 85.50, 'Food', CURRENT_DATE - INTERVAL '1 day', 'Weekly grocery shopping at supermarket'),
  ('Gas Station', 45.00, 'Transportation', CURRENT_DATE - INTERVAL '2 days', 'Fuel for car'),
  ('Coffee Shop', 12.50, 'Food', CURRENT_DATE - INTERVAL '3 days', 'Morning coffee and pastry'),
  ('Online Course', 99.99, 'Education', CURRENT_DATE - INTERVAL '4 days', 'Web development course'),
  ('Restaurant Dinner', 67.80, 'Food', CURRENT_DATE - INTERVAL '5 days', 'Dinner with friends'),
  ('Gym Membership', 29.99, 'Health', CURRENT_DATE - INTERVAL '6 days', 'Monthly gym subscription'),
  ('Book Purchase', 24.99, 'Education', CURRENT_DATE - INTERVAL '7 days', 'Programming books'),
  ('Movie Theater', 35.00, 'Entertainment', CURRENT_DATE - INTERVAL '8 days', 'Movie tickets for two'),
  ('Pharmacy', 18.75, 'Health', CURRENT_DATE - INTERVAL '9 days', 'Vitamins and supplements'),
  ('Uber Ride', 22.50, 'Transportation', CURRENT_DATE - INTERVAL '10 days', 'Ride to downtown'),
  ('Clothing Store', 125.00, 'Shopping', CURRENT_DATE - INTERVAL '11 days', 'New work shirts'),
  ('Internet Bill', 79.99, 'Utilities', CURRENT_DATE - INTERVAL '12 days', 'Monthly internet service');

-- Insert sample bills
INSERT INTO bills (name, amount, due_date, category, is_paid) VALUES
  ('Electricity Bill', 120.50, DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '15 days', 'Utilities', false),
  ('Water Bill', 45.25, DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '20 days', 'Utilities', false),
  ('Rent Payment', 1200.00, DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 day', 'Housing', true),
  ('Phone Bill', 55.00, DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '10 days', 'Utilities', false),
  ('Internet Service', 79.99, DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '25 days', 'Utilities', false),
  ('Car Insurance', 145.00, DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '5 days', 'Insurance', true);

-- Insert sample subscriptions
INSERT INTO subscriptions (name, amount, billing_cycle, next_payment, category, is_active) VALUES
  ('Netflix', 15.99, 'monthly', CURRENT_DATE + INTERVAL '10 days', 'Entertainment', true),
  ('Spotify Premium', 9.99, 'monthly', CURRENT_DATE + INTERVAL '15 days', 'Entertainment', true),
  ('Adobe Creative Suite', 52.99, 'monthly', CURRENT_DATE + INTERVAL '5 days', 'Software', true),
  ('Amazon Prime', 14.99, 'monthly', CURRENT_DATE + INTERVAL '20 days', 'Shopping', true),
  ('YouTube Premium', 11.99, 'monthly', CURRENT_DATE + INTERVAL '8 days', 'Entertainment', true),
  ('Dropbox Pro', 9.99, 'monthly', CURRENT_DATE + INTERVAL '12 days', 'Software', true);

-- Insert sample budgets
INSERT INTO budgets (category, amount, period) VALUES
  ('Food', 400.00, 'monthly'),
  ('Transportation', 200.00, 'monthly'),
  ('Entertainment', 100.00, 'monthly'),
  ('Shopping', 150.00, 'monthly'),
  ('Health', 80.00, 'monthly'),
  ('Education', 50.00, 'monthly');