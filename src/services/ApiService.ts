/**
 * Sabeel API Service
 * 
 * Comprehensive API service for Canvas LMS and JupyterHub integration
 * with caching, rate limiting, and error handling
 */

interface ApiConfig {
  baseUrl: string;
  token?: string;
  timeout?: number;
  retries?: number;
  cacheMaxAge?: number;
}

interface RateLimit {
  remaining: number;
  reset: number;
  limit: number;
}

interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

export class ApiService {
  private baseUrl: string;
  private headers: Record<string, string>;
  private timeout: number;
  private retries: number;
  private cache = new Map<string, CacheEntry>();
  private cacheMaxAge: number;
  private rateLimit: RateLimit | null = null;

  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.timeout = config.timeout || 30000;
    this.retries = config.retries || 3;
    this.cacheMaxAge = config.cacheMaxAge || 5 * 60 * 1000; // 5 minutes

    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (config.token) {
      this.headers['Authorization'] = `Bearer ${config.token}`;
    }
  }

  /**
   * Make an authenticated API request with retry logic and caching
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useCache = true
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const method = options.method || 'GET';
    const cacheKey = this.getCacheKey(method, url, options.body);

    // Check cache for GET requests
    if (useCache && method === 'GET') {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Check rate limiting
    await this.checkRateLimit();

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout),
    };

    let lastError: Error;
    
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const response = await fetch(url, requestOptions);
        
        // Update rate limit info
        this.updateRateLimit(response);

        if (!response.ok) {
          await this.handleErrorResponse(response, url, attempt);
          continue;
        }

        const data = await response.json();

        // Cache successful GET responses
        if (useCache && method === 'GET') {
          this.addToCache(cacheKey, data);
        }

        return data;
      } catch (error) {
        lastError = error as Error;
        
        if (this.shouldRetry(error as Error, attempt)) {
          const delay = this.getRetryDelay(attempt);
          console.warn(`Request failed, retrying in ${delay}ms...`, error);
          await this.sleep(delay);
          continue;
        }
        
        break;
      }
    }

    throw lastError!;
  }

  /**
   * Handle error responses with appropriate retry logic
   */
  private async handleErrorResponse(response: Response, url: string, attempt: number) {
    if (response.status === 401) {
      throw new Error('Authentication failed. Please check your API token.');
    }
    
    if (response.status === 403) {
      throw new Error('Access forbidden. Insufficient permissions.');
    }
    
    if (response.status === 404) {
      throw new Error(`Resource not found: ${url}`);
    }
    
    if (response.status === 429) {
      // Rate limit exceeded
      const retryAfter = response.headers.get('Retry-After');
      const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 60000;
      
      console.warn(`Rate limit exceeded. Waiting ${waitTime}ms...`);
      await this.sleep(waitTime);
      return; // Will retry
    }

    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || response.statusText;
    
    if (response.status >= 500 && attempt < this.retries) {
      // Server error, retry
      return;
    }
    
    throw new Error(`API Error: ${response.status} - ${errorMessage}`);
  }

  /**
   * Check if we need to wait due to rate limiting
   */
  private async checkRateLimit() {
    if (!this.rateLimit) return;

    const now = Date.now();
    if (this.rateLimit.remaining <= 1 && now < this.rateLimit.reset) {
      const waitTime = this.rateLimit.reset - now + 100; // Add 100ms buffer
      console.warn(`Rate limit protection: waiting ${waitTime}ms...`);
      await this.sleep(waitTime);
    }
  }

  /**
   * Update rate limit information from response headers
   */
  private updateRateLimit(response: Response) {
    const remaining = response.headers.get('X-Rate-Limit-Remaining');
    const reset = response.headers.get('X-Rate-Limit-Reset');
    const limit = response.headers.get('X-Rate-Limit-Limit');

    if (remaining && reset && limit) {
      this.rateLimit = {
        remaining: parseInt(remaining, 10),
        reset: Date.now() + (parseInt(reset, 10) * 1000),
        limit: parseInt(limit, 10),
      };
    }
  }

  /**
   * Determine if an error should trigger a retry
   */
  private shouldRetry(error: Error, attempt: number): boolean {
    if (attempt >= this.retries) return false;
    
    // Retry on network errors, timeouts, and server errors
    return (
      error.name === 'AbortError' ||
      error.message.includes('network') ||
      error.message.includes('fetch') ||
      error.message.includes('timeout')
    );
  }

  /**
   * Calculate exponential backoff delay
   */
  private getRetryDelay(attempt: number): number {
    return Math.min(1000 * Math.pow(2, attempt), 10000); // Max 10 seconds
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate cache key
   */
  private getCacheKey(method: string, url: string, body?: any): string {
    const bodyStr = body ? JSON.stringify(body) : '';
    return `${method}-${url}-${bodyStr}`;
  }

  /**
   * Get data from cache if valid
   */
  private getFromCache(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Add data to cache
   */
  private addToCache(key: string, data: any): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + this.cacheMaxAge,
    });

    // Cleanup old entries periodically
    if (this.cache.size > 200) {
      this.cleanupCache();
    }
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear cache
   */
  clearCache(pattern?: RegExp): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
} 