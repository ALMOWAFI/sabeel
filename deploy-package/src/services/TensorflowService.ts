/**
 * TensorflowService.ts
 * 
 * This service provides AI-powered features for Islamic knowledge processing, text analysis,
 * and knowledge graph enhancement. Updated to work with Supabase backend.
 */

import supabase from '@/lib/supabaseConfig';
import { API_ENDPOINTS } from '@/lib/config';
import axios from 'axios';

// Define types for the service
export interface TextAnalysisResult {
  topics: Array<{ name: string; score: number }>;
  sentiment: { positive: number; neutral: number; negative: number }; 
  entities: Array<{ name: string; type: string; confidence: number }>;
  summary: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  type: 'course' | 'resource' | 'book' | 'video' | 'scholar';
  score: number;
  description?: string;
  imageUrl?: string;
  url?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  steps: Array<{
    id: string;
    title: string;
    type: 'course' | 'resource' | 'book' | 'video' | 'practice';
    completed: boolean;
    estimatedTime: number; // minutes
    resourceId: string;
  }>;
  progress: number; // 0-100
  tags: string[];
  isPersonalized: boolean;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  contentType: 'article' | 'book' | 'video' | 'course' | 'scholar' | 'question';
  relevanceScore: number;
  highlights: string[];
  url: string;
  imageUrl?: string;
  timestamp: string;
}

export interface KnowledgeGraphEnhancement {
  suggestedNodes: Array<{ id: string; label: string; type: string; confidence: number }>;
  suggestedEdges: Array<{ source: string; target: string; type: string; confidence: number }>;
  nodeClassifications: Array<{ nodeId: string; categories: Record<string, number> }>;
}

/**
 * TensorflowService - AI-powered features for Sabeel platform
 * 
 * Provides intelligent content recommendations, personalized learning paths,
 * and enhanced search functionality using TensorFlow.js
 */
class TensorflowService {
  private initialized: boolean = false;
  private useServerSide: boolean = true;
  private userEmbedding: Float32Array | null = null;
  private userInterests: string[] = [];
  private userLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  
  constructor() {
    // Determine whether to use server-side or client-side processing
    // For complex models, we'll default to server-side
    this.useServerSide = process.env.TENSORFLOW_CLIENT_SIDE !== 'true';
    this.initializeService();
  }
  
  /**
   * Initialize the service and load necessary models
   */
  private async initializeService(): Promise<void> {
    try {
      // If user is logged in, load user profile for personalization
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get user profile data from Supabase
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profile) {
          this.userInterests = profile.interests || [];
          this.userLevel = this.determineUserLevel(profile);
          await this.generateUserEmbedding(profile);
        }
      }
      
