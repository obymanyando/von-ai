import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Public client (uses anon key, respects RLS)
let supabaseInstance: SupabaseClient | null = null;

// Admin client (uses service role key, bypasses RLS)
let supabaseAdminInstance: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error);
  }
} else {
  console.warn('⚠️  Supabase credentials not found. Blog and contact features will be unavailable.');
}

// Initialize admin client with service role key (bypasses RLS)
if (supabaseUrl && supabaseServiceKey) {
  try {
    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('✅ Supabase admin client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase admin client:', error);
  }
}

export const supabase = supabaseInstance;
export const supabaseAdmin = supabaseAdminInstance;
export const isSupabaseAvailable = !!supabaseInstance;
export const isSupabaseAdminAvailable = !!supabaseAdminInstance;
