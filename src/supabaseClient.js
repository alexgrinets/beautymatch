import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://tmdyylrqxvhqmgmwifhy.supabase.co";
const SUPABASE_KEY = "sb_publishable_z192hxS5xeeg5VrQKAzdhQ_Hy7NAmQT";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
