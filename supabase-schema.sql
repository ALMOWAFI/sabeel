-- Sabeel Platform Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE node_type AS ENUM ('concept', 'person', 'event', 'location', 'book', 'hadith', 'verse');
CREATE TYPE relationship_type AS ENUM ('references', 'authored', 'occurred_at', 'related_to', 'part_of', 'cites');
CREATE TYPE content_type AS ENUM ('quran', 'hadith', 'article', 'book', 'video', 'audio');
CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin', 'scholar');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'student',
    canvas_user_id INTEGER,
    jupyter_user_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE public.user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
    language TEXT DEFAULT 'en' CHECK (language IN ('en', 'ar', 'both')),
    notification_settings JSONB DEFAULT '{
        "email": true,
        "push": true,
        "in_app": true
    }',
    privacy_settings JSONB DEFAULT '{
        "profile_visibility": "public",
        "activity_visibility": true
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Knowledge nodes table
CREATE TABLE public.knowledge_nodes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    type node_type NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge edges table (relationships between nodes)
CREATE TABLE public.knowledge_edges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    source_id UUID REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE,
    target_id UUID REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE,
    relationship_type relationship_type NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Offline content table
CREATE TABLE public.offline_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content_type content_type NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    metadata JSONB DEFAULT '{}',
    file_path TEXT,
    file_size BIGINT,
    download_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_knowledge_nodes_type ON public.knowledge_nodes(type);
CREATE INDEX idx_knowledge_nodes_created_by ON public.knowledge_nodes(created_by);
CREATE INDEX idx_knowledge_edges_source ON public.knowledge_edges(source_id);
CREATE INDEX idx_knowledge_edges_target ON public.knowledge_edges(target_id);
CREATE INDEX idx_knowledge_edges_type ON public.knowledge_edges(relationship_type);
CREATE INDEX idx_offline_content_user ON public.offline_content(user_id);
CREATE INDEX idx_offline_content_type ON public.offline_content(content_type);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offline_content ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- User profiles: users can read all profiles but only update their own
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User preferences: users can only access their own preferences
CREATE POLICY "Users can access own preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);

-- Knowledge nodes: public read, authenticated users can create
CREATE POLICY "Anyone can view knowledge nodes" ON public.knowledge_nodes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create knowledge nodes" ON public.knowledge_nodes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own knowledge nodes" ON public.knowledge_nodes FOR UPDATE USING (auth.uid() = created_by);

-- Knowledge edges: public read, authenticated users can create
CREATE POLICY "Anyone can view knowledge edges" ON public.knowledge_edges FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create knowledge edges" ON public.knowledge_edges FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own knowledge edges" ON public.knowledge_edges FOR UPDATE USING (auth.uid() = created_by);

-- Offline content: users can only access their own content
CREATE POLICY "Users can access own offline content" ON public.offline_content FOR ALL USING (auth.uid() = user_id);

-- Create function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert some sample Islamic knowledge data
INSERT INTO public.knowledge_nodes (title, content, type, metadata) VALUES
('Al-Fatiha', 'The opening chapter of the Quran, also known as "The Opening"', 'verse', '{"chapter": 1, "verses": 7, "revelation": "Meccan"}'),
('Prophet Muhammad (PBUH)', 'The final messenger of Allah, born in Mecca in 570 CE', 'person', '{"birth_year": 570, "birth_place": "Mecca", "death_year": 632}'),
('Sahih Bukhari', 'One of the most authentic collections of Hadith compiled by Imam Bukhari', 'book', '{"compiler": "Imam Bukhari", "total_hadith": 7563, "authenticity": "highest"}'),
('Tawhid', 'The concept of monotheism in Islam, the belief in the oneness of Allah', 'concept', '{"category": "theology", "importance": "fundamental"}'),
('Mecca', 'The holiest city in Islam, birthplace of Prophet Muhammad and location of the Kaaba', 'location', '{"country": "Saudi Arabia", "significance": "birthplace of Islam"}'),
('Hijra', 'The migration of Prophet Muhammad and his followers from Mecca to Medina in 622 CE', 'event', '{"year": 622, "from": "Mecca", "to": "Medina", "significance": "start of Islamic calendar"}}
ON CONFLICT DO NOTHING;

-- Insert relationships between nodes
WITH node_ids AS (
    SELECT id, title FROM public.knowledge_nodes
)
INSERT INTO public.knowledge_edges (source_id, target_id, relationship_type, metadata)
SELECT 
    (SELECT id FROM node_ids WHERE title = 'Prophet Muhammad (PBUH)'),
    (SELECT id FROM node_ids WHERE title = 'Mecca'),
    'occurred_at',
    '{"relationship": "born in"}'
WHERE EXISTS (SELECT 1 FROM node_ids WHERE title = 'Prophet Muhammad (PBUH)')
  AND EXISTS (SELECT 1 FROM node_ids WHERE title = 'Mecca')
ON CONFLICT DO NOTHING;

INSERT INTO public.knowledge_edges (source_id, target_id, relationship_type, metadata)
SELECT 
    (SELECT id FROM node_ids WHERE title = 'Al-Fatiha'),
    (SELECT id FROM node_ids WHERE title = 'Tawhid'),
    'references',
    '{"relationship": "expresses concept of"}'
WHERE EXISTS (SELECT 1 FROM node_ids WHERE title = 'Al-Fatiha')
  AND EXISTS (SELECT 1 FROM node_ids WHERE title = 'Tawhid')
ON CONFLICT DO NOTHING; 