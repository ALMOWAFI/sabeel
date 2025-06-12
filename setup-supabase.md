# Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up/Sign in with GitHub
4. Click "New Project"
5. Choose your organization
6. Enter project details:
   - **Name**: `sabeel-platform`
   - **Database Password**: (generate a strong password)
   - **Region**: Choose closest to you
7. Click "Create new project"

## Step 2: Get Your API Keys

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## Step 3: Update Your .env File

Update your `.env` file with the Supabase credentials:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the following schema:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE node_type AS ENUM ('concept', 'person', 'event', 'location', 'book', 'hadith', 'verse');
CREATE TYPE relationship_type AS ENUM ('references', 'authored', 'occurred_at', 'related_to', 'part_of', 'cites');
CREATE TYPE content_type AS ENUM ('quran', 'hadith', 'article', 'book', 'video', 'audio');
CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin', 'scholar');

-- Knowledge nodes table
CREATE TABLE public.knowledge_nodes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    type node_type NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge edges table
CREATE TABLE public.knowledge_edges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    source_id UUID REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE,
    target_id UUID REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE,
    relationship_type relationship_type NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Offline content table
CREATE TABLE public.offline_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Create indexes
CREATE INDEX idx_knowledge_nodes_type ON public.knowledge_nodes(type);
CREATE INDEX idx_knowledge_edges_source ON public.knowledge_edges(source_id);
CREATE INDEX idx_knowledge_edges_target ON public.knowledge_edges(target_id);

-- Enable Row Level Security
ALTER TABLE public.knowledge_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offline_content ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view knowledge nodes" ON public.knowledge_nodes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create knowledge nodes" ON public.knowledge_nodes FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Anyone can view knowledge edges" ON public.knowledge_edges FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create knowledge edges" ON public.knowledge_edges FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can access own offline content" ON public.offline_content FOR ALL USING (auth.uid() = user_id);

-- Insert sample Islamic knowledge data
INSERT INTO public.knowledge_nodes (title, content, type, metadata) VALUES
('Al-Fatiha', 'The opening chapter of the Quran', 'verse', '{"chapter": 1, "verses": 7}'),
('Prophet Muhammad (PBUH)', 'The final messenger of Allah', 'person', '{"birth_year": 570, "birth_place": "Mecca"}'),
('Tawhid', 'The concept of monotheism in Islam', 'concept', '{"category": "theology"}'),
('Mecca', 'The holiest city in Islam', 'location', '{"country": "Saudi Arabia"}'),
('Hijra', 'The migration from Mecca to Medina in 622 CE', 'event', '{"year": 622}'),
('Sahih Bukhari', 'Collection of authentic Hadith', 'book', '{"compiler": "Imam Bukhari"}'
);
```

4. Click "Run" to execute the SQL
5. You should see "Success. No rows returned" - this means it worked!

## Step 5: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Under "Auth Providers", enable the providers you want:
   - Email (already enabled)
   - Google (optional)
   - Microsoft (optional)

## Step 6: Test Your Setup

Your Supabase database is now ready! The app will automatically:
- Create user profiles when users sign up
- Store Islamic knowledge in the graph database
- Handle authentication and authorization

## Troubleshooting

- **"relation does not exist" errors**: Make sure you ran the SQL schema correctly
- **"insufficient privileges" errors**: Check that RLS policies are set up correctly
- **Connection errors**: Verify your API keys in the .env file are correct

## Next Steps

With Supabase set up, you can now:
1. Start the development server: `npm run dev`
2. Test user registration and login
3. Explore the Islamic knowledge graph
4. Add Canvas LMS integration by getting Canvas API keys 