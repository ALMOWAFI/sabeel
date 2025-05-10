/**
 * OfflineContentService.ts
 * 
 * Service for managing offline content storage and synchronization
 * Enables users to access key Islamic content without internet connection
 */

import appwriteAuthBridge, { UserData } from './AppwriteAuthBridge';
import appwriteConfig from '@/lib/appwriteConfig';

// Content types that can be saved offline
export type OfflineContentType = 
  | 'quran'      // Quran chapters and verses
  | 'hadith'     // Hadith collections
  | 'article'    // Articles and lessons
  | 'book'       // Books or book chapters
  | 'dua'        // Supplications
  | 'quiz'       // Quizzes for offline practice
  | 'glossary';  // Islamic terminology glossary

// Interface for content metadata
export interface OfflineContentMetadata {
  id: string;
  title: string;
  type: OfflineContentType;
  size: number;          // Size in bytes
  lastUpdated: string;   // ISO date string
  version: string;       // Content version for sync purposes
  language: string;      // Content language code
  thumbnailUrl?: string; // Small thumbnail for UI display
  isDownloaded: boolean; // Whether content is fully downloaded
  requiredStorage: number; // Required storage in bytes
}

// Interface for download progress tracking
export interface DownloadProgress {
  contentId: string;
  progress: number;     // 0-100 percentage
  bytesDownloaded: number;
  totalBytes: number;
  status: 'pending' | 'downloading' | 'paused' | 'completed' | 'error';
  error?: string;
}

/**
 * Service for managing offline content in Sabeel platform
 * Uses IndexedDB for content storage and ServiceWorker for network interception
 */
