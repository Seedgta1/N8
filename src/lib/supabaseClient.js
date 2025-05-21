
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://embjvmcyzqjitxqjjtei.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtYmp2bWN5enFqaXR4cWpqdGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNDY4NDUsImV4cCI6MjA2MjYyMjg0NX0.n4FC7i2uKnPNgPI1IBwG7Pcc0rgDfAdKHDVwDlhGInc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
