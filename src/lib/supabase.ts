import { createClient } from "@supabase/supabase-js";

/**
 * SQL SCHEMA FOR SUPABASE
 * -----------------------
 * -- 1. Market Cache Table
 * CREATE TABLE market_cache (
 *   id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
 *   ticker TEXT UNIQUE NOT NULL,
 *   name TEXT,
 *   price DECIMAL NOT NULL,
 *   change_pct DECIMAL,
 *   market TEXT, -- 'ngx', 'crypto', 'forex'
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- 2. User Profiles
 * CREATE TABLE profiles (
 *   id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
 *   full_name TEXT,
 *   avatar_url TEXT,
 *   subscription_tier TEXT DEFAULT 'free',
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 */


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        "Supabase environment variables are missing. Please provide NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