class OfflineContentService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'sabeel_offline_content';
  private readonly DB_VERSION = 1;
  private readonly CONTENT_STORE = 'content';
  private readonly METADATA_STORE = 'metadata';
  private serviceWorkerRegistered = false;
  private downloadCallbacks: Map<string, (progress: DownloadProgress) => void> = new Map();
  
  constructor() {
    this.initDatabase();
    this.registerServiceWorker();
  }
  
  /**
   * Initialize IndexedDB database for content storage
   */
  private async initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      
      request.onerror = (event) => {
        console.error('Failed to open offline content database:', event);
        reject(new Error('Failed to open offline content database'));
      };
      
      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log('Offline content database opened successfully');
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create content store
        if (!db.objectStoreNames.contains(this.CONTENT_STORE)) {
          db.createObjectStore(this.CONTENT_STORE, { keyPath: 'id' });
          console.log('Content store created');
        }
        
        // Create metadata store
        if (!db.objectStoreNames.contains(this.METADATA_STORE)) {
          const metadataStore = db.createObjectStore(this.METADATA_STORE, { keyPath: 'id' });
          metadataStore.createIndex('type', 'type', { unique: false });
          metadataStore.createIndex('isDownloaded', 'isDownloaded', { unique: false });
          console.log('Metadata store created');
        }
      };
    });
  }
  
  /**
   * Register service worker for network interception and offline support
   */
  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/offline-sw.js');
        console.log('ServiceWorker registration successful with scope:', registration.scope);
        this.serviceWorkerRegistered = true;
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage);
      } catch (error) {
        console.error('ServiceWorker registration failed:', error);
      }
    }
  }
  
  /**
   * Handle messages from service worker (progress updates, etc.)
   */
  private handleServiceWorkerMessage = (event: MessageEvent): void => {
    const data = event.data;
    
    if (data.type === 'download_progress' && data.contentId) {
      const callback = this.downloadCallbacks.get(data.contentId);
      if (callback) {
        callback({
          contentId: data.contentId,
          progress: data.progress,
          bytesDownloaded: data.bytesDownloaded,
          totalBytes: data.totalBytes,
          status: data.status,
          error: data.error
        });
      }
    }
  };
  
  /**
   * Get available offline content bundles metadata
   */
  public async getAvailableContent(): Promise<OfflineContentMetadata[]> {
    try {
      // In a real implementation, this would fetch from Appwrite
      // For demo, return hardcoded content bundles
      return [
        {
          id: 'quran-ar',
          title: 'القرآن الكريم (عربي)',
          type: 'quran',
          size: 5800000, // ~5.8MB
          lastUpdated: '2025-04-15T00:00:00Z',
          version: '1.0.0',
          language: 'ar',
          thumbnailUrl: '/images/content/quran-ar-thumb.jpg',
          isDownloaded: await this.isContentDownloaded('quran-ar'),
          requiredStorage: 6000000 // ~6MB including index
        },
        {
          id: 'quran-en',
          title: 'Quran (English Translation)',
          type: 'quran',
          size: 4200000, // ~4.2MB
          lastUpdated: '2025-04-15T00:00:00Z',
          version: '1.0.0',
          language: 'en',
          thumbnailUrl: '/images/content/quran-en-thumb.jpg',
          isDownloaded: await this.isContentDownloaded('quran-en'),
          requiredStorage: 4500000 // ~4.5MB including index
        },
        {
          id: 'hadith-bukhari',
          title: 'صحيح البخاري',
          type: 'hadith',
          size: 8500000, // ~8.5MB
          lastUpdated: '2025-04-10T00:00:00Z',
          version: '1.0.0',
          language: 'ar',
          thumbnailUrl: '/images/content/hadith-bukhari-thumb.jpg',
          isDownloaded: await this.isContentDownloaded('hadith-bukhari'),
          requiredStorage: 9000000 // ~9MB including index
        },
        {
          id: 'islamic-glossary',
          title: 'قاموس المصطلحات الإسلامية',
          type: 'glossary',
          size: 1200000, // ~1.2MB
          lastUpdated: '2025-04-05T00:00:00Z',
          version: '1.0.0',
          language: 'ar',
          thumbnailUrl: '/images/content/glossary-thumb.jpg',
          isDownloaded: await this.isContentDownloaded('islamic-glossary'),
          requiredStorage: 1500000 // ~1.5MB including index
        },
        {
          id: 'essential-duas',
          title: 'الأدعية الأساسية',
          type: 'dua',
          size: 800000, // ~800KB
          lastUpdated: '2025-04-01T00:00:00Z',
          version: '1.0.0',
          language: 'ar',
          thumbnailUrl: '/images/content/duas-thumb.jpg',
          isDownloaded: await this.isContentDownloaded('essential-duas'),
          requiredStorage: 1000000 // ~1MB including index
        }
      ];
    } catch (error) {
      console.error('Error fetching available content:', error);
      return [];
    }
  }
  
  /**
   * Check if content is already downloaded
   */
  public async isContentDownloaded(contentId: string): Promise<boolean> {
    if (!this.db) await this.initDatabase();
    
    return new Promise((resolve) => {
      if (!this.db) {
        resolve(false);
        return;
      }
      
      const transaction = this.db.transaction(this.METADATA_STORE, 'readonly');
      const store = transaction.objectStore(this.METADATA_STORE);
      const request = store.get(contentId);
      
      request.onsuccess = () => {
        const metadata = request.result as OfflineContentMetadata;
        resolve(metadata?.isDownloaded || false);
      };
      
      request.onerror = () => {
        resolve(false);
      };
    });
  }
  
  /**
   * Get total storage usage of offline content
   */
  public async getStorageUsage(): Promise<{ used: number; available: number }> {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          available: estimate.quota || 0
        };
      }
      
      return { used: 0, available: 0 };
    } catch (error) {
      console.error('Error getting storage usage:', error);
      return { used: 0, available: 0 };
    }
  }
  
  /**
   * Download content for offline use
   */
  public async downloadContent(
    contentId: string, 
    progressCallback?: (progress: DownloadProgress) => void
  ): Promise<boolean> {
    try {
      // Check if already downloaded
      const isDownloaded = await this.isContentDownloaded(contentId);
      if (isDownloaded) {
        console.log(`Content ${contentId} is already downloaded`);
        return true;
      }
      
      // Register progress callback
      if (progressCallback) {
        this.downloadCallbacks.set(contentId, progressCallback);
      }
      
      // Get content URL from Appwrite (this would be implemented as SDK call in real app)
      const contentUrl = `${appwriteConfig.endpoint}/api/offline-content/${contentId}`;
      
      // Inform service worker to cache this content
      if (this.serviceWorkerRegistered && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'cache_content',
          contentId,
          contentUrl
        });
      } else {
        // Fallback if service worker is not available
        await this.fetchAndStoreContent(contentId, contentUrl, progressCallback);
      }
      
      return true;
    } catch (error) {
      console.error(`Error downloading content ${contentId}:`, error);
      
      // Update progress with error
      if (progressCallback) {
        progressCallback({
          contentId,
          progress: 0,
          bytesDownloaded: 0,
          totalBytes: 0,
          status: 'error',
          error: (error as Error).message
        });
      }
      
      return false;
    }
  }
  
  /**
   * Fallback method to fetch and store content without service worker
   */
  private async fetchAndStoreContent(
    contentId: string,
    contentUrl: string,
    progressCallback?: (progress: DownloadProgress) => void
  ): Promise<void> {
    try {
      // Fetch with progress tracking
      const response = await fetch(contentUrl);
      const reader = response.body?.getReader();
      const contentLength = Number(response.headers.get('Content-Length')) || 0;
      let receivedLength = 0;
      let chunks: Uint8Array[] = [];
      
      if (!reader) throw new Error('Failed to get response reader');
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        receivedLength += value.length;
        
        // Report progress
        if (progressCallback) {
          const progress = Math.round((receivedLength / contentLength) * 100);
          progressCallback({
            contentId,
            progress,
            bytesDownloaded: receivedLength,
            totalBytes: contentLength,
            status: 'downloading'
          });
        }
      }
      
      // Concatenate chunks
      const contentArrayBuffer = this.concatenateArrayBuffers(chunks);
      
      // Store content in IndexedDB
      await this.storeContent(contentId, contentArrayBuffer);
      
      // Update metadata to mark as downloaded
      await this.updateContentMetadata(contentId, { isDownloaded: true });
      
      // Final progress callback
      if (progressCallback) {
        progressCallback({
          contentId,
          progress: 100,
          bytesDownloaded: receivedLength,
          totalBytes: contentLength,
          status: 'completed'
        });
      }
    } catch (error) {
      console.error(`Error in fetchAndStoreContent for ${contentId}:`, error);
      throw error;
    }
  }
  
  /**
   * Concatenate array buffers from chunks
   */
  private concatenateArrayBuffers(arrays: Uint8Array[]): ArrayBuffer {
    const totalLength = arrays.reduce((acc, value) => acc + value.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    
    for (const array of arrays) {
      result.set(array, offset);
      offset += array.length;
    }
    
    return result.buffer;
  }
  
  /**
   * Store content in IndexedDB
   */
  private async storeContent(contentId: string, data: ArrayBuffer): Promise<void> {
    if (!this.db) await this.initDatabase();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = this.db.transaction(this.CONTENT_STORE, 'readwrite');
      const store = transaction.objectStore(this.CONTENT_STORE);
      
      const request = store.put({
        id: contentId,
        data,
        timestamp: new Date().toISOString()
      });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to store content'));
    });
  }
  
  /**
   * Update content metadata
   */
  private async updateContentMetadata(
    contentId: string,
    updates: Partial<OfflineContentMetadata>
  ): Promise<void> {
    if (!this.db) await this.initDatabase();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = this.db.transaction(this.METADATA_STORE, 'readwrite');
      const store = transaction.objectStore(this.METADATA_STORE);
      
      // First get current metadata
      const getRequest = store.get(contentId);
      
      getRequest.onsuccess = () => {
        const currentMetadata = getRequest.result as OfflineContentMetadata;
        const updatedMetadata = {
          ...currentMetadata,
          ...updates,
          lastUpdated: new Date().toISOString()
        };
        
        // Put updated metadata
        const putRequest = store.put(updatedMetadata);
        
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(new Error('Failed to update metadata'));
      };
      
      getRequest.onerror = () => reject(new Error('Failed to get metadata for update'));
    });
  }
  
  /**
   * Get downloaded content
   */
  public async getDownloadedContent(type?: OfflineContentType): Promise<OfflineContentMetadata[]> {
    if (!this.db) await this.initDatabase();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = this.db.transaction(this.METADATA_STORE, 'readonly');
      const store = transaction.objectStore(this.METADATA_STORE);
      
      // Use index to get only downloaded content
      const index = store.index('isDownloaded');
      const request = index.getAll(true);
      
      request.onsuccess = () => {
        let content = request.result as OfflineContentMetadata[];
        
        // Filter by type if provided
        if (type) {
          content = content.filter(item => item.type === type);
        }
        
        resolve(content);
      };
      
      request.onerror = () => {
        reject(new Error('Failed to get downloaded content'));
      };
    });
  }
  
  /**
   * Delete downloaded content
   */
  public async deleteContent(contentId: string): Promise<boolean> {
    if (!this.db) await this.initDatabase();
    
    try {
      // Delete from IndexedDB
      await this.deleteContentFromDB(contentId);
      
      // Update metadata
      await this.updateContentMetadata(contentId, { isDownloaded: false });
      
      // If service worker is available, tell it to remove from cache
      if (this.serviceWorkerRegistered && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'remove_content',
          contentId
        });
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting content ${contentId}:`, error);
      return false;
    }
  }
  
  /**
   * Delete content from IndexedDB
   */
  private async deleteContentFromDB(contentId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = this.db.transaction(this.CONTENT_STORE, 'readwrite');
      const store = transaction.objectStore(this.CONTENT_STORE);
      const request = store.delete(contentId);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete content'));
    });
  }
  
  /**
   * Read content from IndexedDB
   */
  public async getContent(contentId: string): Promise<ArrayBuffer | null> {
    if (!this.db) await this.initDatabase();
    
    return new Promise((resolve) => {
      if (!this.db) {
        resolve(null);
        return;
      }
      
      const transaction = this.db.transaction(this.CONTENT_STORE, 'readonly');
      const store = transaction.objectStore(this.CONTENT_STORE);
      const request = store.get(contentId);
      
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.data);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = () => {
        console.error(`Failed to get content ${contentId}`);
        resolve(null);
      };
    });
  }
  
  /**
   * Clear all offline content
   */
  public async clearAllContent(): Promise<boolean> {
    if (!this.db) await this.initDatabase();
    
    try {
      if (!this.db) return false;
      
      // Clear content store
      await this.clearObjectStore(this.CONTENT_STORE);
      
      // Update all metadata
      const transaction = this.db.transaction(this.METADATA_STORE, 'readwrite');
      const store = transaction.objectStore(this.METADATA_STORE);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const metadataItems = request.result as OfflineContentMetadata[];
        
        metadataItems.forEach(item => {
          item.isDownloaded = false;
          store.put(item);
        });
      };
      
      // Clear service worker cache
      if (this.serviceWorkerRegistered && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'clear_all_content'
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error clearing all content:', error);
      return false;
    }
  }
  
  /**
   * Clear an object store
   */
  private async clearObjectStore(storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to clear ${storeName}`));
    });
  }
  
  /**
   * Sync content with server for updates
   * Returns list of content that needs updates
   */
  public async checkForContentUpdates(): Promise<OfflineContentMetadata[]> {
    try {
      // Get all downloaded content metadata
      const downloadedContent = await this.getDownloadedContent();
      
      // Get latest content metadata from server
      const availableContent = await this.getAvailableContent();
      
      // Find content that needs updates
      const outdatedContent = downloadedContent.filter(downloaded => {
        const latest = availableContent.find(available => available.id === downloaded.id);
        return latest && latest.version !== downloaded.version;
      });
      
      return outdatedContent;
    } catch (error) {
      console.error('Error checking for content updates:', error);
      return [];
    }
  }
  
  /**
   * Get offline navigation structure (for Quran, Hadith, etc.)
   */
  public async getOfflineNavigationStructure(contentId: string): Promise<any> {
    // This would fetch the navigation structure from IndexedDB
    // For simplicity in this prototype, we'll just return mock data
    
    if (contentId === 'quran-ar' || contentId === 'quran-en') {
      return {
        chapters: [
          { id: 1, name: 'الفاتحة', nameTransliterated: 'Al-Fatiha', verses: 7 },
          { id: 2, name: 'البقرة', nameTransliterated: 'Al-Baqarah', verses: 286 },
          // ... more chapters
        ]
      };
    }
    
    if (contentId === 'hadith-bukhari') {
      return {
        books: [
          { id: 1, name: 'بدء الوحي', hadithCount: 7 },
          { id: 2, name: 'الإيمان', hadithCount: 42 },
          // ... more books
        ]
      };
    }
    
    return null;
  }
  
  /**
   * Check if app is online
   */
  public isOnline(): boolean {
    return navigator.onLine;
  }
  
  /**
   * Register callbacks for online/offline events
   */
  public registerConnectivityListeners(
    onOnline: () => void,
    onOffline: () => void
  ): void {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
  }
  
  /**
   * Unregister callbacks for online/offline events
   */
  public unregisterConnectivityListeners(
    onOnline: () => void,
    onOffline: () => void
  ): void {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  }
}

// Export as singleton
const offlineContentService = new OfflineContentService();
export default offlineContentService;
