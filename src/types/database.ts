export type NodeType = 'concept' | 'person' | 'event' | 'location' | 'book' | 'hadith' | 'verse';
export type RelationshipType = 'references' | 'authored' | 'occurred_at' | 'related_to' | 'part_of' | 'cites';
export type ContentType = 'quran' | 'hadith' | 'article' | 'book' | 'video' | 'audio';

export interface KnowledgeNode {
  id: string;
  title: string;
  content: string | null;
  type: NodeType;
  metadata: Record<string, any>;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeEdge {
  id: string;
  source_id: string;
  target_id: string;
  relationship_type: RelationshipType;
  metadata: Record<string, any>;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface OfflineContent {
  id: string;
  user_id: string;
  content_type: ContentType;
  title: string;
  content: string | null;
  metadata: Record<string, any>;
  file_path: string | null;
  file_size: number | null;
  download_count: number;
  last_accessed: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      knowledge_nodes: {
        Row: {
          id: string;
          title: string;
          content: string | null;
          type: 'concept' | 'person' | 'event' | 'location' | 'book' | 'hadith' | 'verse';
          metadata: Record<string, any>;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content?: string | null;
          type: 'concept' | 'person' | 'event' | 'location' | 'book' | 'hadith' | 'verse';
          metadata?: Record<string, any>;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string | null;
          type?: 'concept' | 'person' | 'event' | 'location' | 'book' | 'hadith' | 'verse';
          metadata?: Record<string, any>;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      knowledge_edges: {
        Row: {
          id: string;
          source_id: string;
          target_id: string;
          relationship_type: 'references' | 'authored' | 'occurred_at' | 'related_to' | 'part_of' | 'cites';
          metadata: Record<string, any>;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          source_id: string;
          target_id: string;
          relationship_type: 'references' | 'authored' | 'occurred_at' | 'related_to' | 'part_of' | 'cites';
          metadata?: Record<string, any>;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          source_id?: string;
          target_id?: string;
          relationship_type?: 'references' | 'authored' | 'occurred_at' | 'related_to' | 'part_of' | 'cites';
          metadata?: Record<string, any>;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      offline_content: {
        Row: {
          id: string;
          user_id: string;
          content_type: 'quran' | 'hadith' | 'article' | 'book' | 'video' | 'audio';
          title: string;
          content: string | null;
          metadata: Record<string, any>;
          file_path: string | null;
          file_size: number | null;
          download_count: number;
          last_accessed: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content_type: 'quran' | 'hadith' | 'article' | 'book' | 'video' | 'audio';
          title: string;
          content?: string | null;
          metadata?: Record<string, any>;
          file_path?: string | null;
          file_size?: number | null;
          download_count?: number;
          last_accessed?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content_type?: 'quran' | 'hadith' | 'article' | 'book' | 'video' | 'audio';
          title?: string;
          content?: string | null;
          metadata?: Record<string, any>;
          file_path?: string | null;
          file_size?: number | null;
          download_count?: number;
          last_accessed?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
} 