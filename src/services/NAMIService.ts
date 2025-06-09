/**
 * NAMIService.ts
 * 
 * NAMI (النظام الإسلامي للذكاء الاصطناعي) - Islamic System for Artificial Intelligence
 * 
 * This service implements guidelines and protections for AI usage according to Islamic principles.
 * It provides content verification, query enhancement with Islamic context, and guidelines
 * for appropriate AI usage in Islamic contexts.
 */

import { createClient } from '@supabase/supabase-js';

// Content categories that need special attention
export enum ContentCategory {
  GENERAL = 'general',
  QURAN = 'quran',
  HADITH = 'hadith',
  FIQH = 'fiqh',
  AQEEDAH = 'aqeedah',
  SEERAH = 'seerah',
  FATWA = 'fatwa'
}

// Verification levels
export enum VerificationLevel {
  AUTOMATIC = 'automatic',   // AI can verify
  SCHOLAR_LIGHT = 'scholar_light', // Quick scholar review
  SCHOLAR_DEEP = 'scholar_deep',   // In-depth scholar review
  COMMITTEE = 'committee'    // Multiple scholars must agree
}

// Content verification result
export interface ContentVerificationResult {
  isValid: boolean;
  concerns: string[];
  suggestions: string[];
  verificationLevel: VerificationLevel;
  category: ContentCategory;
}

// Query enhancement result
export interface QueryEnhancementResult {
  originalQuery: string;
  enhancedQuery: string;
  islamicContext: string;
  safeguards: string[];
}

export class NAMIService {
  private static instance: NAMIService;
  private supabase: any;
  private islamicGuidelines: Map<string, string[]>;
  private prohibitedContent: string[];
  private sensitiveTopics: string[];
  private scholarReviewCategories: Set<ContentCategory>;
  
  private constructor() {
    // Initialize Supabase client for storing verification results
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Initialize Islamic guidelines
    this.islamicGuidelines = new Map<string, string[]>();
    this.loadGuidelines();
    
    // Define prohibited content patterns
    this.prohibitedContent = [
      'shirk', // Associating partners with Allah
      'kufr', // Disbelief
      'bidah', // Innovation in religious matters
      'explicit sexual content',
      'promotion of violence',
      'disrespect to prophets',
      'mockery of religious practices',
      'distortion of Quranic verses',
      'fabricated hadith',
      'promotion of sectarian division'
    ];
    
    // Define sensitive topics that need careful handling
    this.sensitiveTopics = [
      'differences between madhabs',
      'controversial historical events',
      'modern controversial issues',
      'political matters',
      'interfaith relations',
      'gender relations',
      'modern financial practices'
    ];
    
    // Define categories that always need scholar review
    this.scholarReviewCategories = new Set([
      ContentCategory.QURAN,
      ContentCategory.HADITH,
      ContentCategory.FATWA,
      ContentCategory.AQEEDAH
    ]);
  }
  
  /**
   * Singleton pattern - get the instance of NAMIService
   */
  public static getInstance(): NAMIService {
    if (!NAMIService.instance) {
      NAMIService.instance = new NAMIService();
    }
    return NAMIService.instance;
  }
  
  /**
   * Load Islamic guidelines from the backend
   */
  private async loadGuidelines(): Promise<void> {
    try {
      // Try to load guidelines from Supabase
      const { data, error } = await this.supabase
        .from('islamic_ai_guidelines')
        .select('*');
      
      if (error) {
        console.error('Error loading guidelines:', error);
        this.useDefaultGuidelines();
        return;
      }
      
      if (data && data.length > 0) {
        data.forEach((guideline: any) => {
          this.islamicGuidelines.set(
            guideline.category,
            guideline.rules
          );
        });
      } else {
        this.useDefaultGuidelines();
      }
    } catch (error) {
      console.error('Failed to load guidelines:', error);
      this.useDefaultGuidelines();
    }
  }
  
  /**
   * Use default guidelines if unable to load from backend
   */
  private useDefaultGuidelines(): void {
    // General guidelines
    this.islamicGuidelines.set('general', [
      'Content should respect Islamic values and principles',
      'Avoid promoting behaviors contrary to Islamic teachings',
      'Respect religious scholars and their opinions',
      'Prioritize authentic sources of Islamic knowledge',
      'Be clear about levels of certainty in religious matters'
    ]);
    
    // Quran-specific guidelines
    this.islamicGuidelines.set('quran', [
      'Always verify Quranic quotes against authentic sources',
      'Provide context for Quranic verses when quoted',
      'Include both Arabic text and translation when possible',
      'Indicate the surah and verse number for any Quranic citation',
      'Do not attempt tafsir (exegesis) without scholarly sources'
    ]);
    
    // Hadith-specific guidelines
    this.islamicGuidelines.set('hadith', [
      'Verify authenticity status of hadith before sharing',
      'Include complete chain of narration when available',
      'Cite the hadith collection source (e.g., Bukhari, Muslim)',
      'Indicate authenticity classification (sahih, hasan, daif, etc.)',
      'Provide context for the hadith when relevant'
    ]);
    
    // Fiqh-specific guidelines
    this.islamicGuidelines.set('fiqh', [
      'Acknowledge different opinions across madhabs when relevant',
      'Clarify which madhab or scholar\'s opinion is being presented',
      'Avoid presenting one fiqh opinion as the only valid view',
      'Note the reasoning (dalil) behind fiqh positions when possible',
      'Distinguish between obligatory, recommended, and permissible acts'
    ]);
  }
  
