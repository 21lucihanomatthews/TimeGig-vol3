import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient: any;
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Supabase client will be mocked.');
  supabaseClient = {
    from: (table: string) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ data: [], error: null }),
      delete: () => Promise.resolve({ data: [], error: null }),
    }),
  } as any;
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}
export const supabase = supabaseClient;

