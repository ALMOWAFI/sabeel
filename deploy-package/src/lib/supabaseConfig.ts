/**
 * supabaseConfig.ts
 * 
 * Configuration for Supabase client
 * Handles connection to Supabase backend service
 */

import { createClient } from '@supabase/supabase-js';

// Use hardcoded values for local development
// For production, these would come from environment variables
const supabaseUrl = 'https://rfvgoxqwydinxolckxup.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmdmdveHF3eWRpbnhvbGNreHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODUwMjExMDAsImV4cCI6MjAwMDU5NzEwMH0.X2S9FWGL4okoQ-tEI9ue7LiLo3cJZnQpmAqOe4o6BDI';

// Create a single supabase client for interacting with the database
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Connection string for direct PostgreSQL access if needed
export const POSTGRES_CONNECTION = 'postgresql://postgres:[YOUR-PASSWORD]@db.rfvgoxqwydinxolckxup.supabase.co:5432/postgres';

export default supabase;