      this.initialized = true;
      console.log('TensorflowService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize TensorflowService:', error);
    }
  }
  
  /**
   * Ensure the service is initialized before use
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initializeService();
    }
  }
  
  /**
   * Determine user knowledge level based on their achievements and activity
   */
  private determineUserLevel(user: any): 'beginner' | 'intermediate' | 'advanced' {
    const { level = 1, achievements = [] } = user;
    
    if (level >= 10 || achievements?.length >= 20) {
      return 'advanced';
    } else if (level >= 5 || achievements?.length >= 10) {
      return 'intermediate';
    }
    
    return 'beginner';
  }
  
  /**
   * Generate embedding vector for user based on their profile and activity
   */
  private async generateUserEmbedding(user: any): Promise<void> {
    try {
      if (this.useServerSide) {
        // Use server-side API to generate embedding
        const response = await axios.post(`${API_ENDPOINTS.TEXT_ANALYSIS}/generate-embedding`, {
          text: this.formatUserProfileForEmbedding(user)
        });
        
        this.userEmbedding = new Float32Array(response.data.embedding);
      } else {
        // Client-side embedding generation would go here if implemented
        // This would require loading TensorFlow.js in the browser
        console.warn('Client-side embedding generation not implemented');
      }
    } catch (error) {
      console.error('Failed to generate user embedding:', error);
    }
  }
  
  /**
   * Format user profile as text for embedding
   */
  private formatUserProfileForEmbedding(user: any): string {
    return `
      interests: ${user.interests?.join(', ') || ''}
      specialty: ${user.specialty || ''}
      recent topics: ${user.recent_topics?.join(', ') || ''}
      preferred content: ${user.preferred_content_types?.join(', ') || ''}
      level: ${user.level || 1}
    `;
  }
  
  /**
   * Get personalized recommendations based on user profile and behavior
   */
  public async getPersonalizedRecommendations(options: { 
    contentTypes?: string[]; 
    limit?: number; 
    includeReason?: boolean 
  } = {}): Promise<RecommendationItem[]> {
    await this.ensureInitialized();
    
    const { contentTypes, limit = 10, includeReason = false } = options;
    
    try {
      // For logged out users, provide general recommendations
      if (!this.userEmbedding) {
        return this.getGeneralRecommendations(limit);
      }
      
      // Get recommendations from API with user embedding
      const response = await axios.post<{recommendations: RecommendationItem[]}>(`${API_ENDPOINTS.RECOMMENDATIONS}/personalized`, {
        userEmbedding: Array.from(this.userEmbedding),
        userInterests: this.userInterests,
        userLevel: this.userLevel,
        contentTypes,
        limit,
        includeReason
      });
      
      return response.data.recommendations;
    } catch (error) {
      console.error('Failed to get personalized recommendations:', error);
      return this.getGeneralRecommendations(limit);
    }
  }
  
  /**
   * Get general, non-personalized recommendations
   */
  private async getGeneralRecommendations(limit: number = 10): Promise<RecommendationItem[]> {
    try {
      const response = await axios.get<{recommendations: RecommendationItem[]}>(`${API_ENDPOINTS.RECOMMENDATIONS}/general?limit=${limit}`);
      return response.data.recommendations;
    } catch (error) {
      console.error('Failed to get general recommendations:', error);
      return [];
    }
  }
  
  /**
   * Generate a personalized learning path for the user
   */
  public async generatePersonalizedLearningPath(topic: string): Promise<LearningPath> {
    await this.ensureInitialized();
    
    try {
      const response = await axios.post<{learningPath: LearningPath}>(`${API_ENDPOINTS.RECOMMENDATIONS}/learning-path`, {
        topic,
        userLevel: this.userLevel,
        userInterests: this.userInterests,
        userEmbedding: this.userEmbedding ? Array.from(this.userEmbedding) : null
      });
      
      return response.data.learningPath;
    } catch (error) {
      console.error('Failed to generate learning path:', error);
      throw new Error('Failed to generate learning path');
    }
  }
  
  /**
   * Get pre-defined learning paths with user progress
   */
  public async getLearningPaths(limit: number = 5): Promise<LearningPath[]> {
    await this.ensureInitialized();
    
    try {
      const response = await axios.get<{learningPaths: LearningPath[]}>(`${API_ENDPOINTS.RECOMMENDATIONS}/learning-paths?limit=${limit}`);
      return response.data.learningPaths;
    } catch (error) {
      console.error('Failed to get learning paths:', error);
      return [];
    }
  }
  
  /**
   * Perform semantic search on Islamic content
   */
  public async semanticSearch(query: string, options: {
    contentTypes?: string[];
    limit?: number;
  } = {}): Promise<SearchResult[]> {
    await this.ensureInitialized();
    
    const { contentTypes, limit = 10 } = options;
    
    try {
      // Generate embedding for the search query
      let queryEmbedding;
      
      if (this.useServerSide) {
        const response = await axios.post<{embedding: number[]}>(`${API_ENDPOINTS.TEXT_ANALYSIS}/generate-embedding`, {
          text: query
        });
        queryEmbedding = response.data.embedding;
      } else {
        // Client-side implementation would go here
        console.warn('Client-side embedding generation not implemented');
        throw new Error('Client-side embedding generation not implemented');
      }
      
      // Search using the embedding
      const response = await axios.post<{results: SearchResult[]}>(`${API_ENDPOINTS.TEXT_ANALYSIS}/semantic-search`, {
        embedding: queryEmbedding,
        contentTypes,
        limit
      });
      
      return response.data.results;
    } catch (error) {
      console.error('Failed to perform semantic search:', error);
      return [];
    }
  }
  
  /**
   * Analyze Islamic text for topics, entities, sentiment, and summary
   */
  public async analyzeIslamicText(text: string, options: { 
    language?: 'ar' | 'en'; 
    type?: 'quran' | 'hadith' | 'scholarly' 
  } = {}): Promise<TextAnalysisResult> {
    await this.ensureInitialized();
    
    const { language, type } = options;
    const textType = type || this.detectTextType(text);
    
    try {
      const response = await axios.post(`${API_ENDPOINTS.TEXT_ANALYSIS}/analyze`, {
        text,
        language,
        textType
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to analyze text:', error);
      // Return a basic analysis with empty data
      return {
        topics: [],
        sentiment: { positive: 0, neutral: 1, negative: 0 },
        entities: [],
        summary: ''
      } as TextAnalysisResult;
    }
  }
  
  /**
   * Find related content based on provided text
   */
  public async findRelatedContent(text: string, limit: number = 5): Promise<any[]> {
    await this.ensureInitialized();
    
    try {
      const response = await axios.post<{relatedContent: any[]}>(`${API_ENDPOINTS.TEXT_ANALYSIS}/related-content`, {
        text,
        limit
      });
      
      return response.data.relatedContent;
    } catch (error) {
      console.error('Failed to find related content:', error);
      return [];
    }
  }
  
  /**
   * Enhance knowledge graph with AI-generated insights
   */
  public async enhanceKnowledgeGraph(graphData: any): Promise<KnowledgeGraphEnhancement> {
    await this.ensureInitialized();
    
    try {
      const response = await axios.post(`${API_ENDPOINTS.TEXT_ANALYSIS}/enhance-graph`, {
        graphData
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to enhance knowledge graph:', error);
      return {
        suggestedNodes: [],
        suggestedEdges: [],
        nodeClassifications: []
      };
    }
  }
  
  /**
   * Simple detection of text type based on patterns
   */
  private detectTextType(text: string): 'quran' | 'hadith' | 'scholarly' {
    // Simplified detection logic based on patterns
    if (/\b(?:surah|ayah|quran|\u0633\u0648\u0631\u0629|\u0622\u064a\u0629|\u0627\u0644\u0642\u0631\u0622\u0646)\b/i.test(text)) {
      return 'quran';
    } else if (/\b(?:narrated|hadith|reported|\u062d\u062f\u064a\u062b|\u0631\u0648\u0649|\u0623\u062e\u0628\u0631\u0646\u0627)\b/i.test(text)) {
      return 'hadith';
    }
    
    return 'scholarly';
  }
}

// Create a singleton instance
const tensorflowService = new TensorflowService();
export default tensorflowService;
