// Centralized Supabase client
import { createClient } from '@supabase/supabase-js';

// Vite exposes env vars via import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// Create a single client for your app
export const supabase = createClient(supabaseUrl, supabaseKey);

// Helpers used by Admin auth (optional emailless “magic link” or OAuth could be added later)
// For this tutorial we’ll use anon reads + “temporary” login via supabase.auth.signInWithPassword.
// Create a test user in Supabase Auth for admin access.