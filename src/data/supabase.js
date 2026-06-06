import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yxweryvbefoplelqmndg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GTpPWHwy2KHCFGYSESerwA_7sqvNUaF';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);