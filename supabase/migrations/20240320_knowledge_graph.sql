-- Knowledge Graph and Offline Content Migration
-- This adds tables and RLS policies for the knowledge graph and offline content features

-- Knowledge Graph Nodes
CREATE TABLE IF NOT EXISTS knowledge_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    type VARCHAR(50) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT valid_node_type CHECK (type IN ('concept', 'person', 'event', 'location', 'book', 'hadith', 'verse'))
);

-- Knowledge Graph Edges
CREATE TABLE IF NOT EXISTS knowledge_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
    target_id UUID REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT valid_relationship CHECK (relationship_type IN ('references', 'authored', 'occurred_at', 'related_to', 'part_of', 'cites')),
    CONSTRAINT no_self_edges CHECK (source_id != target_id)
);

-- Offline Content
CREATE TABLE IF NOT EXISTS offline_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    file_path TEXT,
    file_size BIGINT,
    download_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT valid_content_type CHECK (content_type IN ('quran', 'hadith', 'article', 'book', 'video', 'audio'))
);

-- Indexes
CREATE INDEX idx_knowledge_nodes_type ON knowledge_nodes(type);
CREATE INDEX idx_knowledge_nodes_created_by ON knowledge_nodes(created_by);
CREATE INDEX idx_knowledge_edges_source ON knowledge_edges(source_id);
CREATE INDEX idx_knowledge_edges_target ON knowledge_edges(target_id);
CREATE INDEX idx_knowledge_edges_relationship ON knowledge_edges(relationship_type);
CREATE INDEX idx_offline_content_user ON offline_content(user_id);
CREATE INDEX idx_offline_content_type ON offline_content(content_type);
CREATE INDEX idx_offline_content_last_accessed ON offline_content(last_accessed DESC);

-- RLS Policies

-- Enable RLS
ALTER TABLE knowledge_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE offline_content ENABLE ROW LEVEL SECURITY;

-- Knowledge Nodes Policies
CREATE POLICY "Public can view published knowledge nodes"
    ON knowledge_nodes FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create knowledge nodes"
    ON knowledge_nodes FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update their own knowledge nodes"
    ON knowledge_nodes FOR UPDATE
    TO authenticated
    USING (created_by = auth.uid())
    WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete their own knowledge nodes"
    ON knowledge_nodes FOR DELETE
    TO authenticated
    USING (created_by = auth.uid());

-- Knowledge Edges Policies
CREATE POLICY "Public can view knowledge edges"
    ON knowledge_edges FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create knowledge edges"
    ON knowledge_edges FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update their own knowledge edges"
    ON knowledge_edges FOR UPDATE
    TO authenticated
    USING (created_by = auth.uid())
    WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete their own knowledge edges"
    ON knowledge_edges FOR DELETE
    TO authenticated
    USING (created_by = auth.uid());

-- Offline Content Policies
CREATE POLICY "Users can view their own offline content"
    ON offline_content FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own offline content"
    ON offline_content FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own offline content"
    ON offline_content FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own offline content"
    ON offline_content FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Triggers
CREATE TRIGGER update_knowledge_nodes_updated_at
    BEFORE UPDATE ON knowledge_nodes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_edges_updated_at
    BEFORE UPDATE ON knowledge_edges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offline_content_updated_at
    BEFORE UPDATE ON offline_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Functions
CREATE OR REPLACE FUNCTION increment_download_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE offline_content
    SET 
        download_count = download_count + 1,
        last_accessed = NOW()
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_increment_download_count
    AFTER INSERT ON offline_content
    FOR EACH ROW
    EXECUTE FUNCTION increment_download_count(); 