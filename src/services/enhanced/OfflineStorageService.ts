/**
 * Enhanced Offline Storage Service
 * 
 * This service uses localforage to provide robust offline storage capabilities
 * for Islamic scholarly content, allowing users to access critical resources
 * even without internet connectivity.
 */

import localforage from 'localforage';

// Initialize localforage with custom settings for Islamic content
localforage.config({
  name: 'SabeelOfflineStorage',
  storeName: 'islamic_knowledge',
  description: 'Storage for Islamic scholarly content and resources'
});

// Namespaces for different types of content
export enum ContentNamespace {
  SCHOLAR_PROFILES = 'scholars',
  MESSIRI_CONCEPTS = 'messiri_concepts',
  QURAN = 'quran',
  HADITH = 'hadith',
  USER_NOTES = 'user_notes',
  VERIFICATION_RESULTS = 'verification_results',
  FAVORITES = 'favorites',
  READING_HISTORY = 'reading_history'
}

// Interface for stored Islamic content
export interface IslamicContent {
  id: string;
  title: string;
  content: string;
  source?: string;
  author?: string;
  dateAdded: number;
  language: 'ar' | 'en';
  type: 'concept' | 'article' | 'book_excerpt' | 'verification' | 'note';
  tags: string[];
  relatedIds?: string[];
}

// Interface for scholar profiles
export interface ScholarProfile {
  id: string;
  name: string;
  arabicName: string;
  era: string;
  specialty: string[];
  majorWorks: { title: string; description: string }[];
  biography: string;
  imageUrl?: string;
}

class OfflineStorageService {
  private static instance: OfflineStorageService;

  private constructor() {
    this.initializeStorageStructure();
  }

  public static getInstance(): OfflineStorageService {
    if (!OfflineStorageService.instance) {
      OfflineStorageService.instance = new OfflineStorageService();
    }
    return OfflineStorageService.instance;
  }

  /**
   * Initialize the storage structure with required namespaces
   */
  private async initializeStorageStructure(): Promise<void> {
    // Ensure each namespace exists by checking for a metadata object
    for (const namespace of Object.values(ContentNamespace)) {
      const metadataKey = `${namespace}_metadata`;
      const exists = await localforage.getItem(metadataKey);
      
      if (!exists) {
        await localforage.setItem(metadataKey, {
          created: Date.now(),
          lastUpdated: Date.now(),
          itemCount: 0
        });
      }
    }
  }

  /**
   * Store Islamic content with proper namespace organization
   */
  public async storeIslamicContent(
    namespace: ContentNamespace,
    content: IslamicContent
  ): Promise<void> {
    try {
      const key = `${namespace}:${content.id}`;
      await localforage.setItem(key, content);
      
      // Update metadata
      const metadataKey = `${namespace}_metadata`;
      const metadata = await localforage.getItem(metadataKey) as any || { itemCount: 0 };
      metadata.lastUpdated = Date.now();
      metadata.itemCount++;
      await localforage.setItem(metadataKey, metadata);
      
      console.log(`Successfully stored content: ${content.title} in namespace: ${namespace}`);
    } catch (error) {
      console.error(`Error storing content in ${namespace}:`, error);
      throw error;
    }
  }

  /**
   * Retrieve Islamic content from storage
   */
  public async getIslamicContent(
    namespace: ContentNamespace,
    id: string
  ): Promise<IslamicContent | null> {
    try {
      const key = `${namespace}:${id}`;
      return await localforage.getItem(key) as IslamicContent;
    } catch (error) {
      console.error(`Error retrieving content ${id} from ${namespace}:`, error);
      return null;
    }
  }

  /**
   * List all items in a namespace
   */
  public async listNamespaceContent(
    namespace: ContentNamespace
  ): Promise<IslamicContent[]> {
    const results: IslamicContent[] = [];
    
    try {
      await localforage.iterate((value, key) => {
        if (key.startsWith(`${namespace}:`)) {
          results.push(value as IslamicContent);
        }
      });
      
      return results;
    } catch (error) {
      console.error(`Error listing content in namespace ${namespace}:`, error);
      return [];
    }
  }

  /**
   * Store scholar profile information
   */
  public async storeScholarProfile(profile: ScholarProfile): Promise<void> {
    try {
      const key = `${ContentNamespace.SCHOLAR_PROFILES}:${profile.id}`;
      await localforage.setItem(key, profile);
      
      // Update metadata
      const metadataKey = `${ContentNamespace.SCHOLAR_PROFILES}_metadata`;
      const metadata = await localforage.getItem(metadataKey) as any || { itemCount: 0 };
      metadata.lastUpdated = Date.now();
      metadata.itemCount++;
      await localforage.setItem(metadataKey, metadata);
      
      console.log(`Successfully stored scholar profile: ${profile.name}`);
    } catch (error) {
      console.error(`Error storing scholar profile:`, error);
      throw error;
    }
  }

