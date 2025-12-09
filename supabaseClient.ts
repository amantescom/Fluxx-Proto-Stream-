
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pmagcxavxabwzgdliwmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtYWdjeGF2eGFid3pnZGxpd21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMjI4MzUsImV4cCI6MjA4MDc5ODgzNX0.g2J4q6cM0IegFHCJR6bZap_xSBNHhxUKxt4esPnepSY';

export const supabase = createClient(supabaseUrl, supabaseKey);
