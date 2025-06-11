/**
 * Performance Optimization Service
 * 
 * Handles caching, lazy loading, pagination, and data optimization
 */

interface CacheConfig {
  maxSize: number;
  ttl: number; // Time to live in milliseconds
  strategy: 'lru' | 'fifo' | 'ttl';
}

interface PaginationOptions {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface LazyLoadOptions {
  threshold: number; // Distance from bottom to trigger load
  batchSize: number;
  preloadCount: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  accessCount: number;
  lastAccessed: number;
}

export class PerformanceService {
  private caches = new Map<string, Map<string, CacheEntry<any>>>();
  private defaultCacheConfig: CacheConfig = {
    maxSize: 1000,
    ttl: 5 * 60 * 1000, // 5 minutes
    strategy: 'lru',
  };
  private requestDeduplication = new Map<string, Promise<any>>();
  private batchQueue = new Map<string, { requests: any[]; timer: NodeJS.Timeout }>();

  /**
   * Create or get cache instance
   */
  private getCache(cacheName: string): Map<string, CacheEntry<any>> {
    if (!this.caches.has(cacheName)) {
      this.caches.set(cacheName, new Map());
    }
    return this.caches.get(cacheName)!;
  }

  /**
   * Set data in cache
   */
  set<T>(cacheName: string, key: string, data: T, config?: Partial<CacheConfig>): void {
    const cache = this.getCache(cacheName);
    const cacheConfig = { ...this.defaultCacheConfig, ...config };
    const now = Date.now();

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + cacheConfig.ttl,
      accessCount: 0,
      lastAccessed: now,
    };

    cache.set(key, entry);

    // Cleanup if cache is too large
    if (cache.size > cacheConfig.maxSize) {
      this.cleanup(cacheName, cacheConfig);
    }
  }

  /**
   * Get data from cache
   */
  get<T>(cacheName: string, key: string): T | null {
    const cache = this.getCache(cacheName);
    const entry = cache.get(key);

    if (!entry) return null;

    const now = Date.now();

    // Check if expired
    if (now > entry.expiresAt) {
      cache.delete(key);
      return null;
    }

    // Update access stats
    entry.accessCount++;
    entry.lastAccessed = now;

    return entry.data;
  }

