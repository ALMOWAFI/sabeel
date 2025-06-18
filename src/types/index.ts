// Core user types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: UserRole;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
  
  // OAuth integration fields
  canvas_user_id?: string;
  jupyter_user_id?: string;
  google_user_id?: string;
  microsoft_user_id?: string;
  
  // Profile fields
  bio?: string;
  location?: string;
  website?: string;
  expertise_areas?: string[];
  is_verified: boolean;
}

export type UserRole = 'student' | 'instructor' | 'admin' | 'scholar' | 'moderator';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'ar' | 'ur' | 'tr' | 'id';
  arabic_font: 'amiri' | 'scheherazade' | 'noto';
  font_size: 'small' | 'medium' | 'large';
  show_transliteration: boolean;
  show_translation: boolean;
  preferred_translation: string;
  notification_settings: NotificationSettings;
  privacy_settings: PrivacySettings;
}

export interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  collaboration_updates: boolean;
  assignment_reminders: boolean;
  weekly_digest: boolean;
}

export interface PrivacySettings {
  show_online_status: boolean;
  allow_direct_messages: boolean;
  show_profile_to_public: boolean;
  show_activity_feed: boolean;
}

// Authentication types
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: 'Bearer';
}

export interface OAuthProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  auth_url: string;
  client_id: string;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
  expires_at: number;
}

// Canvas LMS types
export interface CanvasCourse {
  id: number;
  name: string;
  course_code: string;
  workflow_state: 'available' | 'completed' | 'deleted';
  start_at?: string;
  end_at?: string;
  enrollment_term_id: number;
  is_public: boolean;
  is_public_to_auth_users: boolean;
  public_syllabus: boolean;
  storage_quota_mb: number;
  is_public_to_auth_users_only: boolean;
  apply_assignment_group_weights: boolean;
  calendar: {
    ics: string;
  };
  default_view: string;
  syllabus_body?: string;
  needs_grading_count: number;
  term?: {
    id: number;
    name: string;
    start_at: string;
    end_at: string;
  };
  course_progress?: {
    requirement_count: number;
    requirement_completed_count: number;
    next_requirement_url?: string;
    completed_at?: string;
  };
  islamic_content?: IslamicContent;
}

export interface CanvasAssignment {
  id: number;
  name: string;
  description: string;
  due_at?: string;
  lock_at?: string;
  unlock_at?: string;
  points_possible: number;
  min_score?: number;
  max_score?: number;
  mastery_score?: number;
  grading_type: 'pass_fail' | 'percent' | 'letter_grade' | 'gpa_scale' | 'points';
  submission_types: string[];
  workflow_state: 'published' | 'unpublished' | 'deleted';
  course_id: number;
  position: number;
  assignment_group_id: number;
  islamic_content?: IslamicAssignmentContent;
}

export interface IslamicAssignmentContent {
  type: 'quran' | 'hadith' | 'fiqh' | 'aqeedah' | 'seerah' | 'tafseer' | 'general';
  verses?: string[];
  hadith_references?: string[];
  topics: string[];
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  language: 'arabic' | 'english' | 'both';
  scholarly_commentary?: string;
  recommended_resources?: string[];
}

export interface IslamicContent {
  primary_subject: 'quran' | 'hadith' | 'fiqh' | 'aqeedah' | 'seerah' | 'tafseer' | 'arabic_language';
  topics: string[];
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  language: 'arabic' | 'english' | 'both';
  scholars_mentioned?: string[];
  texts_referenced?: string[];
}

// Collaboration types
export interface CollaborationDocument {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'assignment' | 'research' | 'translation';
  owner_id: string;
  collaborators: CollaboratorInfo[];
  created_at: string;
  updated_at: string;
  is_public: boolean;
  permissions: DocumentPermissions;
  version: number;
  islamic_content?: IslamicDocumentContent;
}

export interface CollaboratorInfo {
  user_id: string;
  user_name: string;
  user_avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  last_seen: string;
  cursor_position?: number;
  selection_range?: {
    start: number;
    end: number;
  };
  is_online: boolean;
}