  /**
   * Get scholar profile by ID
   */
  public async getScholarProfile(id: string): Promise<ScholarProfile | null> {
    try {
      const key = `${ContentNamespace.SCHOLAR_PROFILES}:${id}`;
      return await localforage.getItem(key) as ScholarProfile;
    } catch (error) {
      console.error(`Error retrieving scholar profile ${id}:`, error);
      return null;
    }
  }

  /**
   * Search for Islamic content across namespaces
   */
  public async searchIslamicContent(
    query: string,
    namespaces: ContentNamespace[] = Object.values(ContentNamespace)
  ): Promise<IslamicContent[]> {
    const results: IslamicContent[] = [];
    const lowerQuery = query.toLowerCase();
    
    try {
      for (const namespace of namespaces) {
        const namespaceContent = await this.listNamespaceContent(namespace);
        
        const matchingContent = namespaceContent.filter(item => 
          item.title.toLowerCase().includes(lowerQuery) ||
          item.content.toLowerCase().includes(lowerQuery) ||
          item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
        
        results.push(...matchingContent);
      }
      
      return results;
    } catch (error) {
      console.error(`Error searching for content with query "${query}":`, error);
      return [];
    }
  }

  /**
   * Delete Islamic content from storage
   */
  public async deleteIslamicContent(
    namespace: ContentNamespace,
    id: string
  ): Promise<boolean> {
    try {
      const key = `${namespace}:${id}`;
      await localforage.removeItem(key);
      
      // Update metadata
      const metadataKey = `${namespace}_metadata`;
      const metadata = await localforage.getItem(metadataKey) as any;
      if (metadata) {
        metadata.lastUpdated = Date.now();
        metadata.itemCount = Math.max(0, metadata.itemCount - 1);
        await localforage.setItem(metadataKey, metadata);
      }
      
      console.log(`Successfully deleted content with ID: ${id} from namespace: ${namespace}`);
      return true;
    } catch (error) {
      console.error(`Error deleting content ${id} from ${namespace}:`, error);
      return false;
    }
  }

  /**
   * Get storage usage statistics
   */
  public async getStorageStats(): Promise<{
    totalItems: number;
    namespaceStats: Record<ContentNamespace, { count: number; lastUpdated: number }>;
  }> {
    const stats = {
      totalItems: 0,
      namespaceStats: {} as Record<ContentNamespace, { count: number; lastUpdated: number }>
    };
    
    try {
      for (const namespace of Object.values(ContentNamespace)) {
        const metadataKey = `${namespace}_metadata`;
        const metadata = await localforage.getItem(metadataKey) as any || { itemCount: 0, lastUpdated: 0 };
        
        stats.namespaceStats[namespace] = {
          count: metadata.itemCount,
          lastUpdated: metadata.lastUpdated
        };
        
        stats.totalItems += metadata.itemCount;
      }
      
      return stats;
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return stats;
    }
  }
  
  /**
   * Save a piece of content to user favorites
   */
  public async addToFavorites(content: IslamicContent): Promise<void> {
    const favoriteItem = {
      ...content,
      dateAdded: Date.now(),
      tags: [...content.tags, 'favorite']
    };
    
    await this.storeIslamicContent(ContentNamespace.FAVORITES, favoriteItem);
  }
  
  /**
   * Log reading activity for personalized recommendations
   */
  public async logReadingActivity(contentId: string, namespace: ContentNamespace): Promise<void> {
    try {
      const content = await this.getIslamicContent(namespace, contentId);
      if (!content) return;
      
      const historyKey = `${ContentNamespace.READING_HISTORY}:${contentId}`;
      const existingRecord = await localforage.getItem(historyKey) as any || { 
        contentId, 
        namespace,
        title: content.title,
        readCount: 0,
        lastRead: 0,
        readDates: []
      };
      
      existingRecord.readCount++;
      existingRecord.lastRead = Date.now();
      existingRecord.readDates.push(Date.now());
      
      // Keep only the last 10 read dates
      if (existingRecord.readDates.length > 10) {
        existingRecord.readDates = existingRecord.readDates.slice(-10);
      }
      
      await localforage.setItem(historyKey, existingRecord);
      
      // Update metadata
      const metadataKey = `${ContentNamespace.READING_HISTORY}_metadata`;
      const metadata = await localforage.getItem(metadataKey) as any || { itemCount: 0, lastUpdated: 0 };
      metadata.lastUpdated = Date.now();
      await localforage.setItem(metadataKey, metadata);
    } catch (error) {
      console.error('Error logging reading activity:', error);
    }
  }
  
  /**
   * Clear all stored data (use with caution)
   */
  public async clearAllData(): Promise<void> {
    try {
      await localforage.clear();
      console.log('All data cleared from storage');
      // Re-initialize storage structure
      await this.initializeStorageStructure();
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }
}

// Export default instance
export default OfflineStorageService.getInstance();
