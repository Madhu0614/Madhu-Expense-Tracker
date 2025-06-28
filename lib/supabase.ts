import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Expense {
  id: string;
  purpose: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  user_id: string;
  created_at: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  due_date: string;
  category: string;
  is_paid: boolean;
  user_id: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billing_cycle: string;
  next_payment: string;
  category: string;
  is_active: boolean;
  user_id: string;
  created_at: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: string;
  user_id: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

// Auth helper functions
export const auth = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};