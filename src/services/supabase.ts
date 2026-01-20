import { createClient } from '@supabase/supabase-js';

// TODO: Replace these with your Supabase project values.
// You can also load these from env / Expo Constants later.
const SUPABASE_URL = 'https://gpujfriqmofsyczdtfbv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__4Qoa5Rp5zcC8o55qTaPHg_l2Cd3FTa';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

