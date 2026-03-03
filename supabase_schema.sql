-- KOROFINANCE SUPABASE SCHEMA
-- COPY AND PASTE THIS INTO THE SUPABASE SQL EDITOR

-- 1. Market Cache Table
CREATE TABLE IF NOT EXISTS market_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticker TEXT UNIQUE NOT NULL,
  name TEXT,
  price DECIMAL NOT NULL,
  change_pct DECIMAL,
  market TEXT, -- 'ngx', 'crypto', 'forex'
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE market_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profiles" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Market data is viewable by everyone" ON market_cache FOR SELECT USING (true);
