-- ==================================================
-- SPECIAL ONE - SUPABASE DATABASE SCHEMA
-- ==================================================

-- 1. Create gifts table
CREATE TABLE IF NOT EXISTS public.gifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(32) NOT NULL UNIQUE,
    sender_name VARCHAR(100) NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    opening_message TEXT NOT NULL,
    occasion VARCHAR(100) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    relationship_style VARCHAR(100) NOT NULL,
    together_month VARCHAR(50),
    together_year VARCHAR(50),
    photos JSONB DEFAULT '[]'::jsonb,
    reasons JSONB DEFAULT '[]'::jsonb,
    love_letter TEXT,
    wax_seal VARCHAR(10) DEFAULT '❤️',
    sticker VARCHAR(10) DEFAULT '🥰',
    voice_message_url TEXT,
    voice_duration NUMERIC,
    final_message TEXT,
    final_question TEXT,
    theme VARCHAR(50) DEFAULT 'blush',
    music VARCHAR(50) DEFAULT 'music-box',
    template VARCHAR(50) DEFAULT 'romantic',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create index on slug for fast public lookup
CREATE INDEX IF NOT EXISTS idx_gifts_slug ON public.gifts(slug);

-- 3. Row Level Security (RLS) Policies
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to gifts by anyone who has the unique slug
CREATE POLICY "Public read gifts by slug" 
ON public.gifts 
FOR SELECT 
USING (true);

-- Allow public creation of new gifts
CREATE POLICY "Public insert gifts" 
ON public.gifts 
FOR INSERT 
WITH CHECK (true);

-- 4. Supabase Storage Setup (Optional for media hosting)
-- Create bucket for photos and voice recordings if using Supabase Storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gift-assets', 'gift-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read of gift assets
CREATE POLICY "Public read gift assets" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gift-assets');

-- Allow public upload of gift assets
CREATE POLICY "Public upload gift assets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gift-assets');
