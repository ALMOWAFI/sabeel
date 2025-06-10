/**
 * supabaseConfig.ts
 * 
 * Configuration for Supabase client
 * Handles connection to Supabase backend service
 */

import { createClient } from '@supabase/supabase-js';

// Use environment variables for configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Create a single supabase client for interacting with the database
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Connection string for direct PostgreSQL access if needed
export const POSTGRES_CONNECTION = 'postgresql://postgres:[YOUR-PASSWORD]@db.rfvgoxqwydinxolckxup.supabase.co:5432/postgres';

export default supabase;
