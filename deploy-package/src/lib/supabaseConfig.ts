/**
 * supabaseConfig.ts
 * 
 * Configuration for Supabase client
 * Handles connection to Supabase backend service
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rfvgoxqwydinxolckxup.supabase.co';
// Replace with your actual anon/public key (not the password)
// IMPORTANT: Replace this with your actual Supabase anon key from your project settings
// This is a public key that can be safely included in client-side code
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmdmdveHF3eWRpbnhvbGNreHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODUwMjExMDAsImV4cCI6MjAwMDU5NzEwMH0.X2S9FWGL4okoQ-tEI9ue7LiLo3cJZnQpmAqOe4o6BDI';

// Create a single supabase client for interacting with the database
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Connection string for direct PostgreSQL access if needed
export const POSTGRES_CONNECTION = 'postgresql://postgres:[YOUR-PASSWORD]@db.rfvgoxqwydinxolckxup.supabase.co:5432/postgres';

export default supabase;