export interface DocumentPermissions {
  can_edit: boolean;
  can_comment: boolean;
  can_share: boolean;
  can_delete: boolean;
  can_export: boolean;
}

export interface IslamicDocumentContent {
  references: {
    quran_verses?: string[];
    hadith_references?: string[];
    scholarly_works?: string[];
  };
  topics: string[];
  language: 'arabic' | 'english' | 'both';
  transliteration_included: boolean;
  translation_included: boolean;
}

export interface DocumentChange {
  id: string;
  type: 'insert' | 'delete' | 'format' | 'replace';
  position: number;
  content?: string;
  length?: number;
  user_id: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Comment {
  id: string;
  document_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  position: number;
  created_at: string;
  updated_at: string;
  replies: CommentReply[];
  is_resolved: boolean;
}

export interface CommentReply {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  created_at: string;
}

// Knowledge Graph types
export interface KnowledgeNode {
  id: string;
  title: string;
  type: 'topic' | 'verse' | 'hadith' | 'scholar' | 'book' | 'concept';
  content: string;
  metadata: KnowledgeNodeMetadata;
  connections: KnowledgeConnection[];
  position?: {
    x: number;
    y: number;
  };
  created_at: string;
  updated_at: string;
}

export interface KnowledgeNodeMetadata {
  source?: string;
  reference?: string;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  language: 'arabic' | 'english' | 'both';
  verified: boolean;
  popularity_score: number;
}

export interface KnowledgeConnection {
  target_node_id: string;
  relationship_type: 'explains' | 'contradicts' | 'supports' | 'references' | 'prerequisite' | 'related';
  strength: number; // 0-1
  description?: string;
  created_by: string;
  created_at: string;
}

// Performance and Caching types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
  size: number;
}

export interface CacheConfig {
  maxSize: number;
  defaultTtl: number;
  strategy: 'lru' | 'fifo' | 'lfu';
  enableCompression: boolean;
}

export interface PerformanceMetrics {
  cache_hit_rate: number;
  cache_miss_rate: number;
  average_response_time: number;
  memory_usage: number;
  active_connections: number;
  requests_per_minute: number;
  error_rate: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
  request_id: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  request_id: string;
}

// WebSocket types
export interface WebSocketMessage {
  type: string;
  payload: any;
  user_id: string;
  timestamp: string;
  message_id: string;
}

export interface CollaborationMessage extends WebSocketMessage {
  type: 'document_change' | 'cursor_move' | 'user_join' | 'user_leave' | 'comment_add' | 'comment_resolve';
  payload: {
    document_id: string;
    change?: DocumentChange;
    cursor_position?: number;
    selection_range?: { start: number; end: number };
    user_info?: CollaboratorInfo;
    comment?: Comment;
  };
}

// UI Component types
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ModalConfig {
  title: string;
  content: any; // Will be ReactNode once React is imported
  size: 'sm' | 'md' | 'lg' | 'xl';
  closable: boolean;
  actions?: {
    label: string;
    variant: 'primary' | 'secondary' | 'danger';
    onClick: () => void;
  }[];
}

// Store types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Features state
  canvas: CanvasState;
  collaboration: CollaborationState;
  knowledge: KnowledgeState;
  performance: PerformanceState;
}

export interface CanvasState {
  courses: CanvasCourse[];
  assignments: CanvasAssignment[];
  isLoading: boolean;
  error: string | null;
  lastSync: string | null;
}

export interface CollaborationState {
  activeDocument: CollaborationDocument | null;
  collaborators: CollaboratorInfo[];
  isConnected: boolean;
  unreadComments: number;
  recentChanges: DocumentChange[];
}

export interface KnowledgeState {
  nodes: KnowledgeNode[];
  selectedNode: KnowledgeNode | null;
  searchResults: KnowledgeNode[];
  isLoading: boolean;
  viewMode: 'graph' | 'list' | 'cards';
}

export interface PerformanceState {
  metrics: PerformanceMetrics;
  cacheStats: {
    hit_rate: number;
    size: number;
    entries: number;
  };
  isOptimized: boolean;
}