  /**
   * Check if data exists in cache
   */
  has(cacheName: string, key: string): boolean {
    const cache = this.getCache(cacheName);
    const entry = cache.get(key);

    if (!entry) return false;

    const now = Date.now();
    if (now > entry.expiresAt) {
      cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete from cache
   */
  delete(cacheName: string, key: string): void {
    const cache = this.getCache(cacheName);
    cache.delete(key);
  }

  /**
   * Clear entire cache
   */
  clear(cacheName: string): void {
    const cache = this.getCache(cacheName);
    cache.clear();
  }

  /**
   * Cleanup cache based on strategy
   */
  private cleanup(cacheName: string, config: CacheConfig): void {
    const cache = this.getCache(cacheName);
    const entries = Array.from(cache.entries());
    const now = Date.now();

    // Remove expired entries first
    entries.forEach(([key, entry]) => {
      if (now > entry.expiresAt) {
        cache.delete(key);
      }
    });

    // If still too large, apply strategy
    if (cache.size > config.maxSize) {
      const activeEntries = Array.from(cache.entries());
      const toRemove = activeEntries.length - config.maxSize;

      let sortedEntries: [string, CacheEntry<any>][];

      switch (config.strategy) {
        case 'lru':
          sortedEntries = activeEntries.sort(([,a], [,b]) => a.lastAccessed - b.lastAccessed);
          break;
        case 'fifo':
          sortedEntries = activeEntries.sort(([,a], [,b]) => a.timestamp - b.timestamp);
          break;
        case 'ttl':
          sortedEntries = activeEntries.sort(([,a], [,b]) => a.expiresAt - b.expiresAt);
          break;
        default:
          sortedEntries = activeEntries;
      }

      for (let i = 0; i < toRemove; i++) {
        cache.delete(sortedEntries[i][0]);
      }
    }
  }

  /**
   * Get or set with async function
   */
  async getOrSet<T>(
    cacheName: string,
    key: string,
    factory: () => Promise<T>,
    config?: Partial<CacheConfig>
  ): Promise<T> {
    // Check cache first
    const cached = this.get<T>(cacheName, key);
    if (cached !== null) {
      return cached;
    }

    // Check if request is already in progress (deduplication)
    const requestKey = `${cacheName}:${key}`;
    if (this.requestDeduplication.has(requestKey)) {
      return this.requestDeduplication.get(requestKey)!;
    }

    // Make request and cache result
    const promise = factory().then(data => {
      this.set(cacheName, key, data, config);
      this.requestDeduplication.delete(requestKey);
      return data;
    }).catch(error => {
      this.requestDeduplication.delete(requestKey);
      throw error;
    });

    this.requestDeduplication.set(requestKey, promise);
    return promise;
  }

  /**
   * Batch multiple requests together
   */
  async batchRequest<T>(
    batchKey: string,
    requestData: any,
    processor: (requests: any[]) => Promise<T[]>,
    delay = 100
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      let batch = this.batchQueue.get(batchKey);

      if (!batch) {
        batch = {
          requests: [],
          timer: setTimeout(async () => {
            const currentBatch = this.batchQueue.get(batchKey);
            if (currentBatch) {
              this.batchQueue.delete(batchKey);
              
              try {
                const results = await processor(currentBatch.requests.map(r => r.data));
                currentBatch.requests.forEach((request, index) => {
                  request.resolve(results[index]);
                });
              } catch (error) {
                currentBatch.requests.forEach(request => {
                  request.reject(error);
                });
              }
            }
          }, delay),
        };
        
        this.batchQueue.set(batchKey, batch);
      }

      batch.requests.push({
        data: requestData,
        resolve,
        reject,
      });
    });
  }

  /**
   * Paginate data with caching
   */
  async paginate<T>(
    cacheName: string,
    fetcher: (options: PaginationOptions) => Promise<PaginatedResult<T>>,
    options: PaginationOptions,
    cacheConfig?: Partial<CacheConfig>
  ): Promise<PaginatedResult<T>> {
    const cacheKey = this.generatePaginationKey(options);
    
    return this.getOrSet(
      cacheName,
      cacheKey,
      () => fetcher(options),
      cacheConfig
    );
  }

  /**
   * Generate cache key for pagination
   */
  private generatePaginationKey(options: PaginationOptions): string {
    const { page, limit, sort, order, filters } = options;
    const filterStr = filters ? JSON.stringify(filters) : '';
    return `page:${page}-limit:${limit}-sort:${sort || 'default'}-order:${order || 'asc'}-filters:${filterStr}`;
  }

  /**
   * Lazy load with infinite scroll
   */
  createLazyLoader<T>(
    containerElement: HTMLElement,
    fetchMore: (page: number) => Promise<T[]>,
    options: LazyLoadOptions = {
      threshold: 200,
      batchSize: 20,
      preloadCount: 2,
    }
  ): {
    start: () => void;
    stop: () => void;
    loadMore: () => Promise<void>;
    reset: () => void;
  } {
    let currentPage = 1;
    let loading = false;
    let hasMore = true;
    let observer: IntersectionObserver | null = null;

    const loadMore = async (): Promise<void> => {
      if (loading || !hasMore) return;

      loading = true;
      try {
        const newItems = await fetchMore(currentPage);
        
        if (newItems.length < options.batchSize) {
          hasMore = false;
        }

        currentPage++;
      } catch (error) {
        console.error('Failed to load more items:', error);
      } finally {
        loading = false;
      }
    };

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = containerElement;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      if (distanceFromBottom < options.threshold && !loading && hasMore) {
        // Preload multiple pages if specified
        for (let i = 0; i < options.preloadCount; i++) {
          setTimeout(() => loadMore(), i * 100);
        }
      }
    };

