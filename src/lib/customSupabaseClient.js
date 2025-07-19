import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zjbvaesjkyfumdfjooyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqYnZhZXNqa3lmdW1kZmpvb3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTcxNTYsImV4cCI6MjA2ODQzMzE1Nn0.vmH5WB7jndV7RZwFQuhEyxEd6nLnHf5B23elJOBDrcM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);