import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Created on first use, so builds without Supabase env vars (e.g. preview deployments) don't fail
let anon;
export const supabase = new Proxy({}, {
  get: (_, key) => {
    if (!anon) anon = createClient(supabaseUrl, supabaseAnonKey);
    const v = anon[key];
    return typeof v === "function" ? v.bind(anon) : v;
  },
});

// Server-side client with service role (for admin operations)
export function createServiceClient() {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);
}
