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

-- Collaboration documents table
CREATE TABLE public.collaboration_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    owner_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document collaborators table
CREATE TABLE public.document_collaborators (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_id UUID REFERENCES public.collaboration_documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    permission TEXT DEFAULT 'edit' CHECK (permission IN ('read', 'edit', 'admin')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(document_id, user_id)
);

-- Document comments table
CREATE TABLE public.document_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_id UUID REFERENCES public.collaboration_documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    position INTEGER,
    parent_id UUID REFERENCES public.document_comments(id) ON DELETE CASCADE,
    resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Canvas integration table
CREATE TABLE public.canvas_integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    canvas_user_id INTEGER NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    canvas_instance_url TEXT,
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Performance cache table
CREATE TABLE public.performance_cache (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cache_key TEXT NOT NULL,
    cache_data JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cache_key)
);

-- Create indexes for better performance
CREATE INDEX idx_knowledge_nodes_type ON public.knowledge_nodes(type);
CREATE INDEX idx_knowledge_nodes_created_by ON public.knowledge_nodes(created_by);
CREATE INDEX idx_knowledge_edges_source ON public.knowledge_edges(source_id);
CREATE INDEX idx_knowledge_edges_target ON public.knowledge_edges(target_id);
CREATE INDEX idx_knowledge_edges_type ON public.knowledge_edges(relationship_type);
CREATE INDEX idx_offline_content_user ON public.offline_content(user_id);
CREATE INDEX idx_offline_content_type ON public.offline_content(content_type);
CREATE INDEX idx_document_collaborators_doc ON public.document_collaborators(document_id);
CREATE INDEX idx_document_collaborators_user ON public.document_collaborators(user_id);
CREATE INDEX idx_document_comments_doc ON public.document_comments(document_id);
CREATE INDEX idx_document_comments_user ON public.document_comments(user_id);
CREATE INDEX idx_document_comments_parent ON public.document_comments(parent_id);
CREATE INDEX idx_canvas_integrations_user ON public.canvas_integrations(user_id);
CREATE INDEX idx_canvas_integrations_canvas_user ON public.canvas_integrations(canvas_user_id);
CREATE INDEX idx_performance_cache_key ON public.performance_cache(cache_key);
CREATE INDEX idx_performance_cache_expires ON public.performance_cache(expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offline_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canvas_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_cache ENABLE ROW LEVEL SECURITY;

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

-- Collaboration documents: public read for public docs, full access for collaborators
CREATE POLICY "Anyone can view public documents" ON public.collaboration_documents FOR SELECT USING (is_public = true);
CREATE POLICY "Collaborators can view private documents" ON public.collaboration_documents FOR SELECT USING (
    id IN (
        SELECT document_id FROM public.document_collaborators 
        WHERE user_id = auth.uid()
    ) OR owner_id = auth.uid()
);
CREATE POLICY "Users can create documents" ON public.collaboration_documents FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update documents" ON public.collaboration_documents FOR UPDATE USING (auth.uid() = owner_id);

-- Document collaborators: document owners and admins can manage
CREATE POLICY "Document owners can manage collaborators" ON public.document_collaborators FOR ALL USING (
    document_id IN (
        SELECT id FROM public.collaboration_documents 
        WHERE owner_id = auth.uid()
    )
);
CREATE POLICY "Users can view document collaborators" ON public.document_collaborators FOR SELECT USING (
    user_id = auth.uid() OR document_id IN (
        SELECT document_id FROM public.document_collaborators 
        WHERE user_id = auth.uid()
    )
);

-- Document comments: collaborators can read/write
CREATE POLICY "Collaborators can access comments" ON public.document_comments FOR ALL USING (
    document_id IN (
        SELECT document_id FROM public.document_collaborators 
        WHERE user_id = auth.uid()
    ) OR document_id IN (
        SELECT id FROM public.collaboration_documents 
        WHERE owner_id = auth.uid() OR is_public = true
    )
);

-- Canvas integrations: users can only access their own integrations
CREATE POLICY "Users can access own canvas integration" ON public.canvas_integrations FOR ALL USING (auth.uid() = user_id);

-- Performance cache: allow all authenticated users to read/write cache
CREATE POLICY "Authenticated users can access cache" ON public.performance_cache FOR ALL USING (auth.role() = 'authenticated');

-- Create functions for automatic profile creation
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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_knowledge_nodes_updated_at BEFORE UPDATE ON public.knowledge_nodes FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_knowledge_edges_updated_at BEFORE UPDATE ON public.knowledge_edges FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_offline_content_updated_at BEFORE UPDATE ON public.offline_content FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_collaboration_documents_updated_at BEFORE UPDATE ON public.collaboration_documents FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_document_comments_updated_at BEFORE UPDATE ON public.document_comments FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_canvas_integrations_updated_at BEFORE UPDATE ON public.canvas_integrations FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column(); 