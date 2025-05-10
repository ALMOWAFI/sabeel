/**
 * useTensorflow.ts
 * 
 * A React hook for easily integrating TensorFlow.js capabilities into components,
 * with specific focus on Islamic knowledge processing.
 */

import { useState, useEffect, useCallback } from 'react';
import tensorflowService, { 
  TextAnalysisResult,
  RecommendationItem,
  KnowledgeGraphEnhancement
} from '@/services/TensorflowService';

interface UseTensorflowOptions {
  initializeOnMount?: boolean;
}

interface UseTensorflowReturn {
  initialized: boolean;
  loading: boolean;
  error: Error | null;
  analyzeIslamicText: (text: string, options?: any) => Promise<TextAnalysisResult>;
  getRecommendations: (userId: string, options?: any) => Promise<RecommendationItem[]>;
  enhanceKnowledgeGraph: (graphData: any) => Promise<KnowledgeGraphEnhancement>;
  findSimilarTexts: (text: string, options?: any) => Promise<Array<{ text: string; source: string; similarity: number }>>;
  categorizeText: (text: string) => Promise<Record<string, number>>;
}

/**
 * Hook for using TensorFlow.js capabilities in React components
 */
export function useTensorflow(options: UseTensorflowOptions = {}): UseTensorflowReturn {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize TensorFlow service on mount if requested
  useEffect(() => {
    if (options.initializeOnMount) {
      initializeTensorflow();
    }
  }, [options.initializeOnMount]);

  /**
   * Initialize the TensorFlow service
   */
  const initializeTensorflow = useCallback(async () => {
    if (initialized) return true;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await tensorflowService.initialize();
      setInitialized(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize TensorFlow');
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [initialized]);

  /**
   * Ensure TensorFlow is initialized before performing operations
   */
  const ensureInitialized = useCallback(async () => {
    if (!initialized) {
      return await initializeTensorflow();
    }
    return true;
  }, [initialized, initializeTensorflow]);

  /**
   * Analyze Islamic text (Quran, Hadith, scholarly texts)
   */
  const analyzeIslamicText = useCallback(async (
    text: string, 
    options?: { language?: 'ar' | 'en'; type?: 'quran' | 'hadith' | 'scholarly' }
  ): Promise<TextAnalysisResult> => {
    const isInit = await ensureInitialized();
    if (!isInit) {
      throw new Error('TensorFlow service is not initialized');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await tensorflowService.analyzeIslamicText(text, options);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to analyze text');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [ensureInitialized]);

  /**
   * Get personalized content recommendations
   */
  const getRecommendations = useCallback(async (
    userId: string,
    options?: { contentTypes?: string[]; limit?: number; includeReason?: boolean }
  ): Promise<RecommendationItem[]> => {
    const isInit = await ensureInitialized();
    if (!isInit) {
      throw new Error('TensorFlow service is not initialized');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await tensorflowService.getPersonalizedRecommendations(userId, options);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get recommendations');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [ensureInitialized]);

  /**
   * Enhance knowledge graph with AI-generated insights
   */
  const enhanceKnowledgeGraph = useCallback(async (
    graphData: any
  ): Promise<KnowledgeGraphEnhancement> => {
    const isInit = await ensureInitialized();
    if (!isInit) {
      throw new Error('TensorFlow service is not initialized');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await tensorflowService.enhanceKnowledgeGraph(graphData);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to enhance knowledge graph');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [ensureInitialized]);

  /**
   * Find semantically similar Islamic texts
   */
  const findSimilarTexts = useCallback(async (
    text: string,
    options?: { corpus?: 'quran' | 'hadith' | 'tafsir' | 'all'; limit?: number }
  ): Promise<Array<{ text: string; source: string; similarity: number }>> => {
    const isInit = await ensureInitialized();
    if (!isInit) {
      throw new Error('TensorFlow service is not initialized');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await tensorflowService.findSimilarTexts(text, options);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to find similar texts');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [ensureInitialized]);

  /**
   * Categorize Islamic text by topic, madhab, etc.
   */
  const categorizeText = useCallback(async (
    text: string
  ): Promise<Record<string, number>> => {
    const isInit = await ensureInitialized();
    if (!isInit) {
      throw new Error('TensorFlow service is not initialized');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await tensorflowService.categorizeIslamicText(text);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to categorize text');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [ensureInitialized]);

  return {
    initialized,
    loading,
    error,
    analyzeIslamicText,
    getRecommendations,
    enhanceKnowledgeGraph,
    findSimilarTexts,
    categorizeText
  };
}

export default useTensorflow;
