/**
 * SupabaseDatabaseService.ts
 * 
 * Service for interacting with Supabase database
 * Provides CRUD operations for the Sabeel platform data
 */

import supabase from '@/lib/supabaseConfig';
import { PostgrestError } from '@supabase/supabase-js';

// Define table types
export type IslamicEvent = {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location?: string;
  type: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  notification_enabled: boolean;
  notification_days_before: number;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type JobOpening = {
  id: string;
  title: string;
  organization: string;
  description: string;
  location: string;
  salary_range?: string;
  application_url?: string;
  contact_email?: string;
  is_remote: boolean;
  posted_date: string;
  closing_date?: string;
  skills_required: string[];
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type WhatsAppGroup = {
  id: string;
  name: string;
  description: string;
  category: string;
  invite_link?: string;
  is_public: boolean;
  member_count: number;
  language: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type ContentItem = {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'in_review' | 'published' | 'rejected';
  author_id: string;
  reviewer_id?: string;
  review_notes?: string;
  language: string;
  read_time_minutes: number;
  cover_image_url?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
};

export type QuizQuestion = {
  id: string;
  quiz_id: string;
  question_text: string;
  options: { text: string; is_correct: boolean }[];
  explanation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
  updated_at: string;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  time_limit_minutes: number;
  pass_percentage: number;
  is_published: boolean;
  author_id: string;
  created_at: string;
  updated_at: string;
};

class SupabaseDatabaseService {
  /**
   * Handle Supabase error
   */
  private handleError(error: PostgrestError): never {
    console.error('Database error:', error);
    throw new Error(error.message);
  }
  
  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
  
  /*******************************************************
   * Islamic Events
   *******************************************************/
  
  /**
   * Get all Islamic events
   */
  public async getIslamicEvents(): Promise<IslamicEvent[]> {
    const { data, error } = await supabase
      .from('islamic_events')
      .select('*')
      .order('start_date', { ascending: true });
    
    if (error) this.handleError(error);
    return data || [];
  }
  
  /**
   * Get upcoming Islamic events
   */
  public async getUpcomingEvents(limit: number = 10): Promise<IslamicEvent[]> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('islamic_events')
      .select('*')
      .gte('start_date', today)
      .order('start_date', { ascending: true })
      .limit(limit);
    
    if (error) this.handleError(error);
    return data || [];
  }
  
  /**
   * Get Islamic event by ID
   */
  public async getIslamicEventById(id: string): Promise<IslamicEvent | null> {
    const { data, error } = await supabase
      .from('islamic_events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') this.handleError(error);
    return data;
  }
  
  /**
   * Create Islamic event
   */
  public async createIslamicEvent(event: Omit<IslamicEvent, 'id' | 'created_at' | 'updated_at'>): Promise<IslamicEvent> {
    const newEvent = {
      ...event,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('islamic_events')
      .insert(newEvent)
      .select()
      .single();
    
    if (error) this.handleError(error);
    return data!;
  }
  
  /**
   * Update Islamic event
   */
  public async updateIslamicEvent(id: string, updates: Partial<Omit<IslamicEvent, 'id' | 'created_at' | 'updated_at'>>): Promise<IslamicEvent> {
    const { data, error } = await supabase
      .from('islamic_events')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) this.handleError(error);
    return data!;
  }
  
  /**
   * Delete Islamic event
   */
  public async deleteIslamicEvent(id: string): Promise<void> {
    const { error } = await supabase
      .from('islamic_events')
      .delete()
      .eq('id', id);
    
    if (error) this.handleError(error);
  }
  
  /**
   * Get upcoming event notifications
   */
  public async getUpcomingEventNotifications(daysAhead: number = 7): Promise<IslamicEvent[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysAhead);
    
    const todayStr = today.toISOString().split('T')[0];
    const futureDateStr = futureDate.toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('islamic_events')
      .select('*')
      .gte('start_date', todayStr)
      .lte('start_date', futureDateStr)
      .eq('notification_enabled', true)
      .order('start_date', { ascending: true });
    
    if (error) this.handleError(error);
    return data || [];
  }
  
  /*******************************************************
   * Job Openings
   *******************************************************/
  
  /**
   * Get all job openings
   */
  public async getJobOpenings(activeOnly: boolean = true): Promise<JobOpening[]> {
    let query = supabase
      .from('job_openings')
      .select('*')
      .order('posted_date', { ascending: false });
    
    if (activeOnly) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query;
    
    if (error) this.handleError(error);
    return data || [];
  }
  
  /**
   * Get job opening by ID
   */
  public async getJobOpeningById(id: string): Promise<JobOpening | null> {
    const { data, error } = await supabase
      .from('job_openings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') this.handleError(error);
    return data;
  }
  
  /**
   * Create job opening
   */
  public async createJobOpening(job: Omit<JobOpening, 'id' | 'created_at' | 'updated_at'>): Promise<JobOpening> {
    const newJob = {
      ...job,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('job_openings')
      .insert(newJob)
      .select()
      .single();
    
    if (error) this.handleError(error);
    return data!;
  }
  
  /**
   * Update job opening
   */
  public async updateJobOpening(id: string, updates: Partial<Omit<JobOpening, 'id' | 'created_at' | 'updated_at'>>): Promise<JobOpening> {
    const { data, error } = await supabase
      .from('job_openings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) this.handleError(error);
    return data!;
  }
  
  /**
   * Delete job opening
   */
  public async deleteJobOpening(id: string): Promise<void> {
    const { error } = await supabase
      .from('job_openings')
      .delete()
      .eq('id', id);
    
    if (error) this.handleError(error);
  }
  
  /*******************************************************
   * WhatsApp Groups
   *******************************************************/
  
  /**
   * Get all WhatsApp groups
   */
  public async getWhatsAppGroups(): Promise<WhatsAppGroup[]> {
    const { data, error } = await supabase
      .from('whatsapp_groups')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) this.handleError(error);
    return data || [];
  }
  
  /**
   * Get WhatsApp group by ID
   */
  public async getWhatsAppGroupById(id: string): Promise<WhatsAppGroup | null> {
    const { data, error } = await supabase
      .from('whatsapp_groups')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') this.handleError(error);
    return data;
  }
  
  /**
   * Create WhatsApp group
   */
  public async createWhatsAppGroup(group: Omit<WhatsAppGroup, 'id' | 'created_at' | 'updated_at'>): Promise<WhatsAppGroup> {
    const newGroup = {
      ...group,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('whatsapp_groups')
      .insert(newGroup)
      .select()
      .single();
    
    if (error) this.handleError(error);
    return data!;
  }
  
  /**
   * Update WhatsApp group
   */
  public async updateWhatsAppGroup(id: string, updates: Partial<Omit<WhatsAppGroup, 'id' | 'created_at' | 'updated_at'>>): Promise<WhatsAppGroup> {
    const { data, error } = await supabase
      .from('whatsapp_groups')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) this.handleError(error);
    return data!;
  }
  
  /**
   * Delete WhatsApp group
   */
  public async deleteWhatsAppGroup(id: string): Promise<void> {
    const { error } = await supabase
      .from('whatsapp_groups')
      .delete()
      .eq('id', id);
    
    if (error) this.handleError(error);
  }
  
  /**
   * Increment WhatsApp group member count
   */
  public async incrementGroupMemberCount(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_group_member_count', { group_id: id });
    
    if (error) this.handleError(error);
  }
  
  /*******************************************************
   * Content Creation
   *******************************************************/
  
  /**
   * Get all content items
   */
  public async getContentItems(status?: 'draft' | 'in_review' | 'published' | 'rejected'): Promise<ContentItem[]> {
    let query = supabase
      .from('content_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) this.handleError(error);
    return data || [];
  }
  
  /**
   * Get content items by author
   */
  public async getContentItemsByAuthor(authorId: string): Promise<ContentItem[]> {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('author_id', authorId)
      .order('created_at', { ascending: false });
    
    if (error) this.handleError(error);
    return data || [];
  }
  
  /**
   * Get published content items
   */
  public async getPublishedContentItems(limit?: number, category?: string): Promise<ContentItem[]> {
    let query = supabase
      .from('content_items')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) this.handleError(error);
    return data || [];
  }
  
  /**
   * Get content item by ID
   */
  public async getContentItemById(id: string): Promise<ContentItem | null> {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') this.handleError(error);
    return data;
  }
  
  /**
   * Create content item
   */
  public async createContentItem(content: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>): Promise<ContentItem> {
    const newContent = {
      ...content,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('content_items')
      .insert(newContent)
      .select()
      .single();
    
    if (error) this.handleError(error);
    return data!;
  }
  
  /**
   * Update content item
   */
  public async updateContentItem(id: string, updates: Partial<Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>>): Promise<ContentItem> {
    // If status changed to published, set published_at
    if (updates.status === 'published' && !updates.published_at) {
      updates.published_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('content_items')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) this.handleError(error);
    return data!;
  }
  
  /**
   * Delete content item
   */
  public async deleteContentItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', id);
    
    if (error) this.handleError(error);
  }
  
  /**
   * Search content items
   */
  public async searchContentItems(query: string, category?: string): Promise<ContentItem[]> {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('status', 'published')
      .textSearch('title', query, { config: 'english' })
      .order('published_at', { ascending: false });
    
    if (error) this.handleError(error);
    return data || [];
  }
  
  /*******************************************************
   * Quizzes and Questions
   *******************************************************/
  
  /**
   * Get all quizzes
   */
  public async getQuizzes(publishedOnly: boolean = false): Promise<Quiz[]> {
    let query = supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (publishedOnly) {
      query = query.eq('is_published', true);
    }
    
    const { data, error } = await query;
    
    if (error) this.handleError(error);
    return data || [];
  }
  
  /**
   * Get quiz by ID
   */
  public async getQuizById(id: string): Promise<Quiz | null> {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') this.handleError(error);
    return data;
  }
  
  /**
   * Create quiz
   */
  public async createQuiz(quiz: Omit<Quiz, 'id' | 'created_at' | 'updated_at'>): Promise<Quiz> {
    const newQuiz = {
      ...quiz,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('quizzes')
      .insert(newQuiz)
      .select()
      .single();
    
    if (error) this.handleError(error);
    return data!;
  }
  
  /**
   * Update quiz
   */
  public async updateQuiz(id: string, updates: Partial<Omit<Quiz, 'id' | 'created_at' | 'updated_at'>>): Promise<Quiz> {
    const { data, error } = await supabase
      .from('quizzes')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) this.handleError(error);
    return data!;
  }
  
  /**
   * Delete quiz
   */
  public async deleteQuiz(id: string): Promise<void> {
    // First delete all associated questions
    await supabase
      .from('quiz_questions')
      .delete()
      .eq('quiz_id', id);
    
    // Then delete the quiz
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', id);
    
    if (error) this.handleError(error);
  }
  
  /**
   * Get questions for a quiz
   */
  public async getQuestionsForQuiz(quizId: string): Promise<QuizQuestion[]> {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('created_at', { ascending: true });
    
    if (error) this.handleError(error);
    return data || [];
  }
  
  /**
   * Create quiz question
   */
  public async createQuizQuestion(question: Omit<QuizQuestion, 'id' | 'created_at' | 'updated_at'>): Promise<QuizQuestion> {
    const newQuestion = {
      ...question,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('quiz_questions')
      .insert(newQuestion)
      .select()
      .single();
    
    if (error) this.handleError(error);
    return data!;
  }
  
  /**
   * Update quiz question
   */
  public async updateQuizQuestion(id: string, updates: Partial<Omit<QuizQuestion, 'id' | 'created_at' | 'updated_at'>>): Promise<QuizQuestion> {
    const { data, error } = await supabase
      .from('quiz_questions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) this.handleError(error);
    return data!;
  }
  
  /**
   * Delete quiz question
   */
  public async deleteQuizQuestion(id: string): Promise<void> {
    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('id', id);
    
    if (error) this.handleError(error);
  }
  
  /*******************************************************
   * Community Metrics and Impact
   *******************************************************/
  
  /**
   * Get community metrics
   */
  public async getCommunityMetrics(): Promise<any> {
    // This would normally be a PostgreSQL function call to aggregate data
    // For now, we'll return mock data
    return {
      totalUsers: 24583,
      quranCompletions: 3827,
      learningHours: 125472,
      articlesPublished: 843,
      questionsAnswered: 12391,
      countriesRepresented: 78,
      achievementsEarned: 56935,
      volunteerHours: 3254
    };
  }
  
  /**
   * Get user metrics
   */
  public async getUserMetrics(userId: string): Promise<any> {
    // This would normally be a PostgreSQL function call
    // For now, we'll return mock data
    return {
      quranPages: 137,
      articlesRead: 24,
      questionsAnswered: 5,
      totalCredits: 450,
      rank: 357,
      achievements: 12,
      impactScore: 78
    };
  }
  
  /**
   * Record user activity
   */
  public async recordUserActivity(userId: string, activityType: string, details: any): Promise<void> {
    const activity = {
      id: this.generateId(),
      user_id: userId,
      activity_type: activityType,
      details,
      created_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('user_activities')
      .insert(activity);
    
    if (error) this.handleError(error);
  }
  
  /**
   * Get community milestones
   */
  public async getCommunityMilestones(): Promise<any[]> {
    const { data, error } = await supabase
      .from('community_milestones')
      .select('*')
      .order('target_date', { ascending: true });
    
    if (error) this.handleError(error);
    return data || [];
  }
}

// Export as singleton
const supabaseDatabaseService = new SupabaseDatabaseService();
export default supabaseDatabaseService;