  /**
   * Verify content against Islamic guidelines
   */
  public async verifyContent(
    content: string,
    category: ContentCategory = ContentCategory.GENERAL
  ): Promise<ContentVerificationResult> {
    // Check if this category requires scholar review
    const requiredVerificationLevel = this.getRequiredVerificationLevel(category, content);
    
    // If automatic verification is allowed, proceed
    const concerns: string[] = [];
    const suggestions: string[] = [];
    
    // Check for prohibited content
    for (const prohibited of this.prohibitedContent) {
      if (content.toLowerCase().includes(prohibited.toLowerCase())) {
        concerns.push(`Content contains prohibited element: ${prohibited}`);
      }
    }
    
    // Check for sensitive topics
    for (const sensitive of this.sensitiveTopics) {
      if (content.toLowerCase().includes(sensitive.toLowerCase())) {
        suggestions.push(`Content touches on sensitive topic: ${sensitive}. Consider adding additional context or scholarly references.`);
      }
    }
    
    // Apply category-specific guidelines
    const categoryGuidelines = this.islamicGuidelines.get(category) || this.islamicGuidelines.get('general') || [];
    
    for (const guideline of categoryGuidelines) {
      // Simplified check - in a real implementation, this would use more sophisticated
      // natural language processing to check against guidelines
      const guidelineKey = guideline.split(' ')[0].toLowerCase();
      
      if (!content.toLowerCase().includes(guidelineKey) && this.shouldCheckGuideline(guideline, category)) {
        suggestions.push(`Consider adherence to guideline: ${guideline}`);
      }
    }
    
    // Log verification attempt
    await this.logVerificationAttempt(content, category, concerns, suggestions, requiredVerificationLevel);
    
    return {
      isValid: concerns.length === 0,
      concerns,
      suggestions,
      verificationLevel: requiredVerificationLevel,
      category
    };
  }
  
  /**
   * Determine if a specific guideline should be checked for the given category
   */
  private shouldCheckGuideline(guideline: string, category: ContentCategory): boolean {
    // Logic to determine if this guideline applies to this category
    // This is a simplified implementation
    if (category === ContentCategory.QURAN && guideline.includes('tafsir')) {
      return true;
    }
    
    if (category === ContentCategory.HADITH && (guideline.includes('authenticity') || guideline.includes('chain'))) {
      return true;
    }
    
    // Default to checking the guideline
    return true;
  }
  
  /**
   * Determine the required verification level for content
   */
  private getRequiredVerificationLevel(category: ContentCategory, content: string): VerificationLevel {
    // Quran, Hadith, Fatwa, and Aqeedah always need scholar review
    if (this.scholarReviewCategories.has(category)) {
      // Lengthy content or content with religious rulings requires deep review
      if (content.length > 1000 || content.toLowerCase().includes('ruling') || content.toLowerCase().includes('حكم')) {
        return VerificationLevel.SCHOLAR_DEEP;
      }
      return VerificationLevel.SCHOLAR_LIGHT;
    }
    
    // Check for content that contains direct quotes
    if (content.includes('"') || content.includes('\'') || content.includes('﴿')) {
      return VerificationLevel.SCHOLAR_LIGHT;
    }
    
    // Check for controversial topics requiring committee review
    const controversialPatterns = ['controversy', 'disagreement', 'dispute', 'خلاف', 'اختلاف'];
    for (const pattern of controversialPatterns) {
      if (content.toLowerCase().includes(pattern)) {
        return VerificationLevel.COMMITTEE;
      }
    }
    
    // Default to automatic verification for general content
    return VerificationLevel.AUTOMATIC;
  }
  
  /**
   * Log verification attempt to the database
   */
  private async logVerificationAttempt(
    content: string,
    category: ContentCategory,
    concerns: string[],
    suggestions: string[],
    verificationLevel: VerificationLevel
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('content_verifications')
        .insert({
          content_sample: content.substring(0, 255), // Store sample for reference
          category,
          has_concerns: concerns.length > 0,
          concern_count: concerns.length,
          suggestion_count: suggestions.length,
          verification_level: verificationLevel,
          timestamp: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error logging verification:', error);
      }
    } catch (error) {
      console.error('Failed to log verification attempt:', error);
    }
  }
  
