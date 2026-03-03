-- KOROFINANCE SUPABASE SCHEMA
-- COPY AND PASTE THIS INTO THE SUPABASE SQL EDITOR

-- 1. Market Cache Table
CREATE TABLE IF NOT EXISTS market_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticker TEXT UNIQUE NOT NULL,
  name TEXT,
  price DECIMAL NOT NULL,
  change_pct DECIMAL,
  volume BIGINT, -- Added for NGX Stocks
  sector TEXT,   -- Added for NGX Stocks
  market TEXT,   -- 'ngx', 'crypto', 'forex'
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NOTE: If the table already exists, run these in the SQL Editor:
-- ALTER TABLE market_cache ADD COLUMN IF NOT EXISTS volume BIGINT;
-- ALTER TABLE market_cache ADD COLUMN IF NOT EXISTS sector TEXT;

-- 2. User Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. News Articles
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  url TEXT UNIQUE NOT NULL,
  image_url TEXT,
  source TEXT,
  category TEXT DEFAULT 'finance',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE market_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Create Policies (Idempotent: Drops first if exists)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profiles" ON profiles;
CREATE POLICY "Users can update own profiles" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Market data is viewable by everyone" ON market_cache;
CREATE POLICY "Market data is viewable by everyone" ON market_cache FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insertions into market_cache" ON market_cache;
CREATE POLICY "Allow insertions into market_cache" ON market_cache FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow updates into market_cache" ON market_cache;
CREATE POLICY "Allow updates into market_cache" ON market_cache FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "News articles are viewable by everyone" ON news_articles;
CREATE POLICY "News articles are viewable by everyone" ON news_articles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insertions into news_articles" ON news_articles;
CREATE POLICY "Allow insertions into news_articles" ON news_articles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow updates into news_articles" ON news_articles;
CREATE POLICY "Allow updates into news_articles" ON news_articles FOR UPDATE USING (true) WITH CHECK (true);

-- 4. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow insertions into subscribers" ON subscribers;
CREATE POLICY "Allow insertions into subscribers" ON subscribers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Subscribers are viewable by admin only" ON subscribers;
-- For now, we keep it simple or allow true if needed for frontend checks, but let's allow inserting.
CREATE POLICY "Subscribers are viewable by everyone" ON subscribers FOR SELECT USING (true);

-- 5. User Watchlists
CREATE TABLE IF NOT EXISTS watchlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  ticker TEXT NOT NULL,
  market TEXT NOT NULL, -- 'ngx', 'crypto', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, ticker)
);

ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own watchlists" ON watchlists;
CREATE POLICY "Users can manage own watchlists" ON watchlists FOR ALL USING (auth.uid() = user_id);
