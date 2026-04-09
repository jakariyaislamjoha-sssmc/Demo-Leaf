import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Fallback for demo purposes if keys are missing
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export type Lead = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  age: number;
  gender: string;
  occupation: string;
  location: string;
  status: 'new' | 'contacted' | 'qualified' | 'rejected';
};