  /**
   * Enhance a query with Islamic context
   */
  public enhanceQuery(query: string, category: ContentCategory = ContentCategory.GENERAL): QueryEnhancementResult {
    let enhancedQuery = query;
    let islamicContext = '';
    const safeguards: string[] = [];
    
    // Add category-specific context
    switch (category) {
      case ContentCategory.QURAN:
        enhancedQuery = `[QURAN CONTEXT] ${query}`;
        islamicContext = 'This query relates to the Quran, the holy book of Islam, which Muslims believe to be the word of Allah revealed to Prophet Muhammad through Angel Gabriel.';
        safeguards.push('Verify all Quranic references with authentic sources');
        safeguards.push('Include surah and verse numbers for any Quranic quotations');
        break;
        
      case ContentCategory.HADITH:
        enhancedQuery = `[HADITH CONTEXT] ${query}`;
        islamicContext = 'This query relates to Hadith, the recorded sayings and actions of Prophet Muhammad, which form the second primary source of Islamic guidance after the Quran.';
        safeguards.push('Only reference authenticated hadith from recognized collections');
        safeguards.push('Indicate the authenticity classification of each hadith');
        break;
        
      case ContentCategory.FIQH:
        enhancedQuery = `[FIQH CONTEXT] ${query}`;
        islamicContext = 'This query relates to Islamic jurisprudence (Fiqh), which deals with the interpretation and application of Islamic law based on the Quran and Sunnah.';
        safeguards.push('Present multiple scholarly perspectives when applicable');
        safeguards.push('Clarify which madhab or scholarly opinion is being referenced');
        break;
        
      case ContentCategory.AQEEDAH:
        enhancedQuery = `[AQEEDAH CONTEXT] ${query}`;
        islamicContext = 'This query relates to Islamic theology and creed (Aqeedah), which concerns beliefs about Allah, the prophets, angels, divine books, the Day of Judgment, and predestination.';
        safeguards.push('Prioritize consensus views on matters of creed');
        safeguards.push('Note areas where differences exist among orthodox schools of thought');
        break;
        
      default:
        enhancedQuery = `[ISLAMIC CONTEXT] ${query}`;
        islamicContext = 'This query should be addressed with consideration for Islamic values and principles based on the Quran and authentic Sunnah.';
        safeguards.push('Ensure responses align with core Islamic teachings');
        break;
    }
    
    // Add general safeguards
    safeguards.push('Provide references to sources when possible');
    safeguards.push('Distinguish between definitive rulings and scholarly opinions');
    
    return {
      originalQuery: query,
      enhancedQuery,
      islamicContext,
      safeguards
    };
  }
  
  /**
   * Determine if content requires scholar verification
   */
  public requiresScholarVerification(content: string, category: ContentCategory): boolean {
    const verificationLevel = this.getRequiredVerificationLevel(category, content);
    return verificationLevel !== VerificationLevel.AUTOMATIC;
  }
  
  /**
   * Submit content for scholar review
   * 
   * This method sends content for review by qualified Islamic scholars
   * and returns a review ID that can be used to check the status later
   */
  public async submitForScholarReview(
    content: string,
    category: ContentCategory,
    userId: string,
    notes?: string
  ): Promise<string> {
    try {
      // Determine required verification level
      const verificationLevel = this.getRequiredVerificationLevel(category, content);
      
      // Insert into scholar_reviews table
      const { data, error } = await this.supabase
        .from('nami_scholar_reviews')
        .insert({
          user_id: userId,
          content: content,
          category: category,
          notes: notes || '',
          verification_level: verificationLevel,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data.id;
    } catch (error: any) {
      console.error('Failed to submit for scholar review:', error);
      throw new Error(`Failed to submit for scholar review: ${error.message}`);
    }
  }
  
  /**
   * Get the status of a scholar review
   */
  public async getScholarReviewStatus(reviewId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('scholar_review_queue')
        .select('*')
        .eq('id', reviewId)
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    } catch (error: any) {
      console.error('Failed to get scholar review status:', error);
      throw new Error(`Failed to get scholar review status: ${error.message}`);
    }
  }
  
  /**
   * Get guidelines for a specific category
   */
  public getGuidelines(category: ContentCategory = ContentCategory.GENERAL): string[] {
    return this.islamicGuidelines.get(category.toString()) || 
           this.islamicGuidelines.get('general') || 
           ['Ensure content adheres to Islamic principles and values'];
  }
}

// Export default instance
export default NAMIService.getInstance();
