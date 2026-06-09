import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase environment variables not configured: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set'
  );
}

// 1. Cliente público (Frontend: Respeta las reglas RLS)
export const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Cliente administrador (Backend: Se salta las reglas RLS)
export const getSupabaseAdmin = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceKey) {
    throw new Error(
      'Supabase environment variable not configured: SUPABASE_SERVICE_ROLE_KEY must be set for admin actions'
    );
  }
  
  return createClient(supabaseUrl, serviceKey);
};
