import { createClient } from '@supabase/supabase-js';

// This file is for the SERVER (API Routes)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// We use the "|| ''" trick to prevent it from crashing the build if missing
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);