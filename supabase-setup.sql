-- nayl-aSpace Supabase Setup
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Interests Table (w/ gallery_images)
CREATE TABLE interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  icon TEXT,
  category TEXT NOT NULL,
  meta TEXT,
  genre TEXT,
  status TEXT,
  recommendation TEXT,
  rating INTEGER DEFAULT 5,
  fav_quote TEXT,
  fav_quote_from TEXT,
  tags TEXT[],
  badges TEXT[],
  moments JSONB[],
  gallery JSONB[], -- Legacy text vibes
  gallery_images TEXT[], -- NEW: Image URLs
  images TEXT[],
  feel TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT,
  category TEXT,
  status TEXT,
  tags TEXT[],
  github_url TEXT,
  live_url TEXT,
  extra_links JSONB[],
  description TEXT,
  images TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Public Messages
CREATE TABLE public_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RLS Policies (Public Read, Auth Write)
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_messages ENABLE ROW LEVEL SECURITY;

-- Public Read
CREATE POLICY "Public read interests" ON interests FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read messages" ON public_messages FOR SELECT USING (true);

-- Authenticated Write
CREATE POLICY "Auth write interests" ON interests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write messages" ON public_messages FOR INSERT USING (auth.role() = 'authenticated');

-- 6. Storage Bucket Policy (Images Public)
-- Storage > images bucket > Policies > Add Policy:
-- Name: "Public read images"
-- Allowed: SELECT
-- Bucket: images
-- Using: true

-- FIXED: Run sections one-by-one (Supabase SQL Editor limitation)
-- Copy each CREATE TABLE + policies separately