    const start = () => {
      // Use Intersection Observer for better performance
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            handleScroll();
          }
        });
      }, {
        root: containerElement,
        threshold: 0.1,
      });

      // Create a sentinel element
      const sentinel = document.createElement('div');
      sentinel.style.height = '1px';
      sentinel.style.position = 'absolute';
      sentinel.style.bottom = `${options.threshold}px`;
      containerElement.appendChild(sentinel);
      observer.observe(sentinel);

      // Fallback to scroll event
      containerElement.addEventListener('scroll', handleScroll, { passive: true });
    };

    const stop = () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      containerElement.removeEventListener('scroll', handleScroll);
    };

    const reset = () => {
      currentPage = 1;
      loading = false;
      hasMore = true;
    };

    return { start, stop, loadMore, reset };
  }

  /**
   * Optimize images with lazy loading and WebP support
   */
  optimizeImages(container: HTMLElement): void {
    const images = container.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          
          if (src) {
            // Check WebP support
            const supportsWebP = this.supportsWebP();
            const optimizedSrc = supportsWebP && !src.includes('.webp') 
              ? src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
              : src;
            
            img.src = optimizedSrc;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  /**
   * Check WebP support
   */
  private supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  /**
   * Preload critical resources
   */
  preloadResources(resources: Array<{
    url: string;
    type: 'script' | 'style' | 'image' | 'fetch';
    priority?: 'high' | 'medium' | 'low';
  }>): void {
    resources.forEach(resource => {
      switch (resource.type) {
        case 'script':
          this.preloadScript(resource.url, resource.priority);
          break;
        case 'style':
          this.preloadStyle(resource.url, resource.priority);
          break;
        case 'image':
          this.preloadImage(resource.url);
          break;
        case 'fetch':
          this.preloadFetch(resource.url);
          break;
      }
    });
  }

  private preloadScript(url: string, priority = 'medium'): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = url;
    if (priority === 'high') {
      link.setAttribute('importance', 'high');
    }
    document.head.appendChild(link);
  }

  private preloadStyle(url: string, priority = 'medium'): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = url;
    if (priority === 'high') {
      link.setAttribute('importance', 'high');
    }
    document.head.appendChild(link);
  }

  private preloadImage(url: string): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  }

  private preloadFetch(url: string): void {
    fetch(url, { 
      method: 'GET',
      priority: 'low' as any,
    }).catch(() => {
      // Ignore preload errors
    });
  }

  /**
   * Get cache statistics
   */
  getCacheStats(cacheName?: string): Record<string, any> {
    if (cacheName) {
      const cache = this.getCache(cacheName);
      const entries = Array.from(cache.values());
      const now = Date.now();

      return {
        name: cacheName,
        size: cache.size,
        hitRate: this.calculateHitRate(entries),
        expiredCount: entries.filter(entry => now > entry.expiresAt).length,
      };
    }

    const stats: Record<string, any> = {};
    this.caches.forEach((cache, name) => {
      stats[name] = this.getCacheStats(name);
    });

    return stats;
  }

  private calculateHitRate(entries: CacheEntry<any>[]): number {
    const totalAccess = entries.reduce((sum, entry) => sum + entry.accessCount, 0);
    return entries.length > 0 ? totalAccess / entries.length : 0;
  }

  /**
   * Memory management
   */
  getMemoryUsage(): {
    used: number;
    total: number;
    percentage: number;
  } {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
      };
    }

    return {
      used: 0,
      total: 0,
      percentage: 0,
    };
  }

  /**
   * Cleanup all caches
   */
  cleanup(): void {
    this.caches.forEach((cache, name) => {
      this.cleanup(name, this.defaultCacheConfig);
    });

    // Clear batch queue
    this.batchQueue.forEach(batch => {
      clearTimeout(batch.timer);
    });
    this.batchQueue.clear();

    // Clear request deduplication
    this.requestDeduplication.clear();
  }
} 